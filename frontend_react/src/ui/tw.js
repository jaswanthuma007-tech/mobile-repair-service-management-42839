import React from 'react';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

// PUBLIC_INTERFACE
export function Container({ children, className }) {
  /** Centered responsive container wrapper. */
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

// PUBLIC_INTERFACE
export function Button({ children, className, variant = 'primary', type = 'button', disabled, onClick }) {
  /** Tailwind button with primary/secondary/ghost variants. */
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ocean-bg disabled:opacity-60 disabled:cursor-not-allowed';
  const variants = {
    primary:
      'bg-ocean-primary text-white hover:bg-blue-700 focus:ring-ocean-primary shadow-[0_10px_20px_rgba(37,99,235,0.18)]',
    secondary:
      'bg-amber-100 text-amber-900 hover:bg-amber-200 focus:ring-ocean-secondary border border-amber-200',
    ghost: 'bg-transparent text-ocean-text hover:bg-black/5 focus:ring-ocean-primary'
  };

  return (
    <button type={type} className={cn(base, variants[variant] || variants.primary, className)} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

// PUBLIC_INTERFACE
export function TextField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  name
}) {
  /** Labeled input field. */
  const id = React.useId();
  return (
    <div className="grid gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-ocean-muted">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        name={name}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-ocean-text outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  );
}

// PUBLIC_INTERFACE
export function TextArea({ label, value, onChange, placeholder, required = true, name, rows = 4 }) {
  /** Labeled textarea field. */
  const id = React.useId();
  return (
    <div className="grid gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-ocean-muted">
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        name={name}
        rows={rows}
        className="w-full resize-y rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-ocean-text outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

// PUBLIC_INTERFACE
export function Card({ title, children, className, footer }) {
  /** Card surface container. */
  return (
    <section className={cn('rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]', className)}>
      {title ? <h2 className="mb-3 text-lg font-extrabold tracking-tight">{title}</h2> : null}
      <div className="grid gap-3">{children}</div>
      {footer ? <div className="mt-4 border-t border-black/10 pt-3 text-sm text-ocean-muted">{footer}</div> : null}
    </section>
  );
}

// PUBLIC_INTERFACE
export function Alert({ children, variant = 'error', className }) {
  /** Inline alert (error/info/success). */
  const styles = {
    error: 'border-red-500/30 bg-red-500/10 text-red-800',
    info: 'border-blue-500/25 bg-blue-500/10 text-blue-800',
    success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-800',
    warning: 'border-amber-500/25 bg-amber-500/10 text-amber-900'
  };
  return (
    <div className={cn('rounded-xl border px-3 py-2 text-sm', styles[variant] || styles.info, className)} role="alert">
      {children}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Spinner({ label = 'Loading…' }) {
  /** Small loading spinner with label. */
  return (
    <div className="inline-flex items-center gap-2 text-sm text-ocean-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/10 border-t-ocean-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
