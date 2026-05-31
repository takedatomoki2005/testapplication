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
      ? `お礼LINEがあと${unsentCount}件 — 振り返りから処理できます`
      : "今日の振り返りを確認しましょう";

  const ctaLabel = allSent ? "振り返りを見る" : "今日の振り返りを始める";

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
            ✨
          </span>
        </div>

        <p id="end-of-day-title" className={styles.title}>
          {castName}さん、
          <br />
          今日もお疲れ様でした！
        </p>

        {todayCustomerCount > 0 && (
          <div className={styles.customerCount}>
            <p className={styles.customerCountLead}>今日は</p>
            <p className={styles.customerCountHighlight} aria-label={`${todayCustomerCount}件`}>
              {todayCustomerCount}
              <span className={styles.customerCountUnit}>件</span>
            </p>
            <p className={styles.customerCountTail}>のお客さんと話せました</p>
          </div>
        )}

        <p className={styles.retentionMessage}>
          お客様の<span className={styles.retentionHighlight}>継続率</span>、
          <br />
          これからも高めていきましょう
        </p>

        <p className={styles.sub}>{statusText}</p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNum}>1</span>
            <span className={styles.stepText}>退勤前メモ</span>
          </div>
          <span className={styles.stepArrow} aria-hidden>
            →
          </span>
          <div className={styles.step}>
            <span className={styles.stepNum}>2</span>
            <span className={styles.stepText}>振り返り・お礼LINE</span>
          </div>
        </div>

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
