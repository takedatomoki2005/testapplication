import type { ThankYouEntry, VisitType } from "@/data/types";

export type VisitCategory = "hon-shimei" | "jounai-shimei" | "free";

export const VISIT_CATEGORY_LABEL: Record<VisitCategory, string> = {
  "hon-shimei": "本指名",
  "jounai-shimei": "場内指名",
  free: "フリー",
};

export const VISIT_CATEGORY_ORDER: VisitCategory[] = [
  "hon-shimei",
  "jounai-shimei",
  "free",
];

export const BADGE_CATEGORY_ORDER: VisitCategory[] = ["jounai-shimei", "free"];

function todayVisitType(entry: ThankYouEntry): VisitType | null {
  return entry.customer.visitHistory?.find((v) => v.date === entry.visitDate)?.type ?? null;
}

export function getVisitCategory(entry: ThankYouEntry): VisitCategory {
  const visitType = todayVisitType(entry);
  if (visitType === "nomination") return "hon-shimei";
  if (visitType === "in-store") return "jounai-shimei";
  return "free";
}

/** お礼LINE対象 — 場内指名・フリーのみ（本指名は除外） */
export function isThankYouEligible(entry: ThankYouEntry): boolean {
  return getVisitCategory(entry) !== "hon-shimei";
}

export function getVisitCategoryLabel(entry: ThankYouEntry): string {
  return VISIT_CATEGORY_LABEL[getVisitCategory(entry)];
}

export function visitCategorySortKey(entry: ThankYouEntry): number {
  return VISIT_CATEGORY_ORDER.indexOf(getVisitCategory(entry));
}

export type SwipeCompleteVariant = "all" | VisitCategory;

export interface VisitCategoryProgress {
  id: VisitCategory;
  label: string;
  emoji: string;
  total: number;
  resolved: number;
  unsent: number;
  complete: boolean;
  empty: boolean;
}

export interface VisitCategorySummary {
  categories: VisitCategoryProgress[];
  badgeCategories: VisitCategoryProgress[];
  overallPercent: number;
  allComplete: boolean;
  hasAnyTarget: boolean;
  totalResolved: number;
  totalCount: number;
}

const CATEGORY_META: Record<VisitCategory, { label: string; emoji: string }> = {
  "hon-shimei": { label: "本指名", emoji: "👑" },
  "jounai-shimei": { label: "場内指名", emoji: "🎯" },
  free: { label: "フリー", emoji: "🌸" },
};

function isResolved(entry: ThankYouEntry): boolean {
  return (
    entry.sendStatus === "sent" ||
    entry.sendStatus === "no_line_exchange" ||
    entry.sendStatus === "no_contact"
  );
}

export function computeVisitCategoryProgress(entries: ThankYouEntry[]): VisitCategorySummary {
  const buckets = new Map<VisitCategory, ThankYouEntry[]>();
  for (const id of VISIT_CATEGORY_ORDER) buckets.set(id, []);
  for (const entry of entries) buckets.get(getVisitCategory(entry))!.push(entry);

  const categories: VisitCategoryProgress[] = VISIT_CATEGORY_ORDER.map((id) => {
    const meta = CATEGORY_META[id];
    const items = buckets.get(id) ?? [];
    const total = items.length;
    const resolved = items.filter(isResolved).length;
    const unsent = items.filter((e) => e.sendStatus === "unsent").length;
    return {
      id,
      label: meta.label,
      emoji: meta.emoji,
      total,
      resolved,
      unsent,
      complete: total > 0 && unsent === 0,
      empty: total === 0,
    };
  });

  const totalCount = entries.length;
  const totalResolved = entries.filter(isResolved).length;
  const totalUnsent = entries.filter((e) => e.sendStatus === "unsent").length;
  return {
    categories,
    badgeCategories: categories.filter((c) => BADGE_CATEGORY_ORDER.includes(c.id)),
    overallPercent: totalCount === 0 ? 0 : Math.round((totalResolved / totalCount) * 100),
    allComplete: totalCount > 0 && totalUnsent === 0,
    hasAnyTarget: totalCount > 0,
    totalResolved,
    totalCount,
  };
}

/** Which completion popup to show after swiping an entry in the thank-you flow */
export function resolveSwipeCompletionPopup(
  entry: ThankYouEntry,
  queue: ThankYouEntry[],
): SwipeCompleteVariant | null {
  const remaining = queue.filter((e) => e.id !== entry.id);
  if (remaining.length === 0) return "all";

  const category = getVisitCategory(entry);
  const remainingInCategory = remaining.filter((e) => getVisitCategory(e) === category);
  if (remainingInCategory.length === 0) return category;
  return null;
}
