import type { AchievementSummary, SegmentProgress } from "@/lib/achievementProgress";
import styles from "./AchievementReminder.module.css";

function SegmentBar({ segment }: { segment: SegmentProgress }) {
  if (segment.empty) return null;
  return (
    <div className={`${styles.row}${segment.complete ? ` ${styles.rowDone}` : ""}`}>
      <div className={styles.rowHead}>
        <span className={styles.rowLabel}>
          {segment.emoji} {segment.label}
        </span>
        <span className={styles.rowCount}>
          {segment.complete ? "達成 🎉" : `${segment.resolved}/${segment.total}`}
        </span>
      </div>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${styles[`fill_${segment.id}`]}${segment.complete ? ` ${styles.fillDone}` : ""}`}
          style={{ width: `${segment.percent}%` }}
        />
      </div>
    </div>
  );
}

export function AchievementReminder({ summary }: { summary: AchievementSummary }) {
  if (!summary.hasAnyTarget) return null;
  const active = summary.segments.filter((s) => !s.empty);

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
      <div className={styles.overallTrack}>
        <div
          className={`${styles.overallFill}${summary.allComplete ? ` ${styles.fillDone}` : ""}`}
          style={{ width: `${summary.overallPercent}%` }}
        />
      </div>
      {active.map((s) => (
        <SegmentBar key={s.id} segment={s} />
      ))}
    </section>
  );
}
