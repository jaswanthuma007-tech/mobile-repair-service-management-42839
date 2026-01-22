import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Alert, Button, Card, TextField } from '../ui/tw';

// PUBLIC_INTERFACE
export default function ForgotPasswordPage() {
  /** Sends password reset email via Supabase. */
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);
    try {
      // IMPORTANT: In production configure redirect URL; CRA env must be prefixed with REACT_APP_.
      // Ask orchestrator/user to set REACT_APP_SITE_URL (or SITE_URL if your build pipeline supports it).
      const siteUrl = process.env.REACT_APP_SITE_URL || process.env.SITE_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/login`
      });
      if (error) throw error;
      setInfoMsg('If an account exists for this email, a reset link has been sent.');
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Forgot password"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            Remembered? <Link to="/login">Sign in</Link>
          </span>
          <span>
            New here? <Link to="/register">Create account</Link>
          </span>
        </div>
      }
    >
      {errorMsg ? <Alert>{errorMsg}</Alert> : null}
      {infoMsg ? <Alert variant="info">{infoMsg}</Alert> : null}

      <form onSubmit={onSubmit} className="grid gap-3">
        <TextField label="Email" value={email} onChange={setEmail} placeholder="you@domain.com" autoComplete="email" />
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <div className="text-xs text-ocean-muted">
        Note: Supabase email templates + redirect URL must be configured for production.
      </div>
    </Card>
  );
}
