import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button, Card, TextField } from '../ui/components';

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login form that authenticates using Supabase email/password. */
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => location.state?.from || '/home', [location.state]);

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
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pageCenter">
      <Card
        title="Sign in"
        footer={
          <>
            <span>
              Need an account? <Link to="/register">Create one</Link>
            </span>
            <span style={{ color: 'var(--ocean-muted)' }}>Ocean Professional</span>
          </>
        }
      >
        {errorMsg ? <div className="alert">{errorMsg}</div> : null}

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <TextField
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@company.com"
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
