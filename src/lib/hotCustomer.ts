import type { Customer, HotCriteria, HotEvaluation, HotReasonType } from "@/data/types";

export function evaluateHotCustomer(customer: Customer, criteria: HotCriteria): HotEvaluation {
  const reasons: HotReasonType[] = [];
  if (customer.totalSpending >= criteria.minTotalSpending) reasons.push("spending");
  if (customer.visitCount >= criteria.minVisitCount) reasons.push("visits");
  if (customer.nominationCount >= criteria.minNominationCount) reasons.push("nominations");
  return { isHot: reasons.length > 0, reasons };
}

export function hotReasonLabel(reason: HotReasonType, criteria: HotCriteria): string {
  switch (reason) {
    case "spending":
      return `累計使用金額が${criteria.minTotalSpending.toLocaleString()}円以上`;
    case "visits":
      return `累計来店回数が${criteria.minVisitCount}回以上`;
    case "nominations":
      return `累計指名回数が${criteria.minNominationCount}回以上`;
  }
}
