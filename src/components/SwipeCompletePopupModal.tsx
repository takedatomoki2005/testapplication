import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { SwipeCompleteVariant, VisitCategorySummary } from "@/lib/visitCategory";
import { VISIT_CATEGORY_LABEL } from "@/lib/visitCategory";
import { CategoryAchievementBadges } from "./CategoryAchievementBadges";
import styles from "./SwipeCompletePopupModal.module.css";

type AllDoneTab = "discover" | "clear";

type Props = {
  castName: string;
  variant: SwipeCompleteVariant;
  categorySummary: VisitCategorySummary;
  discoverCount?: number;
  onClose: () => void;
  onDiscover?: () => void;
};

function content(_castName: string, variant: SwipeCompleteVariant) {
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
        title: null,
        sub: null,
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
  discoverCount = 0,
  onClose,
  onDiscover,
}: Props) {
  const [allDoneTab, setAllDoneTab] = useState<AllDoneTab>("discover");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const { emoji, kicker, title, sub, button, highlight, allDone } = content(castName, variant);
  const heroEmoji = allDone && allDoneTab === "discover" ? "🔍" : emoji;

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
            {heroEmoji}
          </span>
        </div>

        <p className={styles.kicker}>{kicker}</p>

        {allDone ? (
          <>
            <div className={styles.tabRow} role="tablist" aria-label="次のアクション">
              <button
                type="button"
                role="tab"
                aria-selected={allDoneTab === "discover"}
                className={`${styles.tab}${allDoneTab === "discover" ? ` ${styles.tabActive}` : ""}`}
                onClick={() => setAllDoneTab("discover")}
              >
                もっと探す
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={allDoneTab === "clear"}
                className={`${styles.tab}${allDoneTab === "clear" ? ` ${styles.tabActive}` : ""}`}
                onClick={() => setAllDoneTab("clear")}
              >
                クリア
              </button>
            </div>

            {allDoneTab === "discover" ? (
              <div className={styles.tabPanel}>
                <p id="swipe-complete-title" className={styles.title}>
                  <span className={styles.titleAccent}>LINE友達</span>から
                  <br />
                  フォローアップ先を探そう
                </p>
                {discoverCount > 0 ? (
                  <div className={styles.discoverCount}>
                    <p className={styles.discoverCountLead}>いま連絡すべき</p>
                    <p
                      className={styles.discoverCountHighlight}
                      aria-label={`${discoverCount}人`}
                    >
                      {discoverCount}
                      <span className={styles.discoverCountUnit}>人</span>
                    </p>
                    <p className={styles.discoverCountTail}>のおすすめ候補</p>
                  </div>
                ) : (
                  <p className={styles.sub}>
                    誕生日や場内指名のタイミングで
                    <br />
                    フォローアップすべき人が見つかります
                  </p>
                )}
              </div>
            ) : (
              <div className={styles.tabPanel}>
                <p id="swipe-complete-title" className={styles.title}>
                  お礼LINE、全部クリア！
                </p>
                <p className={styles.sub}>今日のお礼LINE、全部クリア ✨</p>
              </div>
            )}
          </>
        ) : (
          <>
            <p id="swipe-complete-title" className={styles.title}>
              {title}
            </p>
            {sub && <p className={styles.sub}>{sub}</p>}
          </>
        )}

        <CategoryAchievementBadges
          categories={categorySummary.badgeCategories}
          highlight={highlight}
        />

        <div className={styles.actions}>
          {allDone && onDiscover ? (
            <>
              <button type="button" className={styles.primaryBtn} onClick={onDiscover}>
                もっと探す
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={onClose}>
                閉じる
              </button>
            </>
          ) : (
            <button type="button" className={styles.primaryBtn} onClick={onClose}>
              {button}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
