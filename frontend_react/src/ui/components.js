import React from 'react';
import './theme.css';

// PUBLIC_INTERFACE
export function Card({ title, children, footer }) {
  /** Simple card container used across auth pages and dashboard. */
  return (
    <section className="card">
      {title ? <h2 className="cardTitle">{title}</h2> : null}
      <div className="cardBody">{children}</div>
      {footer ? <div className="cardFooter">{footer}</div> : null}
    </section>
  );
}

// PUBLIC_INTERFACE
export function TextField({ label, type = 'text', value, onChange, placeholder, autoComplete }) {
  /** Labeled input field with Ocean Professional styles. */
  const id = React.useId();
  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="input"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
    </div>
  );
}

// PUBLIC_INTERFACE
export function Button({ children, variant = 'primary', type = 'button', onClick, disabled }) {
  /** Button with primary/secondary variants. */
  const cls = variant === 'secondary' ? 'btn btnSecondary' : 'btn btnPrimary';
  return (
    <button className={cls} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
