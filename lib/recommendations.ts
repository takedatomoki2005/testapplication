import { mockEvents, type MockEvent } from "@/data/events";
import { budgetOptions, type Preferences } from "@/data/preferences";

export type Recommendation = {
  event: MockEvent;
  matchedInterests: string[];
  withinTime: boolean;
  withinBudget: boolean;
  isStrong: boolean;
  score: number;
};

function maxBudgetYen(prefs: Preferences): number {
  const selected = budgetOptions.filter((b) => prefs.budgetIds.includes(b.id));
  if (selected.length === 0) return 0;
  return Math.max(...selected.map((b) => b.maxYen));
}

export function scoreEvents(prefs: Preferences): Recommendation[] {
  const budgetCap = maxBudgetYen(prefs);

  return mockEvents
    .map((event) => {
      const matchedInterests = event.interests.filter((i) =>
        prefs.interests.includes(i as Preferences["interests"][number])
      );
      const withinTime = event.extraMinutes <= prefs.detourMinutes;
      const withinBudget = event.costMaxYen <= budgetCap;
      const isStrong = withinTime && withinBudget && matchedInterests.length > 0;

      const score =
        (withinTime ? 50 : 0) +
        (withinBudget ? 30 : 0) +
        matchedInterests.length * 10 -
        event.extraMinutes;

      return {
        event,
        matchedInterests,
        withinTime,
        withinBudget,
        isStrong,
        score
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function topRecommendation(prefs: Preferences): Recommendation {
  return scoreEvents(prefs)[0];
}
