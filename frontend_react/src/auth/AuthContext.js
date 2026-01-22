import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

async function bestEffortUpsertProfile({ user, role }) {
  // Best-effort: if the "profiles" table exists and RLS allows, set role there.
  // This aligns with backend_api runtime spec (/profiles/me).
  if (!user?.id || !role) return;
  try {
    await supabase.from('profiles').upsert({ user_id: user.id, role }, { onConflict: 'user_id' });
  } catch {
    // Intentionally ignore to avoid blocking signup if schema/RLS is not ready yet.
  }
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Holds the current Supabase session and user and provides auth helper methods. */
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!mounted) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize auth session:', e?.message || e);
      } finally {
        if (mounted) setInitializing(false);
      }
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setInitializing(false);
    });

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    return {
      session,
      user,
      initializing,

      // PUBLIC_INTERFACE
      async signInWithPassword({ email, password }) {
        /** Sign in a user via email+password. */
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
      },

      // PUBLIC_INTERFACE
      async signUp({ email, password, role = 'customer' }) {
        /** Register a user via email+password. Optionally sets app role (customer|technician|admin) in profiles. */
        const siteUrl = process.env.REACT_APP_SITE_URL || process.env.SITE_URL || window.location.origin;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // IMPORTANT: ask orchestrator/user to set REACT_APP_SITE_URL in .env for production.
            emailRedirectTo: `${siteUrl}/login`,
            data: { role }
          }
        });
        if (error) throw error;

        // If a user object is returned immediately, try to upsert profile role.
        await bestEffortUpsertProfile({ user: data?.user, role });

        return data;
      },

      // PUBLIC_INTERFACE
      async sendPasswordResetEmail({ email }) {
        /** Sends Supabase password reset email. */
        const siteUrl = process.env.REACT_APP_SITE_URL || process.env.SITE_URL || window.location.origin;
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl}/login` });
        if (error) throw error;
      },

      // PUBLIC_INTERFACE
      async signOut() {
        /** Sign out the currently authenticated user. */
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
    };
  }, [session, user, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access the current auth state and auth actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
