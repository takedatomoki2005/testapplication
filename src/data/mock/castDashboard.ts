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
    displayName: "フィリア 門松ゆい子",
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
  "cast-b": {
    displayName: "フィリア キャストB",
    currentBp: 280,
    rankName: "サファイア",
    pointsToNextRank: 220,
    rankProgress: 0.56,
    badges: [
      { id: "b1", kind: "gold", count: 3 },
      { id: "b2", kind: "silver", count: 4 },
      { id: "b3", kind: "map", count: 8 },
      { id: "b4", kind: "gift", count: 45 },
    ],
  },
};
