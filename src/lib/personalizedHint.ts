import type { ThankYouEntry } from "@/data/types";
import { isLedgerOnlyCustomer, resolveCustomerRank } from "./customerDisplay";
import { categorizeEntry } from "./achievementProgress";
import { getVisitCategory, getVisitCategoryLabel } from "./visitCategory";

/** Short personalized hint for list cards — matches reference UI */
export function getPersonalizedHint(entry: ThankYouEntry): string {
  const { customer, hot } = entry;
  if (isLedgerOnlyCustomer(customer)) {
    const note = customer.notes?.trim();
    if (note) return note.length > 48 ? `${note.slice(0, 48)}…` : note;
    return "会員登録なしのお客様。累計金額とメモを参考に礼を送りましょう";
  }
  const rank = resolveCustomerRank(customer, hot);
  const category = getVisitCategory(entry);
  const segment = categorizeEntry(entry);
  const trait = customer.titleTag ?? customer.nickname ?? "このお客様";

  if (segment === "jounai-shimei" || category === "jounai-shimei") {
    return `あなたとは${trait}の場内指名、相性がいいかも！`;
  }
  if (rank === "diamond") {
    return `あなたとは${trait}の相性がいいかも！返信リターン期待大`;
  }
  if (category === "hon-shimei") {
    return `あなたとは指名の相性がいいかも！礼を届ければ次回指名へ`;
  }
  if (hot.isHot || rank === "platinum") {
    return `あなたとは${trait}の相性がいいかも！`;
  }
  return `今日の礼を届けると、次の来店につながりやすいかも！`;
}

export function getCategoryTags(entry: ThankYouEntry): string[] {
  return [getVisitCategoryLabel(entry)];
}

export { getVisitCategory, getVisitCategoryLabel };
