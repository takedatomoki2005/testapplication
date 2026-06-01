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
  else if (rank === "silver") score += 10;
  if (hot?.isHot) score += 15;
  return score;
}

export const THANK_YOU_TOP_FLAME_COUNT = 3;
const THANK_YOU_MID_FLAME_COUNT = 2;

/** お礼LINE — フリー客を相性スコアで優先（本指名は対象外） */
export function thankYouMatchScore(entry: ThankYouEntry): number {
  let score = scoreFromCustomer(entry.customer, entry.hot);
  const category = getVisitCategory(entry);
  if (category === "free") score += 35;
  else if (category === "jounai-shimei") score += 15;
  if (entry.sendStatus === "unsent" && entry.hot.isHot) score += 5;
  return score;
}

/** 未送信の上位3名を🔥×3、次の2名を🔥×2に固定（1人だけ強調しない） */
export function buildThankYouFlameMap(entries: ThankYouEntry[]): Map<string, FlameCount> {
  const map = new Map<string, FlameCount>();
  for (const entry of entries) map.set(entry.id, 1);

  const ranked = entries
    .filter((e) => e.sendStatus === "unsent")
    .sort((a, b) => thankYouMatchScore(b) - thankYouMatchScore(a));

  ranked.forEach((entry, index) => {
    let flames: FlameCount = 1;
    if (index < THANK_YOU_TOP_FLAME_COUNT) flames = 3;
    else if (index < THANK_YOU_TOP_FLAME_COUNT + THANK_YOU_MID_FLAME_COUNT) flames = 2;
    map.set(entry.id, flames);
  });

  return map;
}

export function getThankYouFlameCount(
  entry: ThankYouEntry,
  flameMap: Map<string, FlameCount>,
): FlameCount {
  return flameMap.get(entry.id) ?? getMatchFlamesForEntry(entry);
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

/** Tuned for 場内指名・フリー lists (no 本指名 +40); targets an even 3 / 2 / 1 mix. */
function scoreToFlames(score: number): FlameCount {
  if (score >= 35) return 3;
  if (score >= 25) return 2;
  return 1;
}
