/**
 * Single source of truth for non-working time rules.
 *
 * Saturday (6) and Sunday (0) are non-working days.
 * Working hours: 08:00–17:00.
 */
export const NON_WORKING_DAYS = new Set([0, 6]); // Sun, Sat

export function isNonWorkingDay(date: Date): boolean {
  return NON_WORKING_DAYS.has(date.getDay());
}

/**
 * Calendar definition passed to the Gantt `calendars` prop.
 * Shape matches the DHTMLX calendar config (typed as `any`
 * because the trial type definition is incomplete).
 */
export const PROJECT_CALENDAR = {
  id: "global",
  worktime: {
    hours: [8, 17],
    days: [0, 1, 1, 1, 1, 1, 0], // Sun=0 … Sat=0
  },
} as any;
