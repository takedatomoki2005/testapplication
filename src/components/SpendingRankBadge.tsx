import type { SpendingRankId, VisitSpendingRankId } from "@/lib/spendingRank";
import { formatRankAmount } from "@/lib/spendingRank";
import styles from "./SpendingRankBadge.module.css";

type Variant = "hero" | "stat" | "history";

const RANK_CLASS: Record<SpendingRankId, string> = {
  s: styles.rankS,
  a: styles.rankA,
  b: styles.rankB,
  c: styles.rankC,
  d: styles.rankD,
  e: styles.rankE,
};

type Props = {
  label: string;
  rankId?: SpendingRankId;
  visitRankId?: VisitSpendingRankId;
  amount?: number;
  variant?: Variant;
};

export function SpendingRankDisplay({
  label,
  rankId,
  visitRankId,
  amount,
  variant = "stat",
}: Props) {
  const id = rankId ?? visitRankId ?? "e";

  return (
    <span className={`${styles.row} ${styles[variant]}`}>
      <span className={`${styles.rank} ${RANK_CLASS[id]}`}>{label}</span>
      {amount !== undefined && (
        <span className={styles.amount}>{formatRankAmount(amount)}</span>
      )}
    </span>
  );
}

/** @deprecated Use SpendingRankDisplay */
export function SpendingRankLabel(props: Props) {
  return <SpendingRankDisplay {...props} />;
}
