import { useEffect } from "react";
import type { ThankYouEntry, SendStatus } from "@/data/types";
import { useApp } from "@/context/AppContext";
import { CustomerSwipeCardContent } from "./CustomerSwipeCardContent";
import { CustomerEntryNotesForm } from "./CustomerEntryNotesForm";
import swipeStyles from "./SwipeCustomerModal.module.css";
import styles from "./ProcessedCustomerModal.module.css";

type Props = {
  entry: ThankYouEntry;
  onClose: () => void;
  onUndo: () => void;
};

function statusLabel(status: SendStatus): string {
  switch (status) {
    case "sent":
      return "送信済み ✓";
    case "no_line_exchange":
      return "LINE未交換";
    default:
      return "判定前";
  }
}

export function ProcessedCustomerModal({ entry, onClose, onUndo }: Props) {
  const { hotCriteria } = useApp();
  const isSent = entry.sendStatus === "sent";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
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
              isSent ? styles.statusSent : styles.statusNoLine
            }`}
          >
            {statusLabel(entry.sendStatus)}
          </span>
        </div>

        <div className={`${swipeStyles.cardWrap} ${styles.cardWrapStatic}`}>
          {isSent ? (
            <div className={`${swipeStyles.stamp} ${swipeStyles.stampRight}`}>
              送信済み ✓
            </div>
          ) : (
            <div className={`${swipeStyles.stamp} ${swipeStyles.stampLeft}`}>
              LINE未交換
            </div>
          )}

          <div className={`${swipeStyles.card} ${styles.cardStatic}`}>
            <div className={swipeStyles.cardScroll}>
              <CustomerSwipeCardContent
                entry={entry}
                hotCriteria={hotCriteria}
                photoReadOnly
              />
            </div>
          </div>
        </div>

        <CustomerEntryNotesForm
          readOnly
          lineName={entry.lineName}
          memo={entry.memo}
        />

        <button type="button" className={styles.undoBtn} onClick={onUndo}>
          判定前に戻す
        </button>
      </div>
    </div>
  );
}
