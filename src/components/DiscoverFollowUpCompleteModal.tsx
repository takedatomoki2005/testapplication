import { useEffect } from "react";
import { createPortal } from "react-dom";
import baseStyles from "./EndOfDayPopupModal.module.css";

type Props = {
  sentCount: number;
  totalCount: number;
  onClose: () => void;
};

export function DiscoverFollowUpCompleteModal({ sentCount, totalCount, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className={baseStyles.overlay} onClick={onClose} role="presentation">
      <div
        className={baseStyles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="discover-complete-title"
      >
        <div className={baseStyles.hero}>
          <span className={baseStyles.emoji} aria-hidden>
            ✨
          </span>
        </div>

        <p id="discover-complete-title" className={baseStyles.title}>
          お疲れ様でした！
        </p>

        <p className={baseStyles.sub}>
          {sentCount > 0
            ? `${sentCount}件送れました — あと${totalCount - sentCount}件は一覧から`
            : `${totalCount}件確認しました — 一覧から続けられます`}
        </p>

        <div className={baseStyles.actions}>
          <button type="button" className={baseStyles.primaryBtn} onClick={onClose}>
            一覧を見る
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
