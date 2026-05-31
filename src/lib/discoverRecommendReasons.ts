import type { Customer, DateOfBirth, FollowUpContact } from "@/data/types";
import { formatDateOfBirth } from "@/data/customerProfileOptions";
import { formatBirthday } from "./customerDisplay";
import { formatDaysSinceVisit } from "./followUpDiscover";

export type BirthdayTiming = "1month" | "1week" | "eve" | "today";

export interface BirthdayRecommendReason {
  kind: "birthday";
  timing: BirthdayTiming;
  timingLabel: string;
  birthLabel: string;
}

export interface InStoreNominationReason {
  kind: "in-store";
  daysAgo: number;
  daysLabel: string;
}

export type DiscoverRecommendReason = BirthdayRecommendReason | InStoreNominationReason;

const BIRTHDAY_TIMING_LABEL: Record<BirthdayTiming, string> = {
  "1month": "1ヶ月前",
  "1week": "1週間前",
  eve: "前日",
  today: "当日",
};

function daysBetween(from: string, to: string): number {
  const a = new Date(`${from}T00:00:00`);
  const b = new Date(`${to}T00:00:00`);
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

function resolveBirthday(customer: Customer): Pick<DateOfBirth, "month" | "day"> | null {
  if (customer.dateOfBirth) {
    return { month: customer.dateOfBirth.month, day: customer.dateOfBirth.day };
  }
  if (!customer.birthday) return null;
  const [month, day] = customer.birthday.split("-").map(Number);
  if (!month || !day) return null;
  return { month, day };
}

export function daysUntilNextBirthday(
  referenceDate: string,
  dob: Pick<DateOfBirth, "month" | "day">,
): number {
  const ref = new Date(`${referenceDate}T00:00:00`);
  const year = ref.getFullYear();
  let next = new Date(year, dob.month - 1, dob.day);
  if (next < ref) {
    next = new Date(year + 1, dob.month - 1, dob.day);
  }
  return daysBetween(referenceDate, next.toISOString().slice(0, 10));
}

export function resolveBirthdayTiming(daysUntil: number): BirthdayTiming | null {
  if (daysUntil === 0) return "today";
  if (daysUntil === 1) return "eve";
  if (daysUntil >= 2 && daysUntil <= 7) return "1week";
  if (daysUntil >= 8 && daysUntil <= 30) return "1month";
  return null;
}

export function getBirthdayRecommendReason(
  customer: Customer,
  referenceDate: string,
): BirthdayRecommendReason | null {
  const dob = resolveBirthday(customer);
  if (!dob) return null;

  const daysUntil = daysUntilNextBirthday(referenceDate, dob);
  const timing = resolveBirthdayTiming(daysUntil);
  if (!timing) return null;

  const birthLabel =
    customer.dateOfBirth != null
      ? formatDateOfBirth(customer.dateOfBirth)
      : (formatBirthday(customer.birthday) ?? "");

  return {
    kind: "birthday",
    timing,
    timingLabel: BIRTHDAY_TIMING_LABEL[timing],
    birthLabel,
  };
}

export function getLastInStoreNominationReason(
  customer: Customer,
  referenceDate: string,
): InStoreNominationReason | null {
  const visits = customer.visitHistory?.filter((v) => v.type === "in-store") ?? [];
  if (visits.length === 0) return null;

  const latest = visits.reduce((a, b) => (a.date >= b.date ? a : b));
  const daysAgo = daysBetween(latest.date, referenceDate);

  return {
    kind: "in-store",
    daysAgo,
    daysLabel: formatDaysSinceVisit(daysAgo),
  };
}

export function getDiscoverRecommendReasons(
  contact: FollowUpContact,
  referenceDate: string,
): DiscoverRecommendReason[] {
  const reasons: DiscoverRecommendReason[] = [];

  const birthday = getBirthdayRecommendReason(contact.customer, referenceDate);
  if (birthday) reasons.push(birthday);

  const inStore = getLastInStoreNominationReason(contact.customer, referenceDate);
  if (inStore) reasons.push(inStore);

  return reasons;
}

const BIRTHDAY_SCORE: Record<BirthdayTiming, number> = {
  today: 1000,
  eve: 800,
  "1week": 600,
  "1month": 400,
};

export function getRecommendReasonScore(
  contact: FollowUpContact,
  referenceDate: string,
): number {
  const reasons = getDiscoverRecommendReasons(contact, referenceDate);
  let score = 0;

  for (const reason of reasons) {
    if (reason.kind === "birthday") {
      score += BIRTHDAY_SCORE[reason.timing];
    } else if (reason.daysAgo <= 3) {
      score += 300;
    } else if (reason.daysAgo <= 7) {
      score += 250;
    } else if (reason.daysAgo <= 14) {
      score += 180;
    } else if (reason.daysAgo <= 30) {
      score += 120;
    } else {
      score += 50;
    }
  }

  return score;
}

export function compareFollowUpByRecommendReason(
  a: FollowUpContact,
  b: FollowUpContact,
  referenceDate: string,
): number {
  const scoreDiff =
    getRecommendReasonScore(b, referenceDate) - getRecommendReasonScore(a, referenceDate);
  if (scoreDiff !== 0) return scoreDiff;

  const priorityDiff = b.priorityScore - a.priorityScore;
  if (priorityDiff !== 0) return priorityDiff;

  return b.daysSinceSent - a.daysSinceSent;
}
