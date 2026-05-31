import type { ThankYouEntry } from "@/data/types";
import { getPersonalizedHint, getVisitCategoryLabel } from "@/lib/personalizedHint";
import { getCustomerMotivation, hotReasonLabel } from "@/lib/motivationMessages";
import { formatAmountYen } from "@/lib/thankYou";
import {
  formatBirthday,
  formatListCustomerName,
  formatVisitDate,
  getRankLabel,
  resolveCustomerRank,
  WEEKDAY_LABELS,
} from "@/lib/customerDisplay";
import { formatDateOfBirth } from "@/data/customerProfileOptions";
import { CustomerProfileSection } from "./CustomerProfileSection";
import { TableServiceInfo } from "./TableServiceInfo";
import { VisitTypeBadge } from "./VisitTypeBadge";
import styles from "./CustomerSwipeCardContent.module.css";

interface CustomerSwipeCardContentProps {
  entry: ThankYouEntry;
  hotCriteria: { minTotalSpending: number; minVisitCount: number; minNominationCount: number };
  tablePhotoUrl?: string;
  onPhotoChange?: (dataUrl: string | undefined) => void;
  photoReadOnly?: boolean;
}

export function CustomerSwipeCardContent({
  entry,
  hotCriteria,
  tablePhotoUrl,
  onPhotoChange,
  photoReadOnly,
}: CustomerSwipeCardContentProps) {
  const { customer, hot, tableNumber, serviceStartTime, serviceEndTime } = entry;
  const displayPhoto = tablePhotoUrl;
  const hint = getPersonalizedHint(entry);
  const memberRank = resolveCustomerRank(customer, hot);
  const { primary, alias } = formatListCustomerName(customer);
  const motivation = getCustomerMotivation(customer, hot);
  const visitHistory = customer.visitHistory ?? [];
  const weeklyVisits = customer.weeklyVisits ?? Array(7).fill(0);
  const birthLabel = customer.dateOfBirth
    ? formatDateOfBirth(customer.dateOfBirth)
    : formatBirthday(customer.birthday);

  return (
    <div className={styles.content}>
      <div className={styles.head}>
        <div className={styles.tagRow}>
          <span className={styles.tag}>{getVisitCategoryLabel(entry)}</span>
          {memberRank && (
            <span className={`${styles.tag} ${styles.memberTag}`}>{getRankLabel(memberRank)}</span>
          )}
        </div>
        <h2 className={styles.name}>{primary}</h2>
        {alias && <p className={styles.alias}>{alias}</p>}
        {(birthLabel || customer.prefecture) && (
          <p className={styles.meta}>
            {birthLabel && `🎂 ${birthLabel}`}
            {customer.prefecture && ` · ${customer.prefecture}`}
          </p>
        )}
      </div>

      <TableServiceInfo
        tableNumber={tableNumber}
        serviceStartTime={serviceStartTime}
        serviceEndTime={serviceEndTime}
        tablePhotoUrl={displayPhoto}
        onPhotoChange={onPhotoChange}
        readOnly={photoReadOnly}
      />

      <div className={styles.hintBar}>
        <span>‼️</span>
        <span>{hint}</span>
      </div>

      <CustomerProfileSection customer={customer} />

      <div className={styles.stats}>
        <div className={styles.weekRow}>
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={label} className={styles.weekCell}>
              <span>{label}</span>
              <span className={(weeklyVisits[i] ?? 0) > 0 ? styles.weekActive : ""}>
                {weeklyVisits[i] ?? 0}
              </span>
            </div>
          ))}
        </div>
        <dl className={styles.metrics}>
          <div><dt>累計金額</dt><dd>{formatAmountYen(customer.totalSpending)}</dd></div>
          <div><dt>指名</dt><dd>{customer.nominationCount}回</dd></div>
          <div><dt>来店</dt><dd>{customer.visitCount}回</dd></div>
        </dl>
        {visitHistory.slice(0, 3).map((v) => (
          <div key={v.id} className={styles.historyRow}>
            <span>{formatVisitDate(v.date)}</span>
            <VisitTypeBadge type={v.type} solid />
            <span className={styles.subtotal}>{formatAmountYen(v.subtotal)}</span>
          </div>
        ))}
      </div>

      {hot.isHot && (
        <ul className={styles.reasons}>
          {hot.reasons.map((r) => (
            <li key={r}>・{hotReasonLabel(r, hotCriteria)}</li>
          ))}
        </ul>
      )}

      <p className={styles.motivation}>{motivation.returnMessage}</p>
    </div>
  );
}
