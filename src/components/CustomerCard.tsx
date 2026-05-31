import type { ThankYouEntry, CustomerRank } from "@/data/types";
import {
  formatListCustomerName,
  getRankLabel,
  resolveCustomerRank,
} from "@/lib/customerDisplay";
import { getVisitCategoryLabel } from "@/lib/personalizedHint";
import { formatServiceTimeRange } from "@/lib/serviceDisplay";
import { isPendingSendStatus, listStatusLabel } from "@/lib/sendStatusDisplay";
import { getVisitCategory, type VisitCategory } from "@/lib/visitCategory";
import styles from "./CustomerCard.module.css";

interface CustomerCardProps {
  entry: ThankYouEntry;
  onOpen: (entry: ThankYouEntry) => void;
}

function statusClass(isPending: boolean): string {
  return isPending ? "" : styles.statusDone;
}

function visitCategoryClass(category: VisitCategory): string {
  switch (category) {
    case "hon-shimei":
      return styles.categoryHonShimei;
    case "jounai-shimei":
      return styles.categoryJounai;
    default:
      return styles.categoryFree;
  }
}

function memberRankClass(rank: CustomerRank): string {
  switch (rank) {
    case "diamond":
      return styles.rankDiamond;
    case "platinum":
      return styles.rankPlatinum;
    case "gold":
      return styles.rankGold;
    case "silver":
      return styles.rankSilver;
  }
}

export function CustomerCard({ entry, onOpen }: CustomerCardProps) {
  const { customer, sendStatus, hot } = entry;
  const isPending = isPendingSendStatus(sendStatus);
  const visitCategory = getVisitCategory(entry);
  const memberRank = resolveCustomerRank(customer, hot);
  const { primary, alias } = formatListCustomerName(customer);
  const serviceTime = formatServiceTimeRange(
    entry.serviceStartTime,
    entry.serviceEndTime,
  );

  return (
    <button
      type="button"
      className={`${styles.card}${!isPending ? ` ${styles.done}` : ""}`}
      onClick={() => onOpen(entry)}
    >
      <div className={styles.tagRow}>
        <span className={`${styles.categoryTag} ${visitCategoryClass(visitCategory)}`}>
          {getVisitCategoryLabel(entry)}
        </span>
        {memberRank && (
          <span className={`${styles.memberTag} ${memberRankClass(memberRank)}`}>
            {getRankLabel(memberRank)}
          </span>
        )}
        {serviceTime && (
          <span className={styles.serviceTime}>{serviceTime}</span>
        )}
      </div>

      <div className={styles.mainRow}>
        <span className={`${styles.statusBadge} ${statusClass(isPending)}`}>
          {listStatusLabel(sendStatus)}
        </span>
        <div className={styles.nameBlock}>
          <span className={styles.name}>{primary}</span>
          {alias && <span className={styles.alias}>{alias}</span>}
        </div>
      </div>
    </button>
  );
}
