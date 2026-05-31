export const OCCUPATION_OPTIONS = [
  { id: "owner", label: "経営者・個人事業主" },
  { id: "executive", label: "会社役員" },
  { id: "employee", label: "会社員・公務員" },
  { id: "investor", label: "投資家" },
  { id: "medical", label: "医療" },
  { id: "professional", label: "士業" },
  { id: "agriculture", label: "農業・漁業" },
  { id: "shinto_priest", label: "神職" },
  { id: "pro_athlete", label: "プロスポーツ選手" },
  { id: "other", label: "その他" },
] as const;

export const CAST_PREFERENCE_OPTIONS = [
  { id: "popular", label: "人気キャスト" },
  { id: "beautiful", label: "キレイ" },
  { id: "cute", label: "カワイイ" },
  { id: "large_bust", label: "巨乳" },
  { id: "clean_image", label: "清楚系" },
  { id: "model_type", label: "モデル系" },
  { id: "newcomer", label: "新人" },
  { id: "non_smoker", label: "タバコ吸わない" },
  { id: "drinks", label: "お酒好き" },
  { id: "golf_ok", label: "ゴルフOK" },
  { id: "under_21", label: "21歳以下" },
  { id: "over_28", label: "28歳以上" },
  { id: "over_165", label: "165cm以上" },
  { id: "under_150", label: "150cm以下" },
  { id: "short_hair", label: "ショートヘア" },
] as const;

export const HOBBY_SPENDING_OPTIONS = [
  { id: "under_300k", label: "30万円以下" },
  { id: "300k_1m", label: "30万円〜100万円" },
  { id: "over_1m", label: "100万円以上" },
] as const;

export type Occupation = (typeof OCCUPATION_OPTIONS)[number]["id"];
export type CastPreference = (typeof CAST_PREFERENCE_OPTIONS)[number]["id"];
export type HobbySpendingTier = (typeof HOBBY_SPENDING_OPTIONS)[number]["id"];

export interface DateOfBirth {
  year: number;
  month: number;
  day: number;
}

export function getOccupationLabel(id: Occupation): string {
  return OCCUPATION_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

export function getCastPreferenceLabel(id: CastPreference): string {
  return CAST_PREFERENCE_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

export function getHobbySpendingLabel(id: HobbySpendingTier): string {
  return HOBBY_SPENDING_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

export function formatDateOfBirth(dob: DateOfBirth): string {
  return `${dob.year}年 ${dob.month}月 ${dob.day}日`;
}
