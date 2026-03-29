/**
 * Stable date conversion helpers for Gantt ↔ Supabase round-trips.
 *
 * The Gantt component works with JS Date objects.
 * Supabase stores timestamptz as ISO-8601 strings.
 */

function parseGanttDateString(value: string): Date | null {
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);

  if (!match) return null;

  const [, day, month, year, hours = "00", minutes = "00", seconds = "00"] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));

  return Number.isNaN(date.getTime()) ? null : date;
}

/** Convert a JS Date or supported Gantt string to an ISO-8601 string for Supabase. */
export function dateToISO(d: Date | string | null | undefined): string | null {
  if (!d) return null;

  if (d instanceof Date) {
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  if (typeof d === "string") {
    const parsed = parseGanttDateString(d) ?? new Date(d);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  return null;
}

/** Convert an ISO-8601 string (or null) to a JS Date for Gantt. */
export function isoToDate(s: string | null | undefined): Date {
  if (!s) return new Date();
  return new Date(s);
}
