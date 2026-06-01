export type ExpectationRank = 1 | 2 | 3 | 4 | 5;

export const EXPECTATION_RANK_MAX = 5;

export const EXPECTATION_RANK_LABEL = "感覚期待ランク";

export function isExpectationRank(value: unknown): value is ExpectationRank {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= EXPECTATION_RANK_MAX
  );
}
