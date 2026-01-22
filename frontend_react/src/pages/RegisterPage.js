import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button, Card, TextField } from '../ui/components';

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** Register form that creates a Supabase email/password user. */
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);
    try {
      const { user } = await signUp({ email, password });
      // Depending on Supabase email confirmation settings, session may not be created immediately.
      if (user) {
        setInfoMsg('Account created. You can now sign in.');
        navigate('/login', { replace: true });
      } else {
        setInfoMsg('Account created. Please check your email to confirm, then sign in.');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pageCenter">
      <Card
        title="Create account"
        footer={
          <>
            <span>
              Already have an account? <Link to="/login">Sign in</Link>
            </span>
            <span style={{ color: 'var(--ocean-muted)' }}>No secrets hardcoded</span>
          </>
        }
      >
        {errorMsg ? <div className="alert">{errorMsg}</div> : null}
        {infoMsg ? (
          <div
            className="alert"
            style={{
              borderColor: 'rgba(245,158,11,0.28)',
              background: 'rgba(245,158,11,0.10)',
              color: '#92400e'
            }}
          >
            {infoMsg}
          </div>
        ) : null}

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
            placeholder="Create a strong password"
            autoComplete="new-password"
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
