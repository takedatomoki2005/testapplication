export const wizardSteps = [
  { index: 0, label: "ルート" },
  { index: 1, label: "興味" },
  { index: 2, label: "提案" },
  { index: 3, label: "詳細" },
  { index: 4, label: "ルート確認" }
] as const;

export const totalSteps = wizardSteps.length;
