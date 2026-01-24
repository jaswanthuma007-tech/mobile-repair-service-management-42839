const STORAGE_KEY = 'mr.booking.v1';

// PUBLIC_INTERFACE
export function loadBookingDraft() {
  /** Loads the in-progress booking draft from localStorage. */
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { brand: null, model: null, issue: null };
    const parsed = JSON.parse(raw);
    return {
      brand: parsed?.brand ?? null,
      model: parsed?.model ?? null,
      issue: parsed?.issue ?? null
    };
  } catch {
    return { brand: null, model: null, issue: null };
  }
}

// PUBLIC_INTERFACE
export function saveBookingDraft(nextDraft) {
  /** Persists booking draft into localStorage. */
  const safe = {
    brand: nextDraft?.brand ?? null,
    model: nextDraft?.model ?? null,
    issue: nextDraft?.issue ?? null
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  return safe;
}

// PUBLIC_INTERFACE
export function clearBookingDraft() {
  /** Clears booking draft from localStorage. */
  window.localStorage.removeItem(STORAGE_KEY);
}

// PUBLIC_INTERFACE
export function updateBookingDraft(patch) {
  /** Patch-updates the booking draft. */
  const current = loadBookingDraft();
  const next = { ...current, ...(patch || {}) };
  return saveBookingDraft(next);
}
