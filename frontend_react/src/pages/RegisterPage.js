import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Alert, Button, Card, TextField } from '../ui/tw';

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** Register form that creates a Supabase email/password user; stores role in user metadata and best-effort profiles upsert. */
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('customer');
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
      const { user } = await signUp({ email, password, role });

      // Depending on Supabase email confirmation settings, session may not be created immediately.
      if (user) {
        setInfoMsg('Account created. You can now sign in.');
      } else {
        setInfoMsg('Account created. Please check your email to verify, then sign in.');
      }
      navigate('/login', { replace: true });
    } catch (err) {
      setErrorMsg(err?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Create account"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            Already have an account? <Link to="/login">Sign in</Link>
          </span>
          <span className="text-xs">Email verification supported</span>
        </div>
      }
    >
      {errorMsg ? <Alert>{errorMsg}</Alert> : null}
      {infoMsg ? <Alert variant="info">{infoMsg}</Alert> : null}

      <form onSubmit={onSubmit} className="grid gap-3">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-ocean-muted" htmlFor="role">
            Role (demo)
          </label>
          <select
            id="role"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-ocean-text outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
            <option value="admin">Admin</option>
          </select>
          <div className="text-xs text-ocean-muted">
            For production, restrict admin/technician assignment via server-side rules or admin tooling.
          </div>
        </div>

        <TextField label="Email" value={email} onChange={setEmail} placeholder="you@company.com" autoComplete="email" />
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
  );
}
