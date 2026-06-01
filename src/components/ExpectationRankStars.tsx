import type { ExpectationRank } from "@/lib/expectationRank";
import { EXPECTATION_RANK_LABEL, EXPECTATION_RANK_MAX } from "@/lib/expectationRank";
import styles from "./ExpectationRankStars.module.css";

type Props = {
  value?: ExpectationRank;
  onChange?: (value: ExpectationRank | undefined) => void;
  size?: "sm" | "md";
};

function StarIcon({ active, className }: { active: boolean; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <path
        d="M12 2.5l2.86 5.79 6.39.93-4.62 4.5 1.09 6.36L12 17.9l-5.72 3.01 1.09-6.36-4.62-4.5 6.39-.93L12 2.5z"
        fill={active ? "var(--color-accent)" : "#E4E4E4"}
      />
    </svg>
  );
}

export function ExpectationRankStars({ value, onChange, size = "md" }: Props) {
  const sizeClass = size === "sm" ? styles.sm : styles.md;
  const interactive = Boolean(onChange);
  const stars = Array.from({ length: EXPECTATION_RANK_MAX }, (_, i) => i + 1);

  const handleSelect = (rank: ExpectationRank) => {
    if (!onChange) return;
    onChange(value === rank ? undefined : rank);
  };

  if (!interactive) {
    if (!value) return null;
    return (
      <span
        className={`${styles.row} ${sizeClass}`}
        role="img"
        aria-label={`${EXPECTATION_RANK_LABEL} ${value} / ${EXPECTATION_RANK_MAX}`}
      >
        {stars.map((rank) => (
          <StarIcon key={rank} active={rank <= value} className={styles.star} />
        ))}
      </span>
    );
  }

  return (
    <div className={`${styles.picker} ${sizeClass}`}>
      <div className={styles.row} role="group" aria-label={EXPECTATION_RANK_LABEL}>
        {stars.map((rank) => {
          const active = value !== undefined && rank <= value;
          return (
            <button
              key={rank}
              type="button"
              className={styles.starBtn}
              aria-label={`${EXPECTATION_RANK_LABEL} ${rank} / ${EXPECTATION_RANK_MAX}`}
              aria-pressed={value === rank}
              onClick={() => handleSelect(rank as ExpectationRank)}
            >
              <StarIcon active={active} className={styles.star} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
