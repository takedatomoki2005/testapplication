import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { FollowUpContact } from "@/data/types";
import { initialAppData } from "@/data";
import { useApp } from "@/context/AppContext";
import { buildThankYouEntryFromFollowUpContact } from "@/lib/thankYou";
import {
  CARD_PAGE_LABELS,
  CustomerSwipeCardContent,
  type CardPageIndex,
} from "./CustomerSwipeCardContent";
import processedStyles from "./ProcessedCustomerModal.module.css";
import swipeStyles from "./SwipeCustomerModal.module.css";
import styles from "./FollowUpMemoModal.module.css";

const PAGE_COUNT = CARD_PAGE_LABELS.length;

function isNavBlockedTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest("input, textarea, select, button, label, a, img");
}

type Props = {
  contact: FollowUpContact;
  onClose: () => void;
  onSave: (recordId: string, payload: { lineName: string; lastMemo: string }) => void;
};

export function FollowUpMemoModal({ contact, onClose, onSave }: Props) {
  const { hotCriteria } = useApp();
  const [pageIndex, setPageIndex] = useState<CardPageIndex>(0);
  const [lineName, setLineName] = useState(contact.lineName ?? "");
  const [memo, setMemo] = useState(contact.lastMemo ?? "");

  const entry = useMemo(
    () =>
      buildThankYouEntryFromFollowUpContact(
        { ...contact, lineName, lastMemo: memo },
        initialAppData.serviceRecords,
        hotCriteria,
      ),
    [contact, lineName, memo, hotCriteria],
  );

  useEffect(() => {
    setLineName(contact.lineName ?? "");
    setMemo(contact.lastMemo ?? "");
    setPageIndex(0);
  }, [contact.id, contact.lineName, contact.lastMemo]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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

  const handleSave = () => {
    onSave(contact.id, { lineName: lineName.trim(), lastMemo: memo.trim() });
    onClose();
  };

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

      <div className={swipeStyles.modalBody}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={`${swipeStyles.cardWrap} ${processedStyles.cardWrapStatic}`}>
          <div
            className={`${swipeStyles.card} ${processedStyles.cardStatic}`}
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
                lineName={lineName}
                memo={memo}
                onLineNameChange={setLineName}
                onMemoChange={setMemo}
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

        <div className={styles.actions}>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            保存
          </button>
          {contact.customer.lineUrl ? (
            <a
              href={contact.customer.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.lineBtn}
            >
              LINEで連絡
            </a>
          ) : (
            <button type="button" className={styles.closeBtn} onClick={onClose}>
              閉じる
            </button>
          )}
        </div>

        <p className={swipeStyles.hint}>
          左右をタップで画面切替 · お客様メモは「お客様メモ」タブで編集
        </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
