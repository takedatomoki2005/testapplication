import type { ThankYouEntry, SendStatus, CustomerRank } from "@/data/types";
import {
  formatListCustomerName,
  getRankLabel,
  resolveCustomerRank,
} from "@/lib/customerDisplay";
import { getVisitCategoryLabel } from "@/lib/personalizedHint";
import { formatServiceTimeRange } from "@/lib/serviceDisplay";
import { getVisitCategory, type VisitCategory } from "@/lib/visitCategory";
import styles from "./CustomerCard.module.css";

interface CustomerCardProps {
  entry: ThankYouEntry;
  onOpen: (entry: ThankYouEntry) => void;
}

function statusLabel(status: SendStatus): string {
  switch (status) {
    case "sent":
      return "送信済";
    case "no_line_exchange":
      return "LINE未交換";
    default:
      return "判定前";
  }
}

function statusClass(status: SendStatus): string {
  switch (status) {
    case "sent":
      return styles.statusSent;
    case "no_line_exchange":
      return styles.statusNoLine;
    default:
      return "";
  }
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
  const isPending = sendStatus === "unsent";
  const visitCategory = getVisitCategory(entry);
  const memberRank = resolveCustomerRank(customer, hot);
  const { primary, alias } = formatListCustomerName(customer);
  const serviceTime = formatServiceTimeRange(
    entry.serviceStartTime,
    entry.serviceEndTime,
  );

  return (
    <div className={styles.cardShell}>
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
          <span className={`${styles.statusBadge} ${statusClass(sendStatus)}`}>
            {statusLabel(sendStatus)}
          </span>
          <div className={styles.nameBlock}>
            <span className={styles.name}>{primary}</span>
            {alias && <span className={styles.alias}>{alias}</span>}
          </div>
        </div>
      </button>

      {!isPending && (
        <button
          type="button"
          className={styles.detailLink}
          onClick={() => onOpen(entry)}
        >
          詳細を見る
        </button>
      )}
    </div>
  );
}
