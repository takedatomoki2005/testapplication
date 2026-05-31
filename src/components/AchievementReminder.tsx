import type { VisitCategorySummary } from "@/lib/visitCategory";
import { AchievementRaceTrack } from "./AchievementRaceTrack";
import { CategoryAchievementBadges } from "./CategoryAchievementBadges";
import styles from "./AchievementReminder.module.css";

export function AchievementReminder({ summary }: { summary: VisitCategorySummary }) {
  if (!summary.hasAnyTarget) return null;

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <span className={styles.title}>今日の達成度</span>
        <span className={summary.allComplete ? styles.allDone : styles.count}>
          {summary.allComplete
            ? "ALL CLEAR ✨"
            : `${summary.totalResolved}/${summary.totalCount}`}
        </span>
      </div>
      <CategoryAchievementBadges categories={summary.badgeCategories} variant="list" />
      <AchievementRaceTrack
        percent={summary.overallPercent}
        allComplete={summary.allComplete}
      />
    </section>
  );
}
