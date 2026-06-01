import { useState } from "react";
import type { Customer, HotEvaluation } from "@/data/types";
import { formatVisitDate, isLedgerOnlyCustomer, WEEKDAY_LABELS } from "@/lib/customerDisplay";
import { formatAmountYen } from "@/lib/thankYou";
import { hasWeeklyVisitActivity, resolveWeeklyVisits } from "@/lib/weeklyVisits";
import { getCustomerMotivation, hotReasonLabel } from "@/lib/motivationMessages";
import {
  resolveSpendingRank,
  resolveVisitSpendingRank,
} from "@/lib/spendingRank";
import { SpendingRankDisplay } from "./SpendingRankBadge";
import { SpendingRankHelpModal } from "./SpendingRankHelpModal";
import { VisitTypeBadge } from "./VisitTypeBadge";
import styles from "./CustomerSpendingSection.module.css";

type Props = {
  customer: Customer;
  hot: HotEvaluation;
  hotCriteria: { minTotalSpending: number; minVisitCount: number; minNominationCount: number };
};

export function CustomerSpendingSection({ customer, hot, hotCriteria }: Props) {
  const [showRankHelp, setShowRankHelp] = useState(false);
  const ledgerOnly = isLedgerOnlyCustomer(customer);

  if (ledgerOnly) {
    const totalRank = resolveSpendingRank(customer.totalSpending);
    return (
      <div className={styles.wrap}>
        <section className={styles.heroPanel}>
          <div className={styles.heroTop}>
            <p className={styles.heroLabel}>累計使用金額（台帳のみ）</p>
            <button
              type="button"
              className={styles.helpBtn}
              onClick={() => setShowRankHelp(true)}
              aria-label="ランクの定義を見る"
            >
              ?
            </button>
          </div>
          <SpendingRankDisplay
            label={totalRank.label}
            rankId={totalRank.id}
            amount={customer.totalSpending}
            variant="hero"
          />
        </section>
        <p className={styles.ledgerNote}>
          会員登録がないため、来店回数・指名・週間パターンなどのデータはありません。
          把握しているのは{formatAmountYen(customer.totalSpending)}とメモのみです。
        </p>
        {showRankHelp && <SpendingRankHelpModal onClose={() => setShowRankHelp(false)} />}
      </div>
    );
  }

  const weeklyVisits = resolveWeeklyVisits(customer);
  const weekHasData = hasWeeklyVisitActivity(weeklyVisits);
  const weekMax = weekHasData ? Math.max(...weeklyVisits) : 1;
  const visitHistory = customer.visitHistory ?? [];
  const motivation = getCustomerMotivation(customer, hot);
  const avgSpending =
    customer.averageSpending ??
    (customer.visitCount > 0
      ? Math.round(customer.totalSpending / customer.visitCount)
      : 0);

  const totalRank = resolveSpendingRank(customer.totalSpending);
  const avgRank = resolveSpendingRank(avgSpending);

  return (
    <div className={styles.wrap}>
      <section className={styles.heroPanel}>
        <div className={styles.heroTop}>
          <p className={styles.heroLabel}>累計利用ランク</p>
          <button
            type="button"
            className={styles.helpBtn}
            onClick={() => setShowRankHelp(true)}
            aria-label="ランクの定義を見る"
          >
            ?
          </button>
        </div>
        <SpendingRankDisplay
          label={totalRank.label}
          rankId={totalRank.id}
          amount={customer.totalSpending}
          variant="hero"
        />
      </section>

      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{customer.visitCount}</span>
          <span className={styles.statLabel}>来店</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{customer.nominationCount}</span>
          <span className={styles.statLabel}>指名</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardRank}`}>
          <SpendingRankDisplay
            label={avgRank.label}
            rankId={avgRank.id}
            amount={avgSpending}
            variant="stat"
          />
          <span className={styles.statLabel}>平均ランク</span>
        </div>
      </div>

      <section className={styles.panel}>
        <h3 className={styles.panelTitle}>週間来店パターン</h3>
        <div className={styles.weekChart} role="img" aria-label="曜日別来店回数">
          {WEEKDAY_LABELS.map((label, i) => {
            const count = weeklyVisits[i] ?? 0;
            const heightPct =
              count > 0 && weekHasData ? Math.max(12, (count / weekMax) * 100) : 4;
            return (
              <div key={label} className={styles.weekCol}>
                <div className={styles.weekBarTrack}>
                  <div
                    className={`${styles.weekBar}${count > 0 ? ` ${styles.weekBarActive}` : ""}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className={styles.weekDay}>{label}</span>
                <span className={`${styles.weekCount}${count > 0 ? ` ${styles.weekCountActive}` : ""}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {visitHistory.length > 0 && (
        <section className={styles.panel}>
          <h3 className={styles.panelTitle}>直近のご来店</h3>
          <ul className={styles.historyList}>
            {visitHistory.slice(0, 5).map((v) => {
              const visitRank = resolveVisitSpendingRank(v.subtotal);
              return (
                <li key={v.id} className={styles.historyItem}>
                  <div className={styles.historyMain}>
                    <span className={styles.historyDate}>{formatVisitDate(v.date)}</span>
                    <VisitTypeBadge type={v.type} solid />
                  </div>
                  <SpendingRankDisplay
                    label={visitRank.label}
                    visitRankId={visitRank.id}
                    amount={v.subtotal}
                    variant="history"
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {hot.isHot && hot.reasons.length > 0 && (
        <ul className={styles.reasons}>
          {hot.reasons.map((r) => (
            <li key={r}>{hotReasonLabel(r, hotCriteria)}</li>
          ))}
        </ul>
      )}

      <p className={styles.motivation}>{motivation.returnMessage}</p>

      {showRankHelp && <SpendingRankHelpModal onClose={() => setShowRankHelp(false)} />}
    </div>
  );
}
