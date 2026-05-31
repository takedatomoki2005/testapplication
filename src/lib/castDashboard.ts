import { castDashboardByCastId, type CastDashboardProfile } from "@/data/mock/castDashboard";

const fallback: CastDashboardProfile = {
  displayName: "キャスト",
  currentBp: 0,
  rankName: "ブロンズ",
  pointsToNextRank: 500,
  rankProgress: 0,
  badges: [],
};

export function getCastDashboard(castId: string | undefined): CastDashboardProfile {
  if (!castId) return fallback;
  return castDashboardByCastId[castId] ?? fallback;
}
