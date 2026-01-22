import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

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
      async signUp({ email, password }) {
        /** Register a user via email+password. */
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data;
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
