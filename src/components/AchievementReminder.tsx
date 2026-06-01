import type { VisitCategorySummary } from "@/lib/visitCategory";
import { AchievementRaceTrack } from "./AchievementRaceTrack";
import { CategoryAchievementBadges } from "./CategoryAchievementBadges";
import styles from "./AchievementReminder.module.css";

type Summary = VisitCategorySummary & { goalPercent?: number; goalTargetCount?: number };

export function AchievementReminder({ summary }: { summary: Summary }) {
  if (!summary.hasAnyTarget) return null;

  const goalTargetCount = summary.goalTargetCount ?? summary.totalCount;
  const resolvedDisplay = summary.allComplete
    ? goalTargetCount
    : Math.min(summary.totalResolved, goalTargetCount);

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <span className={styles.title}>今日の達成度</span>
        <span className={summary.allComplete ? styles.allDone : styles.count}>
          {summary.allComplete
            ? "GOAL CLEAR ✨"
            : `${resolvedDisplay}/${goalTargetCount}`}
        </span>
      </div>
      <p className={styles.goalLabel}>目標 {goalTargetCount}件</p>
      <CategoryAchievementBadges categories={summary.badgeCategories} variant="list" />
      <AchievementRaceTrack
        percent={summary.overallPercent}
        allComplete={summary.allComplete}
      />
    </section>
  );
}
