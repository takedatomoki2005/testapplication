import type { Customer, HotCriteria, HotEvaluation, HotReasonType } from "@/data/types";
import { resolveCustomerRank } from "./customerDisplay";

export function getCustomerMotivation(customer: Customer, hot: HotEvaluation) {
  const rank = resolveCustomerRank(customer, hot);
  const isHot = hot.isHot || rank === "diamond" || rank === "platinum";
  return {
    returnMessage: isHot
      ? "このお客様は返信すると、次の指名・来店につながりやすいタイプです！"
      : "お礼を届けると、返信・再来店のきっかけになります！",
    actionHint: "今日の接客の感想をひとこと添えて送りましょう。",
  };
}

export function hotReasonLabel(reason: HotReasonType, criteria: HotCriteria): string {
  switch (reason) {
    case "spending": return `累計使用金額が${criteria.minTotalSpending.toLocaleString()}円以上`;
    case "visits": return `累計来店回数が${criteria.minVisitCount}回以上`;
    case "nominations": return `累計指名回数が${criteria.minNominationCount}回以上`;
  }
}
