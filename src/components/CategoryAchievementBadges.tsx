import type { VisitCategory, VisitCategoryProgress } from "@/lib/visitCategory";
import styles from "./CategoryAchievementBadges.module.css";

type Props = {
  categories: VisitCategoryProgress[];
  highlight?: VisitCategory | "all";
  variant?: "popup" | "list";
};

function statusText(category: VisitCategoryProgress): string {
  if (category.empty) return "—";
  if (category.complete) return "達成";
  if (category.unsent === 1) return "あと1件";
  return `${category.resolved}/${category.total}`;
}

export function CategoryAchievementBadges({
  categories,
  highlight,
  variant = "popup",
}: Props) {
  const active = categories.filter((c) => !c.empty);

  if (active.length === 0) return null;

  return (
    <div
      className={`${styles.row}${variant === "list" ? ` ${styles.rowList}` : ""}`}
      role="list"
      aria-label="カテゴリ達成状況"
    >
      {active.map((category) => {
        const isHighlighted =
          highlight === "all" ? category.complete : highlight === category.id;
        const state = category.complete ? "done" : "pending";

        return (
          <div
            key={category.id}
            role="listitem"
            className={`${styles.badge} ${styles[`badge_${category.id}`]} ${styles[state]}${
              isHighlighted ? ` ${styles.highlight}` : ""
            }`}
          >
            <div className={styles.iconWrap}>
              <span className={styles.emoji} aria-hidden>
                {category.emoji}
              </span>
              {category.complete && (
                <span className={styles.check} aria-hidden>
                  ✓
                </span>
              )}
            </div>
            <span className={styles.label}>{category.label}</span>
            <span className={styles.status}>{statusText(category)}</span>
          </div>
        );
      })}
    </div>
  );
}
