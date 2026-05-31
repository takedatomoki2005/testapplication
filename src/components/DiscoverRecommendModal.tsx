import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { FollowUpContact } from "@/data/types";
import { formatListCustomerName } from "@/lib/customerDisplay";
import { getDiscoverRecommendReasons } from "@/lib/discoverRecommendReasons";
import styles from "./DiscoverRecommendModal.module.css";

type Props = {
  contact: FollowUpContact;
  businessDate: string;
  onClose: () => void;
  onSave: (recordId: string, payload: { lineName: string; lastMemo: string }) => void;
};

export function DiscoverRecommendModal({ contact, businessDate, onClose, onSave }: Props) {
  const [memo, setMemo] = useState(contact.lastMemo ?? "");

  const reasons = useMemo(
    () => getDiscoverRecommendReasons(contact, businessDate),
    [contact, businessDate],
  );

  const { primary, alias } = formatListCustomerName(contact.customer);

  useEffect(() => {
    setMemo(contact.lastMemo ?? "");
  }, [contact.id, contact.lastMemo]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSave = () => {
    onSave(contact.id, {
      lineName: contact.lineName?.trim() ?? "",
      lastMemo: memo.trim(),
    });
    onClose();
  };

  return createPortal(
    <>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="閉じる"
      >
        ✕
      </button>
      <div className={styles.overlay} onClick={onClose} role="presentation">
        <div
          className={styles.dialog}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="discover-recommend-title"
        >
          <p className={styles.eyebrow}>おすすめの理由</p>
          <div className={styles.nameRow}>
            <h2 id="discover-recommend-title" className={styles.name}>
              {primary}
            </h2>
            {alias && <span className={styles.alias}>{alias}</span>}
          </div>

          {contact.lineName && (
            <p className={styles.lineName}>
              LINE: <span>{contact.lineName}</span>
            </p>
          )}

          <p className={styles.reasonsTitle}>なぜ今フォローアップ？</p>

          {reasons.length === 0 ? (
            <p className={styles.emptyReasons}>
              誕生日・場内指名のタイミングは該当しません。優先度や来店傾向からピックアップしています。
            </p>
          ) : (
            <ul className={styles.reasonList}>
              {reasons.map((reason) => {
                if (reason.kind === "birthday") {
                  return (
                    <li
                      key="birthday"
                      className={`${styles.reasonCard} ${styles.reasonCardHighlight}`}
                    >
                      <span className={styles.reasonIcon} aria-hidden>
                        🎂
                      </span>
                      <div className={styles.reasonBody}>
                        <p className={styles.reasonLabel}>誕生日</p>
                        <p className={styles.reasonDetail}>{reason.timingLabel}</p>
                        {reason.birthLabel && (
                          <p className={styles.reasonSub}>{reason.birthLabel}</p>
                        )}
                      </div>
                    </li>
                  );
                }

                return (
                  <li key="in-store" className={styles.reasonCard}>
                    <span className={styles.reasonIcon} aria-hidden>
                      🎯
                    </span>
                    <div className={styles.reasonBody}>
                      <p className={styles.reasonLabel}>場内指名</p>
                      <p className={styles.reasonDetail}>{reason.daysLabel}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <p className={styles.actionHint}>{contact.suggestedAction}</p>

          <div className={styles.memoSection}>
            <label className={styles.memoLabel} htmlFor="discover-memo">
              メモ
            </label>
            <textarea
              id="discover-memo"
              className={styles.memoInput}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="フォローアップ内容や気づきを残す"
              rows={3}
            />
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
                className={styles.primaryBtn}
              >
                LINEで連絡
              </a>
            ) : (
              <button type="button" className={styles.secondaryBtn} onClick={onClose}>
                閉じる
              </button>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
