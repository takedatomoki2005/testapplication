import type { Customer, VisitRecord } from "@/data/types";

/** WEEKDAY_LABELS order: 日=0 … 土=6 (JS getDay()) */
const WEEK_LENGTH = 7;

function emptyWeek(): number[] {
  return Array(WEEK_LENGTH).fill(0);
}

/** Count visits per weekday from dated history */
export function buildWeeklyVisitsFromHistory(visitHistory: VisitRecord[]): number[] {
  const counts = emptyWeek();
  for (const visit of visitHistory) {
    const day = new Date(`${visit.date}T12:00:00`).getDay();
    counts[day] = (counts[day] ?? 0) + 1;
  }
  return counts;
}

/**
 * When history has fewer rows than visitCount, scale counts so the chart
 * reflects total visits while keeping the same weekday shape.
 */
function scaleToVisitCount(pattern: number[], visitCount: number): number[] {
  const sum = pattern.reduce((a, b) => a + b, 0);
  if (sum === 0 || visitCount <= sum) return pattern;
  const scaled = pattern.map((n) => Math.max(n, Math.round((n / sum) * visitCount)));
  let diff = visitCount - scaled.reduce((a, b) => a + b, 0);
  const order = [...scaled.keys()].sort((a, b) => scaled[b]! - scaled[a]!);
  let i = 0;
  while (diff > 0) {
    scaled[order[i % order.length]!]! += 1;
    diff -= 1;
    i += 1;
  }
  return scaled;
}

/** Stable pseudo-random weekday spread from customer id (fallback) */
function defaultPatternFromCustomer(customer: Customer): number[] {
  const total = Math.max(customer.visitCount, 1);
  const seed = customer.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const weights = Array.from({ length: WEEK_LENGTH }, (_, i) => {
    const weekendBoost = i === 0 || i === 5 || i === 6 ? 3 : 1;
    return ((seed + i * 17) % 7) + 1 + weekendBoost;
  });
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const pattern = weights.map((w) => Math.max(0, Math.floor((w / weightSum) * total)));
  return scaleToVisitCount(pattern, total);
}

/**
 * Resolved weekday visit counts for the spending chart.
 * Uses explicit weeklyVisits when set; otherwise history; otherwise estimated from visitCount.
 */
export function resolveWeeklyVisits(customer: Customer): number[] {
  const explicit = customer.weeklyVisits;
  if (explicit?.length === WEEK_LENGTH) {
    return explicit;
  }

  const fromHistory = buildWeeklyVisitsFromHistory(customer.visitHistory ?? []);
  if (fromHistory.some((n) => n > 0)) {
    return scaleToVisitCount(fromHistory, customer.visitCount);
  }

  return defaultPatternFromCustomer(customer);
}

export function hasWeeklyVisitActivity(pattern: number[]): boolean {
  return pattern.some((n) => n > 0);
}

/** Weekdays (0=日 … 6=土) this customer visits, busiest first */
export function getCustomerVisitWeekdays(customer: Customer): number[] {
  const pattern = resolveWeeklyVisits(customer);
  return pattern
    .map((count, day) => ({ day, count }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count || a.day - b.day)
    .map(({ day }) => day);
}

export function customerMatchesWeekdayFilter(
  customer: Customer,
  selectedWeekdays: number[],
): boolean {
  if (selectedWeekdays.length === 0) return true;
  const active = getCustomerVisitWeekdays(customer);
  return selectedWeekdays.some((day) => active.includes(day));
}
