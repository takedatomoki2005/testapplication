import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./EndOfDayPopupModal.module.css";

type Props = {
  unsentCount: number;
  allSent: boolean;
  castName: string;
  todayCustomerCount: number;
  discoverCount: number;
  onDiscover: () => void;
  onStartReflection: () => void;
  onDismiss: () => void;
};

export function EndOfDayPopupModal({
  unsentCount,
  allSent,
  castName,
  todayCustomerCount,
  discoverCount,
  onDiscover,
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
            🔍
          </span>
        </div>

        <p id="end-of-day-title" className={styles.title}>
          {castName}さん、
          <br />
          <span className={styles.titleAccent}>さらに見つけよう！</span>
        </p>

        <p className={styles.thanksSub}>今日もお疲れ様 — LINE友達からフォローアップ先を</p>

        {discoverCount > 0 ? (
          <div className={styles.customerCount}>
            <p className={styles.customerCountLead}>いま連絡すべき</p>
            <p className={styles.customerCountHighlight} aria-label={`${discoverCount}人`}>
              {discoverCount}
              <span className={styles.customerCountUnit}>人</span>
            </p>
            <p className={styles.customerCountTail}>のおすすめフォローアップ候補</p>
          </div>
        ) : todayCustomerCount > 0 ? (
          <div className={styles.customerCount}>
            <p className={styles.customerCountLead}>今日は</p>
            <p className={styles.customerCountHighlight} aria-label={`${todayCustomerCount}件`}>
              {todayCustomerCount}
              <span className={styles.customerCountUnit}>件</span>
            </p>
            <p className={styles.customerCountTail}>接客 — LINE友達もチェックしよう</p>
          </div>
        ) : null}

        <p className={styles.retentionMessage}>
          誕生日や場内指名のタイミングで
          <br />
          <span className={styles.retentionHighlight}>フォローアップすべき人</span>が見つかります
        </p>

        <p className={styles.sub}>{statusText}</p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNum}>1</span>
            <span className={styles.stepText}>お礼LINE</span>
          </div>
          <span className={styles.stepArrow} aria-hidden>
            →
          </span>
          <div className={styles.step}>
            <span className={styles.stepNum}>2</span>
            <span className={styles.stepText}>さらに見つけよう</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={onDiscover}>
            さらに見つけよう
          </button>
          <button type="button" className={styles.outlineBtn} onClick={onStartReflection}>
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
