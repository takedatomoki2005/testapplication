/** Cumulative / per-visit spending rank (S〜E) */
export type SpendingRankId = "s" | "a" | "b" | "c" | "d" | "e";

export type VisitSpendingRankId = SpendingRankId;

export type SpendingRankTier = {
  id: SpendingRankId;
  label: string;
  minAmount: number;
  description: string;
};

export type VisitSpendingRankTier = SpendingRankTier;

/** High end first — tuned so mock customers spread across S〜E */
export const SPENDING_RANK_TIERS: SpendingRankTier[] = [
  {
    id: "s",
    label: "S",
    minAmount: 500_000,
    description: "累計50万円以上 — 最上位のお客様",
  },
  {
    id: "a",
    label: "A",
    minAmount: 350_000,
    description: "累計35万円以上 — 高額・安定利用",
  },
  {
    id: "b",
    label: "B",
    minAmount: 200_000,
    description: "累計20万円以上 — しっかりした支持",
  },
  {
    id: "c",
    label: "C",
    minAmount: 100_000,
    description: "累計10万円以上 — 育成・フォローアップ向き",
  },
  {
    id: "d",
    label: "D",
    minAmount: 50_000,
    description: "累計5万円以上 — これから伸ばせる層",
  },
  {
    id: "e",
    label: "E",
    minAmount: 0,
    description: "累計5万円未満 — ライト・初回〜数回",
  },
];

export const VISIT_SPENDING_RANK_TIERS: VisitSpendingRankTier[] = [
  {
    id: "s",
    label: "S",
    minAmount: 100_000,
    description: "1回10万円以上",
  },
  {
    id: "a",
    label: "A",
    minAmount: 70_000,
    description: "1回7万円以上",
  },
  {
    id: "b",
    label: "B",
    minAmount: 45_000,
    description: "1回4.5万円以上",
  },
  {
    id: "c",
    label: "C",
    minAmount: 25_000,
    description: "1回2.5万円以上",
  },
  {
    id: "d",
    label: "D",
    minAmount: 15_000,
    description: "1回1.5万円以上",
  },
  {
    id: "e",
    label: "E",
    minAmount: 0,
    description: "1回1.5万円未満",
  },
];

export function resolveSpendingRank(amount: number): SpendingRankTier {
  for (const tier of SPENDING_RANK_TIERS) {
    if (amount >= tier.minAmount) return tier;
  }
  return SPENDING_RANK_TIERS[SPENDING_RANK_TIERS.length - 1]!;
}

export function resolveVisitSpendingRank(amount: number): VisitSpendingRankTier {
  for (const tier of VISIT_SPENDING_RANK_TIERS) {
    if (amount >= tier.minAmount) return tier;
  }
  return VISIT_SPENDING_RANK_TIERS[VISIT_SPENDING_RANK_TIERS.length - 1]!;
}

export function formatRankAmount(amount: number): string {
  return `${amount.toLocaleString()}円`;
}

export function formatSpendingRankRange(tier: SpendingRankTier): string {
  const idx = SPENDING_RANK_TIERS.findIndex((t) => t.id === tier.id);
  const higher = SPENDING_RANK_TIERS[idx - 1];
  if (!higher) {
    return `${(tier.minAmount / 10_000).toLocaleString()}万円〜`;
  }
  const maxBelow = higher.minAmount - 1;
  if (tier.minAmount === 0) {
    return `${(maxBelow / 10_000).toLocaleString()}万円未満`;
  }
  return `${(tier.minAmount / 10_000).toLocaleString()}万〜${(maxBelow / 10_000).toLocaleString()}万円`;
}
