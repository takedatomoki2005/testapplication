import type { FlameCount } from "@/lib/matchRate";
import { FlameIcon } from "./FlameIcon";
import styles from "./MatchRateFlames.module.css";

type Props = {
  count: FlameCount;
  size?: "sm" | "md";
};

export function MatchRateFlames({ count, size = "md" }: Props) {
  const sizeClass = size === "sm" ? styles.sm : styles.md;
  return (
    <span
      className={`${styles.row} ${sizeClass}`}
      role="img"
      aria-label={`相性 ${count} / 3`}
    >
      {[1, 2, 3].map((i) => (
        <FlameIcon key={i} active={i <= count} className={styles.flame} />
      ))}
    </span>
  );
}
