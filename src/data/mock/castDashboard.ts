import { CAST_DISPLAY_NAME } from "./casts";

export type BadgeKind = "rainbow" | "gold" | "silver" | "map" | "gift";

export interface CastBadgeStat {
  id: string;
  kind: BadgeKind;
  count: number;
}

export interface CastDashboardProfile {
  displayName: string;
  currentBp: number;
  rankName: string;
  pointsToNextRank: number;
  /** 0–1 ring fill toward next rank */
  rankProgress: number;
  badges: CastBadgeStat[];
}

export const castDashboardByCastId: Record<string, CastDashboardProfile> = {
  "cast-a": {
    displayName: CAST_DISPLAY_NAME,
    currentBp: 400,
    rankName: "ルビー",
    pointsToNextRank: 100,
    rankProgress: 0.8,
    badges: [
      { id: "b1", kind: "rainbow", count: 12 },
      { id: "b2", kind: "gold", count: 5 },
      { id: "b3", kind: "silver", count: 6 },
      { id: "b4", kind: "map", count: 20 },
      { id: "b5", kind: "gift", count: 120 },
    ],
  },
};
