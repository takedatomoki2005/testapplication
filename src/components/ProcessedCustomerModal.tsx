import { useEffect } from "react";
import type { ThankYouEntry } from "@/data/types";
import { useApp } from "@/context/AppContext";
import { outcomeLabel } from "@/lib/sendStatusDisplay";
import { CustomerSwipeCardContent } from "./CustomerSwipeCardContent";
import { CustomerEntryNotesForm } from "./CustomerEntryNotesForm";
import swipeStyles from "./SwipeCustomerModal.module.css";
import styles from "./ProcessedCustomerModal.module.css";

type Props = {
  entry: ThankYouEntry;
  onClose: () => void;
  onUndo: () => void;
};

export function ProcessedCustomerModal({ entry, onClose, onUndo }: Props) {
  const { hotCriteria } = useApp();
  const isSent = entry.sendStatus === "sent";
  const isNoContact = entry.sendStatus === "no_contact";

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
          {isSent ? (
            <div className={`${swipeStyles.stamp} ${swipeStyles.stampRight}`}>
              {outcomeLabel(entry.sendStatus)}
            </div>
          ) : isNoContact ? (
            <div className={`${swipeStyles.stamp} ${swipeStyles.stampCenter}`}>
              {outcomeLabel(entry.sendStatus)}
            </div>
          ) : (
            <div className={`${swipeStyles.stamp} ${swipeStyles.stampLeft}`}>
              {outcomeLabel(entry.sendStatus)}
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
          対応前に戻す
        </button>
      </div>
    </div>
  );
}
