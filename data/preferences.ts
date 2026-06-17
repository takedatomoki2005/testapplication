export const timeOfDayOptions = ["朝", "昼", "夕方", "夜"] as const;
export type TimeOfDay = (typeof timeOfDayOptions)[number];

export const detourTimeOptions = [
  { id: "15", label: "15分以内", minutes: 15 },
  { id: "30", label: "30分以内", minutes: 30 },
  { id: "60", label: "1時間以内", minutes: 60 }
] as const;

export const interestOptions = [
  "写真",
  "展示",
  "カフェ",
  "地域イベント",
  "ショッピング",
  "音楽",
  "スポーツ",
  "ワークショップ"
] as const;
export type Interest = (typeof interestOptions)[number];

export const budgetOptions = [
  { id: "free", label: "無料", maxYen: 0 },
  { id: "500", label: "〜500円", maxYen: 500 },
  { id: "1000", label: "〜1,000円", maxYen: 1000 },
  { id: "3000", label: "〜3,000円", maxYen: 3000 }
] as const;
export type BudgetId = (typeof budgetOptions)[number]["id"];

export const defaultPreferences = {
  timeOfDay: ["夕方", "夜"] as TimeOfDay[],
  detourMinutes: 30,
  interests: ["写真", "展示", "カフェ", "地域イベント"] as Interest[],
  budgetIds: ["free", "500", "1000"] as BudgetId[]
};

export type Preferences = typeof defaultPreferences;
