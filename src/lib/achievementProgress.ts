import type { ThankYouEntry, VisitType } from "@/data/types";
import { resolveCustomerRank } from "./customerDisplay";

export type AchievementSegment = "jounai-shimei" | "hot-non-nomination" | "standard";

export interface SegmentProgress {
  id: AchievementSegment;
  label: string;
  emoji: string;
  total: number;
  sent: number;
  resolved: number;
  unsent: number;
  percent: number;
  complete: boolean;
  empty: boolean;
  cheerMessage: string;
}

export interface AchievementSummary {
  segments: SegmentProgress[];
  overallPercent: number;
  allComplete: boolean;
  hasAnyTarget: boolean;
  totalSent: number;
  totalResolved: number;
  totalCount: number;
}

const SEGMENT_META: Record<AchievementSegment, { label: string; emoji: string }> = {
  "jounai-shimei": { label: "場内指名", emoji: "🎯" },
  "hot-non-nomination": { label: "指名じゃない熱い客", emoji: "💎" },
  standard: { label: "その他", emoji: "🌸" },
};

const SEGMENT_ORDER: AchievementSegment[] = ["jounai-shimei", "hot-non-nomination", "standard"];

function todayVisitType(entry: ThankYouEntry): VisitType | null {
  return entry.customer.visitHistory?.find((v) => v.date === entry.visitDate)?.type ?? null;
}

export function categorizeEntry(entry: ThankYouEntry): AchievementSegment {
  const visitType = todayVisitType(entry);
  const rank = resolveCustomerRank(entry.customer, entry.hot);
  const isHot = entry.hot.isHot || rank === "diamond" || rank === "platinum";
  if (visitType === "in-store") return "jounai-shimei";
  if (isHot && visitType !== "nomination") return "hot-non-nomination";
  return "standard";
}

function cheerMessage(segment: SegmentProgress): string {
  if (segment.empty) return "";
  if (segment.complete) {
    if (segment.id === "jounai-shimei") return "場内指名 達成！🎉";
    if (segment.id === "hot-non-nomination") return "熱い客 達成！✨";
    return "その他 達成！🌸";
  }
  if (segment.unsent === 1) return "あと1件！";
  return `あと${segment.unsent}件`;
}

export function computeAchievementProgress(entries: ThankYouEntry[]): AchievementSummary {
  const buckets = new Map<AchievementSegment, ThankYouEntry[]>();
  for (const id of SEGMENT_ORDER) buckets.set(id, []);
  for (const entry of entries) buckets.get(categorizeEntry(entry))!.push(entry);

  const segments: SegmentProgress[] = SEGMENT_ORDER.map((id) => {
    const meta = SEGMENT_META[id];
    const items = buckets.get(id) ?? [];
    const total = items.length;
    const sent = items.filter((e) => e.sendStatus === "sent").length;
    const resolved = items.filter(
      (e) =>
        e.sendStatus === "sent" ||
        e.sendStatus === "no_line_exchange" ||
        e.sendStatus === "no_contact",
    ).length;
    const unsent = items.filter((e) => e.sendStatus === "unsent").length;
    const segment: SegmentProgress = {
      id,
      label: meta.label,
      emoji: meta.emoji,
      total,
      sent,
      resolved,
      unsent,
      percent: total === 0 ? 100 : Math.round((resolved / total) * 100),
      complete: total > 0 && unsent === 0,
      empty: total === 0,
      cheerMessage: "",
    };
    segment.cheerMessage = cheerMessage(segment);
    return segment;
  });

  const totalCount = entries.length;
  const totalSent = entries.filter((e) => e.sendStatus === "sent").length;
  const totalResolved = entries.filter(
    (e) =>
      e.sendStatus === "sent" ||
      e.sendStatus === "no_line_exchange" ||
      e.sendStatus === "no_contact",
  ).length;
  const totalUnsent = entries.filter((e) => e.sendStatus === "unsent").length;
  return {
    segments,
    overallPercent: totalCount === 0 ? 0 : Math.round((totalResolved / totalCount) * 100),
    allComplete: totalCount > 0 && totalUnsent === 0,
    hasAnyTarget: totalCount > 0,
    totalSent,
    totalResolved,
    totalCount,
  };
}
