/**
 * Backend API base URL helper.
 * NOTE: backend_api OpenAPI spec currently only has a health check route. This is kept for
 * upcoming API integration work.
 */
const baseUrl = process.env.BACKEND_BASE_URL || '';

// PUBLIC_INTERFACE
export function getBackendBaseUrl() {
  /** Returns the configured backend base URL (or empty string if not set). */
  return baseUrl;
}
