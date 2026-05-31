import flagImg from "@/assets/achievement/flag.png";
import runnerImg from "@/assets/achievement/runner.png";
import styles from "./AchievementReminder.module.css";

function RunnerIcon() {
  return (
    <div
      className={styles.runnerShape}
      style={{
        WebkitMaskImage: `url(${runnerImg})`,
        maskImage: `url(${runnerImg})`,
      }}
      aria-hidden
    />
  );
}

function FlagIcon({ planted }: { planted: boolean }) {
  return (
    <img
      src={flagImg}
      alt=""
      className={`${styles.flagImg}${planted ? ` ${styles.flagPlanted}` : ""}`}
      draggable={false}
    />
  );
}

type Props = {
  percent: number;
  allComplete: boolean;
};

export function AchievementRaceTrack({ percent, allComplete }: Props) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const runnerLeft = allComplete ? 100 : Math.max(6, clamped * 0.84);

  return (
    <div
      className={`${styles.race}${allComplete ? ` ${styles.raceComplete}` : ""}`}
      role="img"
      aria-label={
        allComplete
          ? "今日の達成度 100パーセント ゴール"
          : `今日の達成度 ${clamped}パーセント`
      }
    >
      <div className={styles.raceLane}>
        <div
          className={`${styles.runner}${allComplete ? ` ${styles.runnerAtGoal}` : ""}`}
          style={{ left: `${runnerLeft}%` }}
        >
          <RunnerIcon />
        </div>
        <div className={`${styles.goal}${allComplete ? ` ${styles.goalReached}` : ""}`}>
          <FlagIcon planted={allComplete} />
        </div>
      </div>
      <div className={styles.raceTrack}>
        <div
          className={`${styles.raceFill}${allComplete ? ` ${styles.raceFillDone}` : ""}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
