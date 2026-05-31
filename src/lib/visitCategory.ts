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

function todayVisitType(entry: ThankYouEntry): VisitType | null {
  return entry.customer.visitHistory?.find((v) => v.date === entry.visitDate)?.type ?? null;
}

export function getVisitCategory(entry: ThankYouEntry): VisitCategory {
  const visitType = todayVisitType(entry);
  if (visitType === "nomination") return "hon-shimei";
  if (visitType === "in-store") return "jounai-shimei";
  return "free";
}

export function getVisitCategoryLabel(entry: ThankYouEntry): string {
  return VISIT_CATEGORY_LABEL[getVisitCategory(entry)];
}

export function visitCategorySortKey(entry: ThankYouEntry): number {
  return VISIT_CATEGORY_ORDER.indexOf(getVisitCategory(entry));
}
