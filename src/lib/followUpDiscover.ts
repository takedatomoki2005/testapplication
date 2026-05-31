import type {
  Customer,
  DiscoverAdvancedFilters,
  FollowUpContact,
  FollowUpFilter,
  FollowUpPriority,
  FollowUpRecord,
  HotCriteria,
} from "@/data/types";
import { evaluateHotCustomer } from "./hotCustomer";
import { formatListCustomerName, resolveCustomerRank, getRankLabel } from "./customerDisplay";

function daysBetween(from: string, to: string): number {
  const a = new Date(`${from}T00:00:00`);
  const b = new Date(`${to}T00:00:00`);
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

export function getCustomerAverageSpending(customer: Customer): number {
  if (customer.averageSpending != null) return customer.averageSpending;
  if (customer.visitCount <= 0) return 0;
  return Math.round(customer.totalSpending / customer.visitCount);
}

export function visitWeekdayFromDate(date: string): number {
  return new Date(`${date}T00:00:00`).getDay();
}

export const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"] as const;

export const EMPTY_DISCOVER_FILTERS: DiscoverAdvancedFilters = {
  weekdays: [],
};

export function countActiveDiscoverFilters(filters: DiscoverAdvancedFilters): number {
  let count = 0;
  if (filters.daysSinceVisitMin != null) count += 1;
  if (filters.daysSinceVisitMax != null) count += 1;
  if (filters.totalSpendingMin != null) count += 1;
  if (filters.totalSpendingMax != null) count += 1;
  if (filters.avgSpendingMin != null) count += 1;
  if (filters.avgSpendingMax != null) count += 1;
  if (filters.weekdays.length > 0) count += 1;
  if (filters.birthdayMonth != null) count += 1;
  if (filters.birthdayDay != null) count += 1;
  return count;
}

function matchesBirthday(customer: Customer, month?: number, day?: number): boolean {
  if (month == null && day == null) return true;
  const dob = customer.dateOfBirth;
  if (!dob) return false;
  if (month != null && dob.month !== month) return false;
  if (day != null && dob.day !== day) return false;
  return true;
}

function rankScore(rank: ReturnType<typeof resolveCustomerRank>): number {
  switch (rank) {
    case "diamond":
      return 40;
    case "platinum":
      return 30;
    case "gold":
      return 20;
    case "silver":
      return 10;
    default:
      return 0;
  }
}

function daysScore(days: number): { score: number; reason: string | null } {
  if (days >= 21) return { score: 45, reason: `${days}日経過 — 連絡優先` };
  if (days >= 14) return { score: 35, reason: `${days}日経過 — そろそろ声かけ` };
  if (days >= 7) return { score: 25, reason: `${days}日後 — フォロー好タイミング` };
  if (days >= 3) return { score: 15, reason: `${days}日後 — 軽い近況メッセージ可` };
  return { score: 5, reason: days <= 1 ? "送信直後" : `${days}日後` };
}

function suggestedAction(days: number, rank: ReturnType<typeof resolveCustomerRank>): string {
  if (days >= 21) {
    return rank === "diamond" || rank === "platinum"
      ? "至急、来店のお誘いを"
      : "久しぶりの声かけを";
  }
  if (days >= 14) return "来店のお誘いメッセージを";
  if (days >= 7) return "近況 + 次回来店のきっかけを";
  if (days >= 3) return "お礼の続き・様子見連絡が自然";
  return "送信直後 — 返信待ち";
}

export function buildFollowUpContact(
  record: FollowUpRecord,
  customer: Customer,
  criteria: HotCriteria,
  referenceDate: string,
): FollowUpContact {
  const hot = evaluateHotCustomer(customer, criteria);
  const rank = resolveCustomerRank(customer, hot);
  const daysSinceSent = daysBetween(record.thankYouSentAt, referenceDate);
  const daysSinceVisit = daysBetween(record.visitDate, referenceDate);
  const visitWeekday = visitWeekdayFromDate(record.visitDate);
  const daysPart = daysScore(daysSinceSent);
  const nominationBonus = Math.min(customer.nominationCount * 2, 12);
  const spendingBonus =
    customer.totalSpending >= 300_000 ? 15 : customer.totalSpending >= 100_000 ? 8 : 0;

  const reasons: string[] = [];
  if (rank) reasons.push(getRankLabel(rank));
  if (daysPart.reason) reasons.push(daysPart.reason);
  if (customer.nominationCount >= 3) reasons.push(`指名${customer.nominationCount}回`);
  if (customer.totalSpending >= 300_000) reasons.push("高単価");

  const priorityScore = rankScore(rank) + daysPart.score + nominationBonus + spendingBonus;
  let priority: FollowUpPriority = "low";
  if (priorityScore >= 70) priority = "urgent";
  else if (priorityScore >= 45) priority = "high";
  else if (priorityScore >= 25) priority = "normal";

  return {
    id: record.id,
    customer,
    castId: record.castId,
    visitDate: record.visitDate,
    thankYouSentAt: record.thankYouSentAt,
    daysSinceSent,
    daysSinceVisit,
    visitWeekday,
    lineName: record.lineName,
    lastMemo: record.lastMemo,
    priority,
    priorityScore,
    priorityReasons: reasons,
    suggestedAction: suggestedAction(daysSinceSent, rank),
  };
}

export function mergeFollowUpRecords(
  records: FollowUpRecord[],
  overrides: Record<string, { lastMemo?: string; lineName?: string }>,
): FollowUpRecord[] {
  return records.map((record) => {
    const override = overrides[record.id];
    if (!override) return record;
    return {
      ...record,
      lineName:
        override.lineName !== undefined
          ? override.lineName || undefined
          : record.lineName,
      lastMemo:
        override.lastMemo !== undefined ? override.lastMemo || undefined : record.lastMemo,
    };
  });
}

export function getFollowUpContacts(
  records: FollowUpRecord[],
  customers: Customer[],
  castId: string,
  criteria: HotCriteria,
  referenceDate: string,
): FollowUpContact[] {
  const customerMap = new Map(customers.map((c) => [c.id, c]));
  return records
    .filter((r) => r.castId === castId)
    .map((record) => {
      const customer = customerMap.get(record.customerId);
      if (!customer) return null;
      return buildFollowUpContact(record, customer, criteria, referenceDate);
    })
    .filter((c): c is FollowUpContact => c !== null)
    .sort((a, b) => b.priorityScore - a.priorityScore || b.daysSinceSent - a.daysSinceSent);
}

function applyPriorityFilter(list: FollowUpContact[], filter: FollowUpFilter): FollowUpContact[] {
  switch (filter) {
    case "needs_follow":
      return list.filter(
        (c) => c.daysSinceSent >= 7 || c.priority === "urgent" || c.priority === "high",
      );
    case "high_priority":
      return list.filter((c) => c.priority === "urgent" || c.priority === "high");
    case "window_3_7":
      return list.filter((c) => c.daysSinceSent >= 3 && c.daysSinceSent <= 7);
    default:
      return list;
  }
}

function applyAdvancedFilters(
  list: FollowUpContact[],
  advanced: DiscoverAdvancedFilters,
): FollowUpContact[] {
  return list.filter((c) => {
    if (
      advanced.daysSinceVisitMin != null &&
      c.daysSinceVisit < advanced.daysSinceVisitMin
    ) {
      return false;
    }
    if (
      advanced.daysSinceVisitMax != null &&
      c.daysSinceVisit > advanced.daysSinceVisitMax
    ) {
      return false;
    }
    if (
      advanced.totalSpendingMin != null &&
      c.customer.totalSpending < advanced.totalSpendingMin
    ) {
      return false;
    }
    if (
      advanced.totalSpendingMax != null &&
      c.customer.totalSpending > advanced.totalSpendingMax
    ) {
      return false;
    }

    const avg = getCustomerAverageSpending(c.customer);
    if (advanced.avgSpendingMin != null && avg < advanced.avgSpendingMin) return false;
    if (advanced.avgSpendingMax != null && avg > advanced.avgSpendingMax) return false;

    if (
      advanced.weekdays.length > 0 &&
      !advanced.weekdays.includes(c.visitWeekday)
    ) {
      return false;
    }

    if (!matchesBirthday(c.customer, advanced.birthdayMonth, advanced.birthdayDay)) {
      return false;
    }

    return true;
  });
}

export function filterFollowUpContacts(
  contacts: FollowUpContact[],
  query: string,
  filter: FollowUpFilter,
  advanced: DiscoverAdvancedFilters = EMPTY_DISCOVER_FILTERS,
): FollowUpContact[] {
  const q = query.trim().toLowerCase();
  let list = contacts;

  if (q) {
    list = list.filter((c) => {
      const { primary, alias } = formatListCustomerName(c.customer);
      const haystack = [
        primary,
        alias,
        c.lineName,
        c.customer.nickname,
        c.customer.fullName,
        c.customer.displayName,
        c.lastMemo,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  list = applyPriorityFilter(list, filter);
  list = applyAdvancedFilters(list, advanced);
  return list;
}

export function formatDaysSinceVisit(days: number): string {
  if (days === 0) return "本日接客";
  if (days === 1) return "1日前";
  return `${days}日前`;
}

export function priorityLabel(priority: FollowUpPriority): string {
  switch (priority) {
    case "urgent":
      return "最優先";
    case "high":
      return "優先";
    case "normal":
      return "通常";
    case "low":
      return "様子見";
  }
}

export function formatDaysSinceSent(days: number): string {
  if (days === 0) return "本日送信";
  if (days === 1) return "1日後";
  return `${days}日後`;
}
