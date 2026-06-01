import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  filterThankYouEntriesByMode,
  getCastModeGoalTargetCount,
  THANK_YOU_CAST_MODE_HINT,
  THANK_YOU_CAST_MODE_LABEL,
  THANK_YOU_CAST_MODE_ORDER,
  type ThankYouCastMode,
} from "@/lib/thankYouCastMode";
import type { ThankYouEntry } from "@/data/types";
import styles from "./CastModeSelectModal.module.css";

const MODE_EMOJI: Record<ThankYouCastMode, string> = {
  full: "🔥",
  moderate: "✨",
  minimum: "🌿",
};

type Props = {
  entries: ThankYouEntry[];
  initialMode: ThankYouCastMode;
  onConfirm: (mode: ThankYouCastMode) => void;
};

export function CastModeSelectModal({ entries, initialMode, onConfirm }: Props) {
  const [selected, setSelected] = useState<ThankYouCastMode>(initialMode);
  const [flareTick, setFlareTick] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setSelected(initialMode);
  }, [initialMode]);

  const modeStats = useMemo(
    () =>
      THANK_YOU_CAST_MODE_ORDER.map((mode) => {
        const filtered = filterThankYouEntriesByMode(entries, mode);
        const targetCount = getCastModeGoalTargetCount(filtered.length, mode);
        return { mode, filteredCount: filtered.length, targetCount };
      }),
    [entries],
  );

  const pickMode = (mode: ThankYouCastMode) => {
    if (mode !== selected) setFlareTick((t) => t + 1);
    setSelected(mode);
  };

  return createPortal(
    <div className={`${styles.overlay} ${styles[`overlay_${selected}`]}`} role="presentation">
      <div
        className={`${styles.dialog} ${styles[`dialog_${selected}`]} ${styles.dialogFlare}`}
        key={flareTick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cast-mode-select-title"
      >
        <div className={`${styles.flameBurst} ${styles[`flameBurst_${selected}`]}`} aria-hidden />
        <div className={styles.flameEmbers} aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className={styles.ember} style={{ ["--i" as string]: i }} />
          ))}
        </div>

        <div className={styles.dialogInner}>
          <div className={styles.hero}>
            <div className={`${styles.flameRing} ${styles[`flameRing_${selected}`]}`} aria-hidden />
            <span className={styles.emoji} aria-hidden>
              {MODE_EMOJI[selected]}
            </span>
          </div>

          <h2 id="cast-mode-select-title" className={styles.title}>
            今日の頑張りモード
          </h2>
          <p className={styles.sub}>どれくらい頑張る？ モードを選んでスタート</p>

          <div className={styles.options} role="radiogroup" aria-label="頑張りモード">
            {modeStats.map(({ mode, filteredCount, targetCount }) => {
              const active = selected === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`${styles.option} ${styles[`option_${mode}`]} ${active ? styles.optionActive : ""}`}
                  onClick={() => pickMode(mode)}
                >
                  {active && (
                    <span
                      className={`${styles.optionFlame} ${styles[`optionFlame_${mode}`]}`}
                      aria-hidden
                    />
                  )}
                  <span className={styles.optionContent}>
                    <span className={styles.optionLabel}>{THANK_YOU_CAST_MODE_LABEL[mode]}</span>
                    <span className={styles.optionHint}>{THANK_YOU_CAST_MODE_HINT[mode]}</span>
                    {filteredCount > 0 && (
                      <span className={styles.optionMeta}>
                        対象{filteredCount}人 · 目標{targetCount}件
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className={`${styles.primaryBtn} ${styles[`primaryBtn_${selected}`]}`}
            onClick={() => onConfirm(selected)}
          >
            このモードではじめる
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
