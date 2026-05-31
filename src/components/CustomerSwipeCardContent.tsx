import { useEffect, useRef } from "react";
import type { ThankYouEntry } from "@/data/types";
import { getPersonalizedHint, getVisitCategoryLabel } from "@/lib/personalizedHint";
import {
  formatBirthday,
  formatListCustomerName,
  getRankLabel,
  resolveCustomerRank,
} from "@/lib/customerDisplay";
import { formatDateOfBirth } from "@/data/customerProfileOptions";
import { getMatchFlamesForEntry } from "@/lib/matchRate";
import { CustomerProfileSection } from "./CustomerProfileSection";
import { CustomerSpendingSection } from "./CustomerSpendingSection";
import { CustomerEntryNotesForm } from "./CustomerEntryNotesForm";
import { MatchRateFlames } from "./MatchRateFlames";
import { TableServiceInfo } from "./TableServiceInfo";
import styles from "./CustomerSwipeCardContent.module.css";

export const CARD_PAGE_LABELS = ["基本情報", "お金情報", "趣味情報", "メモ"] as const;
export type CardPageIndex = 0 | 1 | 2 | 3;

interface CustomerSwipeCardContentProps {
  entry: ThankYouEntry;
  hotCriteria: { minTotalSpending: number; minVisitCount: number; minNominationCount: number };
  tablePhotoUrl?: string;
  onPhotoChange?: (dataUrl: string | undefined) => void;
  photoReadOnly?: boolean;
  page?: CardPageIndex;
  lineName?: string;
  memo?: string;
  onLineNameChange?: (value: string) => void;
  onMemoChange?: (value: string) => void;
}

export function CustomerSwipeCardContent({
  entry,
  hotCriteria,
  tablePhotoUrl,
  onPhotoChange,
  photoReadOnly,
  page,
  lineName,
  memo,
  onLineNameChange,
  onMemoChange,
}: CustomerSwipeCardContentProps) {
  const pageScrollRef = useRef<HTMLDivElement>(null);
  const { customer, hot, tableNumber, serviceStartTime, serviceEndTime } = entry;

  useEffect(() => {
    pageScrollRef.current?.scrollTo(0, 0);
  }, [page, entry.id]);
  const displayPhoto = tablePhotoUrl;
  const hint = getPersonalizedHint(entry);
  const memberRank = resolveCustomerRank(customer, hot);
  const flames = getMatchFlamesForEntry(entry);
  const { primary, alias } = formatListCustomerName(customer);
  const birthLabel = customer.dateOfBirth
    ? formatDateOfBirth(customer.dateOfBirth)
    : formatBirthday(customer.birthday);

  const basicPage = (
    <>
      <div className={styles.head}>
        <div className={styles.headBody}>
          <div className={styles.tagRow}>
            <span className={styles.tag}>{getVisitCategoryLabel(entry)}</span>
            {memberRank && (
              <span className={`${styles.tag} ${styles.memberTag}`}>{getRankLabel(memberRank)}</span>
            )}
          </div>
          <div className={styles.nameRow}>
            <div className={styles.nameBlock}>
              <h2 className={styles.name}>{primary}</h2>
              {alias && <p className={styles.alias}>{alias}</p>}
            </div>
          </div>
          {(birthLabel || customer.prefecture) && (
            <p className={styles.meta}>
              {birthLabel && `🎂 ${birthLabel}`}
              {customer.prefecture && ` · ${customer.prefecture}`}
            </p>
          )}
        </div>
        <span className={styles.headFlames}>
          <MatchRateFlames count={flames} size="md" />
        </span>
      </div>

      <TableServiceInfo
        tableNumber={tableNumber}
        serviceStartTime={serviceStartTime}
        serviceEndTime={serviceEndTime}
        tablePhotoUrl={displayPhoto}
        onPhotoChange={onPhotoChange}
        readOnly={photoReadOnly}
      />
    </>
  );

  const moneyPage = (
    <CustomerSpendingSection customer={customer} hot={hot} hotCriteria={hotCriteria} />
  );

  const hasHobbyProfile =
    customer.occupation ||
    (customer.castPreferences?.length ?? 0) > 0 ||
    customer.hobbySpending ||
    customer.dateOfBirth ||
    customer.birthday ||
    customer.prefecture;

  const hobbyPage = hasHobbyProfile ? (
    <CustomerProfileSection customer={customer} compact flameCount={flames} />
  ) : (
    <div className={styles.emptyPage}>
      <span className={styles.emptyIcon} aria-hidden>
        👤
      </span>
      <p>趣味・プロフィール情報はありません</p>
    </div>
  );

  const memoPage = (
    <>
      <div className={styles.commentBar}>
        <span className={styles.commentIcon} aria-hidden>
          ‼️
        </span>
        <p className={styles.commentText}>{hint}</p>
      </div>
      {onLineNameChange && onMemoChange ? (
        <CustomerEntryNotesForm
          variant="embedded"
          lineName={lineName ?? ""}
          memo={memo ?? ""}
          onLineNameChange={onLineNameChange}
          onMemoChange={onMemoChange}
          memoRows={4}
        />
      ) : (
        <CustomerEntryNotesForm
          readOnly
          variant="embedded"
          lineName={lineName}
          memo={memo}
        />
      )}
    </>
  );

  const pages = [basicPage, moneyPage, hobbyPage, memoPage];

  if (page !== undefined) {
    return (
      <div className={`${styles.content} ${styles.contentPaged}`}>
        <div ref={pageScrollRef} className={styles.pageScroll}>
          {pages[page]}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      {basicPage}
      <div className={styles.hintBar}>
        <span>‼️</span>
        <span>{hint}</span>
      </div>
      {moneyPage}
      <CustomerProfileSection customer={customer} flameCount={flames} />
    </div>
  );
}
