import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { FollowUpContact } from "@/data/types";
import { formatListCustomerName } from "@/lib/customerDisplay";
import { getDiscoverRecommendReasons } from "@/lib/discoverRecommendReasons";
import baseStyles from "./EndOfDayPopupModal.module.css";
import styles from "./DiscoverLaunchPopupModal.module.css";

type Props = {
  contacts: FollowUpContact[];
  businessDate: string;
  onSent: (contact: FollowUpContact) => void;
  onComplete: (sentCount: number) => void;
  onViewDetail: (contact: FollowUpContact) => void;
  onDismiss: () => void;
};

export function DiscoverLaunchPopupModal({
  contacts,
  businessDate,
  onSent,
  onComplete,
  onViewDetail,
  onDismiss,
}: Props) {
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [sentCount, setSentCount] = useState(0);

  const queue = useMemo(
    () => contacts.filter((c) => !skippedIds.includes(c.id)),
    [contacts, skippedIds],
  );

  const current = queue[0];
  const currentIndex = contacts.length - queue.length + 1;
  const isComplete = !current;

  const reasons = useMemo(
    () => (current ? getDiscoverRecommendReasons(current, businessDate) : []),
    [current, businessDate],
  );

  const { primary, alias } = current
    ? formatListCustomerName(current.customer)
    : { primary: "", alias: null as string | null };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (isComplete) return null;

  const handleSkip = () => {
    const nextSkipped = [...skippedIds, current.id];
    setSkippedIds(nextSkipped);
    if (contacts.every((c) => nextSkipped.includes(c.id))) {
      onComplete(sentCount);
    }
  };

  const handleSent = () => {
    onSent(current);
    const nextSent = sentCount + 1;
    const nextSkipped = [...skippedIds, current.id];
    setSentCount(nextSent);
    setSkippedIds(nextSkipped);
    if (contacts.every((c) => nextSkipped.includes(c.id))) {
      onComplete(nextSent);
    }
  };

  const openLine = () => {
    if (current.customer.lineUrl) {
      window.open(current.customer.lineUrl, "_blank", "noopener,noreferrer");
    }
  };

  return createPortal(
    <div className={baseStyles.overlay} onClick={onDismiss} role="presentation">
      <div
        className={`${baseStyles.dialog} ${styles.dialog}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="discover-launch-title"
      >
        <p className={styles.progress} aria-live="polite">
          {currentIndex} / {contacts.length}
        </p>

        <div className={baseStyles.hero}>
          <span className={baseStyles.emoji} aria-hidden>
            💌
          </span>
        </div>

        <p id="discover-launch-title" className={baseStyles.title}>
          おすすめフォローアップ
        </p>

        <button
          type="button"
          className={styles.personCard}
          onClick={() => onViewDetail(current)}
        >
          <p className={styles.personName}>{primary}</p>
          {alias && <p className={styles.personAlias}>{alias}</p>}
          {current.lineName && (
            <p className={styles.personLine}>LINE: {current.lineName}</p>
          )}

          {reasons.length > 0 && (
            <ul className={styles.reasonList}>
              {reasons.map((reason) => {
                if (reason.kind === "birthday") {
                  return (
                    <li key="birthday" className={styles.reasonItem}>
                      <span className={styles.reasonIcon} aria-hidden>
                        🎂
                      </span>
                      <span className={styles.reasonText}>
                        誕生日 <strong>{reason.timingLabel}</strong>
                        {reason.birthLabel ? ` · ${reason.birthLabel}` : ""}
                      </span>
                    </li>
                  );
                }
                return (
                  <li key="in-store" className={styles.reasonItem}>
                    <span className={styles.reasonIcon} aria-hidden>
                      🎯
                    </span>
                    <span className={styles.reasonText}>
                      場内指名 <strong>{reason.daysLabel}</strong>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <p className={styles.actionHint}>{current.suggestedAction}</p>
          <p className={styles.detailHint}>タップしてお客様詳細を見る</p>
        </button>

        {current.customer.lineUrl && (
          <button type="button" className={styles.lineBtn} onClick={openLine}>
            LINEを開く
          </button>
        )}

        <div className={styles.queueActions}>
          <button type="button" className={styles.skipBtn} onClick={handleSkip}>
            スキップ
          </button>
          <button type="button" className={styles.sentBtn} onClick={handleSent}>
            送った
          </button>
        </div>

        {sentCount > 0 && (
          <p className={styles.sentHint}>送信済み {sentCount}件</p>
        )}
      </div>
    </div>,
    document.body,
  );
}
