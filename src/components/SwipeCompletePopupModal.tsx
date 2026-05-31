import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { SwipeCompleteVariant, VisitCategorySummary } from "@/lib/visitCategory";
import { VISIT_CATEGORY_LABEL } from "@/lib/visitCategory";
import { CategoryAchievementBadges } from "./CategoryAchievementBadges";
import styles from "./SwipeCompletePopupModal.module.css";

type Props = {
  castName: string;
  variant: SwipeCompleteVariant;
  categorySummary: VisitCategorySummary;
  onClose: () => void;
};

function content(castName: string, variant: SwipeCompleteVariant) {
  switch (variant) {
    case "hon-shimei":
      return {
        emoji: "👑",
        kicker: "CATEGORY CLEAR",
        title: "がんばった！",
        sub: `${VISIT_CATEGORY_LABEL["hon-shimei"]}、全部クリアしたよ ✨`,
        button: "続ける",
        highlight: "hon-shimei" as const,
        allDone: false,
      };
    case "jounai-shimei":
      return {
        emoji: "🎯",
        kicker: "CATEGORY CLEAR",
        title: "がんばった！",
        sub: `${VISIT_CATEGORY_LABEL["jounai-shimei"]}、全部クリアしたよ ✨`,
        button: "続ける",
        highlight: "jounai-shimei" as const,
        allDone: false,
      };
    case "free":
      return {
        emoji: "🌸",
        kicker: "CATEGORY CLEAR",
        title: "がんばった！",
        sub: `${VISIT_CATEGORY_LABEL.free}、全部クリアしたよ ✨`,
        button: "続ける",
        highlight: "free" as const,
        allDone: false,
      };
    case "all":
      return {
        emoji: "🏆",
        kicker: "ALL CLEAR",
        title: (
          <>
            {castName}さん、
            <br />
            今日もお疲れ様！
          </>
        ),
        sub: "今日の振り返り、全部クリア ✨",
        button: "閉じる",
        highlight: "all" as const,
        allDone: true,
      };
  }
}

export function SwipeCompletePopupModal({
  castName,
  variant,
  categorySummary,
  onClose,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const { emoji, kicker, title, sub, button, highlight, allDone } = content(castName, variant);

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${styles.dialog}${allDone ? ` ${styles.dialogAllDone}` : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="swipe-complete-title"
      >
        <div className={styles.hero}>
          <div className={styles.sparkles} aria-hidden>
            <span className={styles.sparkle}>✨</span>
            <span className={styles.sparkle}>⭐</span>
            <span className={styles.sparkle}>✨</span>
          </div>
          <span className={styles.emoji} aria-hidden>
            {emoji}
          </span>
        </div>

        <p className={styles.kicker}>{kicker}</p>

        <p id="swipe-complete-title" className={styles.title}>
          {title}
        </p>

        {sub && <p className={styles.sub}>{sub}</p>}

        <CategoryAchievementBadges
          categories={categorySummary.categories}
          highlight={highlight}
        />

        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={onClose}>
            {button}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
