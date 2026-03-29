/**
 * Stable date conversion helpers for Gantt ↔ Supabase round-trips.
 *
 * The Gantt component works with JS Date objects.
 * Supabase stores timestamptz as ISO-8601 strings.
 */

/** Convert a JS Date to an ISO-8601 string for Supabase. */
export function dateToISO(d: Date | null | undefined): string | null {
  if (!d) return null;
  return d.toISOString();
}

/** Convert an ISO-8601 string (or null) to a JS Date for Gantt. */
export function isoToDate(s: string | null | undefined): Date {
  if (!s) return new Date();
  return new Date(s);
}
