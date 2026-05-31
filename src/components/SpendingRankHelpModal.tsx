import {
  SPENDING_RANK_TIERS,
  VISIT_SPENDING_RANK_TIERS,
  formatSpendingRankRange,
} from "@/lib/spendingRank";
import { SpendingRankDisplay } from "./SpendingRankBadge";
import styles from "./SpendingRankHelpModal.module.css";

type Props = {
  onClose: () => void;
};

export function SpendingRankHelpModal({ onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="spending-rank-help-title"
      >
        <h2 id="spending-rank-help-title" className={styles.title}>
          利用ランクの定義（S〜E）
        </h2>
        <p className={styles.lead}>
          ランクは金額の目安です。実際の金額は各所に小さく表示されます。
        </p>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>累計利用ランク</h3>
          <ul className={styles.tierList}>
            {SPENDING_RANK_TIERS.map((tier) => (
              <li key={tier.id} className={styles.tierRow}>
                <SpendingRankDisplay label={tier.label} rankId={tier.id} variant="stat" />
                <div className={styles.tierBody}>
                  <span className={styles.tierRange}>{formatSpendingRankRange(tier)}</span>
                  <span className={styles.tierDesc}>{tier.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>ご来店ごとのランク</h3>
          <ul className={styles.tierList}>
            {VISIT_SPENDING_RANK_TIERS.map((tier) => (
              <li key={tier.id} className={styles.tierRow}>
                <SpendingRankDisplay
                  label={tier.label}
                  visitRankId={tier.id}
                  variant="stat"
                />
                <div className={styles.tierBody}>
                  <span className={styles.tierDesc}>{tier.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <button type="button" className={styles.closeBtn} onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}
