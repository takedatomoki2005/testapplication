import {
  THANK_YOU_CAST_MODE_HINT,
  THANK_YOU_CAST_MODE_LABEL,
  THANK_YOU_CAST_MODE_ORDER,
  type ThankYouCastMode,
} from "@/lib/thankYouCastMode";
import styles from "./ThankYouCastModeSwitcher.module.css";

type Props = {
  mode: ThankYouCastMode;
  onChange: (mode: ThankYouCastMode) => void;
  targetCount: number;
  totalCount: number;
  variant?: "default" | "onPrimary";
};

export function ThankYouCastModeSwitcher({
  mode,
  onChange,
  targetCount,
  totalCount,
  variant = "onPrimary",
}: Props) {
  const onPrimary = variant === "onPrimary";

  return (
    <section
      className={`${styles.section} ${onPrimary ? styles.sectionOnPrimary : ""} ${onPrimary ? styles[`surface_${mode}`] : ""}`}
      aria-label="お礼LINEの頑張りモード"
    >
      <p className={styles.heading}>今日の頑張りモード</p>
      <div className={styles.tabs} role="tablist">
        {THANK_YOU_CAST_MODE_ORDER.map((id) => {
          const active = mode === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
              onClick={() => onChange(id)}
            >
              {THANK_YOU_CAST_MODE_LABEL[id]}
            </button>
          );
        })}
      </div>
      <p className={`${styles.hint} ${onPrimary ? styles.hintOnPrimary : ""}`}>
        {THANK_YOU_CAST_MODE_HINT[mode]}
      </p>
      {mode !== "full" && totalCount > targetCount && (
        <p className={`${styles.scope} ${onPrimary ? styles.scopeOnPrimary : ""}`}>
          対象 {targetCount}人 / 全{totalCount}人
        </p>
      )}
    </section>
  );
}
