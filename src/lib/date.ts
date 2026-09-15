const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Parse an ISO date string ("YYYY-MM-DD", optionally with a time component)
 * into a UTC-midnight timestamp so day-diff math isn't skewed by the local
 * timezone or DST.
 */
function toUtcMidnight(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Number of whole days between an ISO date string and a given Date,
 * counting the `fromISO` day as day 0.
 */
export function diffDays(fromISO: string, toDate: Date): number {
  const from = new Date(fromISO);
  const fromMs = toUtcMidnight(from);
  const toMs = toUtcMidnight(toDate);
  return Math.round((toMs - fromMs) / MS_PER_DAY);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

/**
 * Computes the current 1-indexed roadmap week (1–17) from the user's chosen
 * start date and today's date. Returns `null` if `startDate` is unset —
 * callers must handle that case (e.g. prompting the user to set it) per
 * CLAUDE.md's Dashboard requirement.
 */
export function currentWeekFromStartDate(
  startDate: string,
  today: Date,
): number | null {
  if (!startDate) return null;
  return clamp(Math.ceil((diffDays(startDate, today) + 1) / 7), 1, 17);
}
