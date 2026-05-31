import { Link } from "react-router-dom";
import styles from "./ThankYouHomeCard.module.css";

type Props = {
  unsentCount: number;
  allSent: boolean;
  hasAnyTarget: boolean;
};

export function ThankYouHomeCard({ unsentCount, allSent, hasAnyTarget }: Props) {
  if (!hasAnyTarget) return null;

  return (
    <Link to="/thank-you" className={styles.card}>
      <div className={styles.text}>
        <p className={styles.label}>今日のお礼LINE</p>
        <p className={styles.sub}>
          {allSent
            ? "本日分はすべて処理済み ✨"
            : unsentCount > 0
              ? `タップして確認 — あと${unsentCount}件`
              : "接客おつかれさまです"}
        </p>
      </div>
      {!allSent && unsentCount > 0 && <span className={styles.chip}>{unsentCount}</span>}
      <span className={styles.arrow} aria-hidden>
        ›
      </span>
    </Link>
  );
}
