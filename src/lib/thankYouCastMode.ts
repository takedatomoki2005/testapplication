import type { ThankYouEntry } from "@/data/types";
import {
  buildThankYouFlameMap,
  getThankYouFlameCount,
} from "./matchRate";
import { getVisitCategory } from "./visitCategory";

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
  full: "場内指名・フリーをすべて対象にします",
  moderate: "場内指名＋相性の良いフリー客が対象です",
  minimum: "場内指名＋最優先のフリー客だけが対象です",
};

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
