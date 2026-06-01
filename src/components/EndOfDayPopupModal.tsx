import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./EndOfDayPopupModal.module.css";

type Props = {
  unsentCount: number;
  allSent: boolean;
  castName: string;
  todayCustomerCount: number;
  onStartReflection: () => void;
  onDismiss: () => void;
};

export function EndOfDayPopupModal({
  unsentCount,
  allSent,
  castName,
  todayCustomerCount,
  onStartReflection,
  onDismiss,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const statusText = allSent
    ? "本日のお礼LINE、全員に処理完了 ✨"
    : unsentCount > 0
      ? `お礼LINEがあと${unsentCount}件 — タップして送りましょう`
      : "今日のお礼LINEを送りましょう";

  const ctaLabel = allSent ? "お礼LINEを見る" : "お礼LINEを送る";

  return createPortal(
    <div className={styles.overlay} onClick={onDismiss} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="end-of-day-title"
      >
        <div className={styles.hero}>
          <span className={styles.emoji} aria-hidden>
            💌
          </span>
        </div>

        <p id="end-of-day-title" className={styles.title}>
          {castName}さん、
          <br />
          <span className={styles.titleAccent}>お疲れ様でした！</span>
        </p>

        {todayCustomerCount > 0 ? (
          <div className={styles.customerCount}>
            <p className={styles.customerCountHighlight} aria-label={`${todayCustomerCount}人`}>
              {todayCustomerCount}
              <span className={styles.customerCountUnit}>人</span>
            </p>
            <p className={styles.customerCountTail}>との接客</p>
          </div>
        ) : null}

        <p className={styles.retentionMessage}>
          指名率を上げるために
          <br />
          <span className={styles.retentionHighlight}>今日接客した人</span>を伝えよう
        </p>

        <p className={styles.sub}>{statusText}</p>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={onStartReflection}>
            {ctaLabel}
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={onDismiss}>
            あとで
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
