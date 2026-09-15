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

/** Total number of tracked Python warm-up days (weeks 1–4, 7 days each). */
export const WARMUP_TOTAL_DAYS = 28;

/**
 * Computes the current 1-indexed day position (1–28) within the Python
 * warm-up range (weeks 1–4, 7 days/week), clamped so a start date in the
 * future maps to day 1 and a start date more than 4 weeks in the past maps
 * to day 28. Returns `null` if `startDate` is unset. Used to anchor the
 * warm-up streak counter — mirrors `currentWeekFromStartDate`'s day math
 * but at daily granularity instead of weekly.
 */
export function currentWarmupDayIndex(
  startDate: string,
  today: Date,
): number | null {
  if (!startDate) return null;
  return clamp(diffDays(startDate, today) + 1, 1, WARMUP_TOTAL_DAYS);
}

/**
 * Converts a 1-indexed warm-up day position (1–28) into its week (1–4) and
 * day-within-week (1–7).
 */
export function warmupIndexToWeekDay(index: number): {
  week: number;
  day: number;
} {
  const week = clamp(Math.ceil(index / 7), 1, 4);
  const day = index - (week - 1) * 7;
  return { week, day };
}
