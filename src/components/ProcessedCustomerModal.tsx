import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ThankYouEntry } from "@/data/types";
import { useApp } from "@/context/AppContext";
import { outcomeLabel } from "@/lib/sendStatusDisplay";
import {
  CARD_PAGE_LABELS,
  CustomerSwipeCardContent,
  type CardPageIndex,
} from "./CustomerSwipeCardContent";
import swipeStyles from "./SwipeCustomerModal.module.css";
import styles from "./ProcessedCustomerModal.module.css";

const PAGE_COUNT = CARD_PAGE_LABELS.length;

function isNavBlockedTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest("input, textarea, select, button, label, a, img");
}

type Props = {
  entry: ThankYouEntry;
  onClose: () => void;
  onUndo: () => void;
};

export function ProcessedCustomerModal({ entry, onClose, onUndo }: Props) {
  const { hotCriteria } = useApp();
  const [pageIndex, setPageIndex] = useState<CardPageIndex>(0);
  const isSent = entry.sendStatus === "sent";
  const isNoContact = entry.sendStatus === "no_contact";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setPageIndex(0);
  }, [entry.id]);

  const goToPrevPage = useCallback(() => {
    setPageIndex((current) => (current > 0 ? ((current - 1) as CardPageIndex) : current));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageIndex((current) =>
      current < PAGE_COUNT - 1 ? ((current + 1) as CardPageIndex) : current,
    );
  }, []);

  const handleCardTap = useCallback(
    (clientX: number, cardLeft: number, cardWidth: number, target: EventTarget | null) => {
      if (isNavBlockedTarget(target)) return;
      const isRightHalf = clientX - cardLeft > cardWidth / 2;
      if (isRightHalf) goToNextPage();
      else goToPrevPage();
    },
    [goToNextPage, goToPrevPage],
  );

  const stampVariant = isSent
    ? swipeStyles.stampRight
    : isNoContact
      ? swipeStyles.stampCenter
      : swipeStyles.stampLeft;

  return createPortal(
    <div className={swipeStyles.overlay} onClick={onClose} role="presentation">
      <button
        type="button"
        className={swipeStyles.closeIcon}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="閉じる"
      >
        ✕
      </button>

      <div className={swipeStyles.modalBody} onClick={(e) => e.stopPropagation()}>
        <div className={styles.statusBar}>
          <span
            className={`${styles.statusBadge} ${
              isSent
                ? styles.statusSent
                : isNoContact
                  ? styles.statusNoContact
                  : styles.statusNoLine
            }`}
          >
            {outcomeLabel(entry.sendStatus)}
          </span>
        </div>

        <div className={`${swipeStyles.cardWrap} ${styles.cardWrapStatic}`}>
          <div className={`${swipeStyles.stamp} ${stampVariant}`}>
            {outcomeLabel(entry.sendStatus)}
          </div>

          <div
            className={`${swipeStyles.card} ${styles.cardStatic}`}
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              handleCardTap(e.clientX, rect.left, rect.width, e.target);
            }}
          >
            <div className={swipeStyles.pageHeader}>
              <span className={swipeStyles.pageTitle}>{CARD_PAGE_LABELS[pageIndex]}</span>
              <div className={swipeStyles.pageDots} aria-hidden>
                {CARD_PAGE_LABELS.map((label, i) => (
                  <span
                    key={label}
                    className={`${swipeStyles.pageDot}${
                      i === pageIndex ? ` ${swipeStyles.pageDotActive}` : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className={swipeStyles.cardBody}>
              <CustomerSwipeCardContent
                entry={entry}
                hotCriteria={hotCriteria}
                photoReadOnly
                page={pageIndex}
                lineName={entry.lineName ?? ""}
                memo={entry.memo ?? ""}
              />
            </div>
            <div className={swipeStyles.pageNavHint} aria-hidden>
              <span className={pageIndex > 0 ? swipeStyles.pageNavActive : ""}>← 戻る</span>
              <span className={pageIndex < PAGE_COUNT - 1 ? swipeStyles.pageNavActive : ""}>
                次へ →
              </span>
            </div>
          </div>
        </div>

        <button type="button" className={styles.undoBtn} onClick={onUndo}>
          対応前に戻す
        </button>
      </div>
    </div>,
    document.body,
  );
}
