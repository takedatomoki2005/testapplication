import type { ThankYouEntry } from "@/data/types";
import {
  buildThankYouFlameMap,
  getThankYouFlameCount,
} from "./matchRate";
import { getVisitCategory, type VisitCategorySummary } from "./visitCategory";

export type ThankYouCastMode = "full" | "moderate" | "minimum";

export const THANK_YOU_CAST_MODE_ORDER: ThankYouCastMode[] = [
  "full",
  "moderate",
  "minimum",
];

export const THANK_YOU_CAST_MODE_LABEL: Record<ThankYouCastMode, string> = {
  full: "本気で頑張る",
  moderate: "ほどほど頑張る",
  minimum: "最低限頑張る",
};

export const THANK_YOU_CAST_MODE_HINT: Record<ThankYouCastMode, string> = {
  full: "全員対象・目標は全件",
  moderate: "優先客が対象・目標は半数",
  minimum: "最優先のみ・目標は3割",
};

/** 達成ゴール（対象のうち何％処理すればクリアか） */
export const THANK_YOU_CAST_MODE_GOAL: Record<ThankYouCastMode, number> = {
  full: 100,
  moderate: 50,
  minimum: 30,
};

export const THANK_YOU_CAST_MODE_PAGE_CLASS: Record<ThankYouCastMode, string> = {
  full: "pageModeFull",
  moderate: "pageModeModerate",
  minimum: "pageModeMinimum",
};

export function getCastModeGoalPercent(mode: ThankYouCastMode): number {
  return THANK_YOU_CAST_MODE_GOAL[mode];
}

/** モードに応じた達成に必要な件数（全体数を間引く） */
export function getCastModeGoalTargetCount(
  totalCount: number,
  mode: ThankYouCastMode,
): number {
  if (totalCount === 0) return 0;
  const goalPercent = THANK_YOU_CAST_MODE_GOAL[mode];
  if (goalPercent >= 100) return totalCount;
  return Math.max(1, Math.ceil((totalCount * goalPercent) / 100));
}

function countResolved(entries: ThankYouEntry[]): number {
  return entries.filter(
    (e) =>
      e.sendStatus === "sent" ||
      e.sendStatus === "no_line_exchange" ||
      e.sendStatus === "no_contact",
  ).length;
}

export function getCastModeProgressPercent(
  entries: ThankYouEntry[],
  mode: ThankYouCastMode,
): number {
  const total = entries.length;
  const target = getCastModeGoalTargetCount(total, mode);
  if (target === 0) return 0;
  const resolved = countResolved(entries);
  return Math.min(100, Math.round((resolved / target) * 100));
}

export function isCastModeGoalReached(
  entries: ThankYouEntry[],
  mode: ThankYouCastMode,
): boolean {
  if (entries.length === 0) return false;
  const target = getCastModeGoalTargetCount(entries.length, mode);
  return countResolved(entries) >= target;
}

export function applyCastModeGoal(
  summary: VisitCategorySummary,
  mode: ThankYouCastMode,
): VisitCategorySummary & { goalPercent: number; goalTargetCount: number } {
  const goalPercent = THANK_YOU_CAST_MODE_GOAL[mode];
  const goalTargetCount = getCastModeGoalTargetCount(summary.totalCount, mode);
  const goalReached =
    summary.hasAnyTarget && summary.totalResolved >= goalTargetCount;
  const overallPercent =
    goalTargetCount === 0
      ? 0
      : Math.min(100, Math.round((summary.totalResolved / goalTargetCount) * 100));

  return {
    ...summary,
    goalPercent,
    goalTargetCount,
    totalCount: goalTargetCount,
    overallPercent,
    allComplete: goalReached,
  };
}

export function isThankYouCastMode(value: unknown): value is ThankYouCastMode {
  return value === "full" || value === "moderate" || value === "minimum";
}

/** 選択モードのお礼LINE対象に絞り込む */
export function filterThankYouEntriesByMode(
  entries: ThankYouEntry[],
  mode: ThankYouCastMode,
): ThankYouEntry[] {
  if (mode === "full") return entries;

  const flameMap = buildThankYouFlameMap(entries);

  return entries.filter((entry) => {
    const category = getVisitCategory(entry);
    if (category === "jounai-shimei") return true;

    const flames = getThankYouFlameCount(entry, flameMap);
    if (mode === "minimum") return flames >= 3;
    return entry.hot.isHot || flames >= 2;
  });
}
