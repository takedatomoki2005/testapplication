import type { Customer, HotEvaluation, ThankYouEntry } from "@/data/types";
import { resolveCustomerRank } from "./customerDisplay";
import { getVisitCategory } from "./visitCategory";

export type FlameCount = 1 | 2 | 3;

function scoreFromCustomer(customer: Customer, hot?: HotEvaluation): number {
  let score = 0;
  const rank = resolveCustomerRank(customer, hot);
  if (rank === "diamond") score += 30;
  else if (rank === "platinum") score += 20;
  else if (rank === "gold") score += 10;
  if (hot?.isHot) score += 15;
  return score;
}

export function getMatchFlamesForEntry(entry: ThankYouEntry): FlameCount {
  let score = scoreFromCustomer(entry.customer, entry.hot);
  const category = getVisitCategory(entry);
  if (category === "hon-shimei") score += 40;
  else if (category === "jounai-shimei") score += 25;
  return scoreToFlames(score);
}

export function getMatchFlamesForCustomer(
  customer: Customer,
  hot?: HotEvaluation,
): FlameCount {
  return scoreToFlames(scoreFromCustomer(customer, hot));
}

function scoreToFlames(score: number): FlameCount {
  if (score >= 55) return 3;
  if (score >= 35) return 2;
  return 1;
}
