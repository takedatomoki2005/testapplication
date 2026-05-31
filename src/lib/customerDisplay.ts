import type { Customer, CustomerRank, HotEvaluation } from "@/data/types";

const RANK_LABEL: Record<CustomerRank, string> = {
  diamond: "ダイアモンド",
  platinum: "プラチナ",
  gold: "ゴールド",
  silver: "シルバー",
};

export const RANK_ORDER: CustomerRank[] = ["diamond", "platinum", "gold", "silver"];

export function getRankLabel(rank: CustomerRank): string {
  return RANK_LABEL[rank];
}

export function resolveCustomerRank(customer: Customer, hot?: HotEvaluation): CustomerRank | null {
  if (customer.rank) return customer.rank;
  if (hot?.isHot) return "diamond";
  if (customer.totalSpending >= 300_000) return "platinum";
  if (customer.totalSpending >= 100_000) return "gold";
  if (customer.visitCount >= 3) return "silver";
  return null;
}

export function rankSortKey(customer: Customer, hot?: HotEvaluation): number {
  const rank = resolveCustomerRank(customer, hot);
  if (!rank) return RANK_ORDER.length;
  const index = RANK_ORDER.indexOf(rank);
  return index === -1 ? RANK_ORDER.length : index;
}

export function formatCustomerName(customer: Customer): string {
  if (customer.nickname) {
    return `${customer.nickname} 様`;
  }
  if (customer.fullName) {
    return `${customer.fullName} 様`;
  }
  return customer.displayName;
}

/** Compact name for list cards — nickname (or full name) + optional title/real-name alias */
export function formatListCustomerName(customer: Customer): {
  primary: string;
  alias: string | null;
} {
  const primary = customer.nickname
    ? `${customer.nickname} 様`
    : customer.fullName
      ? `${customer.fullName} 様`
      : customer.displayName;
  const alias =
    customer.titleTag ??
    (customer.nickname && customer.fullName ? `（${customer.fullName}）` : null);
  return { primary, alias };
}

export function customerSortKey(customer: Customer): string {
  return customer.nickname ?? customer.fullName ?? customer.displayName;
}

export function formatBirthday(birthday?: string): string | null {
  if (!birthday) return null;
  const [month, day] = birthday.split("-").map(Number);
  return `${month}月${day}日`;
}

export function formatVisitDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`;
}

export function formatFirstNomination(date?: string): string | null {
  if (!date) return null;
  const d = new Date(`${date}T00:00:00`);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"] as const;

export const VISIT_TYPE_LABEL: Record<string, string> = {
  nomination: "指名",
  accompany: "同伴",
  "in-store": "場内",
};
