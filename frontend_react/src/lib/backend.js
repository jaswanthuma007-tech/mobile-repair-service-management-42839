/**
 * Backend API base URL helper.
 *
 * In Create React App builds, only environment variables prefixed with REACT_APP_
 * are injected at build time. We support both to keep local tooling flexible.
 */
const baseUrl =
  process.env.REACT_APP_BACKEND_BASE_URL ||
  process.env.BACKEND_BASE_URL ||
  '';

// PUBLIC_INTERFACE
export function getBackendBaseUrl() {
  /** Returns the configured backend base URL (or empty string if not set). */
  return baseUrl;
}
