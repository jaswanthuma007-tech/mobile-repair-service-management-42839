import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function BookRepairPage() {
  /** Backward-compatible public booking entry; forwards to the explicit flow scaffolding page. */
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/book-flow', { replace: true });
  }, [navigate]);

  // Minimal fallback UI (should rarely be seen).
  return <div className="min-h-[40vh]" />;
}
