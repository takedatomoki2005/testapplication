import { Link } from "react-router-dom";
import type { MonthlyCustomerSummary } from "@/lib/monthlyCustomers";
import styles from "./MonthlyCustomersCard.module.css";

const MAX_AVATARS = 5;

type Props = {
  summary: MonthlyCustomerSummary;
};

function avatarInitial(name: string): string {
  const stripped = name.replace(/[様\s]/g, "");
  return stripped.charAt(0) || "客";
}

export function MonthlyCustomersCard({ summary }: Props) {
  if (summary.count === 0) return null;

  const shown = summary.entries.slice(0, MAX_AVATARS);
  const overflow = summary.count - shown.length;

  return (
    <Link to="/discover" className={styles.card}>
      <div className={styles.head}>
        <span className={styles.label}>今月のお客さん</span>
        <span className={styles.month}>{summary.month}月</span>
      </div>

      <div className={styles.countRow}>
        <span className={styles.count}>{summary.count}</span>
        <span className={styles.countUnit}>名</span>
      </div>

      <p className={styles.message}>今月もお客様と出会えています ✨</p>

      <div className={styles.avatars} aria-hidden>
        {shown.map((entry) => (
          <span key={entry.customerId} className={styles.avatar} title={entry.primary}>
            {avatarInitial(entry.primary)}
          </span>
        ))}
        {overflow > 0 && <span className={styles.overflow}>+{overflow}</span>}
      </div>

      <div className={styles.footer}>
        <span className={styles.hint}>LINE友達から探す</span>
        <span className={styles.arrow}>›</span>
      </div>
    </Link>
  );
}
