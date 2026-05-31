import type { FollowUpContact, FollowUpPriority } from "@/data/types";
import { formatListCustomerName, getRankLabel, resolveCustomerRank } from "@/lib/customerDisplay";
import {
  formatDaysSinceSent,
  formatDaysSinceVisit,
  getCustomerAverageSpending,
  priorityLabel,
  WEEKDAY_LABELS,
} from "@/lib/followUpDiscover";
import { getCustomerVisitWeekdays } from "@/lib/weeklyVisits";
import { formatYen } from "@/lib/thankYou";
import styles from "./FollowUpCard.module.css";

interface FollowUpCardProps {
  contact: FollowUpContact;
  onSelect: (contact: FollowUpContact) => void;
}

function priorityClass(priority: FollowUpPriority): string {
  switch (priority) {
    case "urgent":
      return styles.priorityUrgent;
    case "high":
      return styles.priorityHigh;
    case "normal":
      return styles.priorityNormal;
    default:
      return styles.priorityLow;
  }
}

export function FollowUpCard({ contact, onSelect }: FollowUpCardProps) {
  const { customer, daysSinceSent, daysSinceVisit, visitWeekday, lineName, lastMemo, priority, suggestedAction } =
    contact;
  const { primary, alias } = formatListCustomerName(customer);
  const rank = resolveCustomerRank(customer);
  const avg = getCustomerAverageSpending(customer);
  const visitWeekdays = getCustomerVisitWeekdays(customer);
  const weekdayBadges =
    visitWeekdays.length > 0 ? visitWeekdays : [visitWeekday];

  return (
    <button type="button" className={styles.card} onClick={() => onSelect(contact)}>
      <div className={styles.topRow}>
        <span className={`${styles.priorityBadge} ${priorityClass(priority)}`}>
          {priorityLabel(priority)}
        </span>
        <div className={styles.badges}>
          <span className={styles.daysBadge}>{formatDaysSinceVisit(daysSinceVisit)}</span>
          {weekdayBadges.map((day) => (
            <span key={day} className={styles.weekdayBadge}>
              {WEEKDAY_LABELS[day]}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.nameRow}>
        <h3 className={styles.name}>{primary}</h3>
        {alias && <span className={styles.alias}>{alias}</span>}
      </div>

      {lineName && (
        <p className={styles.lineName}>
          LINE: <span>{lineName}</span>
        </p>
      )}

      <div className={styles.metaRow}>
        {rank && <span className={styles.rankTag}>{getRankLabel(rank)}</span>}
        <span className={styles.amount}>{formatYen(customer.totalSpending)}</span>
        <span className={styles.amountSub}>平均 {formatYen(avg)}</span>
      </div>

      <p className={styles.action}>{suggestedAction}</p>

      <div className={styles.footer}>
        <span className={styles.sentHint}>お礼 {formatDaysSinceSent(daysSinceSent)}</span>
        <span className={styles.memoHint}>
          {lastMemo ? (
            <>
              メモあり — <span className={styles.memoHintAction}>タップで編集</span>
            </>
          ) : (
            <>
              <span className={styles.memoHintAction}>タップして</span>メモを残す
            </>
          )}
        </span>
      </div>
    </button>
  );
}
