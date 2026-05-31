import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./EndOfDayPopupModal.module.css";

type Props = {
  castName: string;
  onClose: () => void;
};

export function SwipeCompletePopupModal({ castName, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="swipe-complete-title"
      >
        <div className={styles.hero}>
          <span className={styles.emoji} aria-hidden>
            ✨
          </span>
        </div>

        <p id="swipe-complete-title" className={styles.title}>
          {castName}さん、
          <br />
          今日もお疲れ様でした！
        </p>

        <p className={styles.sub}>本日のお礼LINE、すべて処理完了 ✨</p>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
