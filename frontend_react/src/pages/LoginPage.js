import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getMyRole } from '../lib/profileApi';
import { Alert, Button, Card, Spinner, TextField } from '../ui/tw';

function roleLandingPath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'technician') return '/technician';
  return '/customer';
}

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login form that authenticates using Supabase email/password and redirects by role. */
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => location.state?.from || null, [location.state]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithPassword({ email, password });

      // Role-based routing: if user attempted to open a protected route, honor it.
      // Otherwise, redirect to role portal.
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      const role = await getMyRole();
      navigate(roleLandingPath(role), { replace: true });
    } catch (err) {
      setErrorMsg(err?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Sign in"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            Need an account? <Link to="/register">Create one</Link>
          </span>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      }
    >
      {errorMsg ? <Alert>{errorMsg}</Alert> : null}

      <form onSubmit={onSubmit} className="grid gap-3">
        <TextField label="Email" value={email} onChange={setEmail} placeholder="you@company.com" autoComplete="email" />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner label="Signing in…" />
            </span>
          ) : (
            'Sign in'
          )}
        </Button>

        <div className="text-xs text-ocean-muted">
          Tip: After sign in, you will be redirected to Customer/Technician/Admin portal based on your profile role.
        </div>
      </form>
    </Card>
  );
}
