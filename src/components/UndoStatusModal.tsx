import type { ThankYouEntry } from "@/data/types";
import { formatListCustomerName } from "@/lib/customerDisplay";
import styles from "./UndoStatusModal.module.css";

type Props = {
  entry: ThankYouEntry;
  onConfirm: () => void;
  onClose: () => void;
};

export function UndoStatusModal({ entry, onConfirm, onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="undo-status-title"
      >
        <p id="undo-status-title" className={styles.title}>
          対応前に戻しますか？
        </p>
        <p className={styles.sub}>
          {formatListCustomerName(entry.customer).primary.replace(" 様", "")}
          さんのステータスを対応前に戻します。
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            キャンセル
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            戻す
          </button>
        </div>
      </div>
    </div>
  );
}
