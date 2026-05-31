import { useMemo } from "react";
import type { DiscoverAdvancedFilters } from "@/data/types";
import {
  buildDiscoverFilterPresets,
  getDiscoverPresetContext,
} from "@/lib/discoverFilterPresets";
import {
  countActiveDiscoverFilters,
  EMPTY_DISCOVER_FILTERS,
  WEEKDAY_LABELS,
} from "@/lib/followUpDiscover";
import styles from "./DiscoverFiltersPanel.module.css";

type Props = {
  filters: DiscoverAdvancedFilters;
  onChange: (filters: DiscoverAdvancedFilters) => void;
  expanded: boolean;
  onToggle: () => void;
  businessDate: string;
};

function parseOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function parseManYen(value: string): number | undefined {
  const n = parseOptionalNumber(value);
  if (n == null) return undefined;
  return n * 10_000;
}

function formatManYen(yen?: number): string {
  if (yen == null) return "";
  return String(yen / 10_000);
}

function toggleWeekday(weekdays: number[], day: number): number[] {
  return weekdays.includes(day)
    ? weekdays.filter((d) => d !== day)
    : [...weekdays, day].sort((a, b) => a - b);
}

export function DiscoverFiltersPanel({
  filters,
  onChange,
  expanded,
  onToggle,
  businessDate,
}: Props) {
  const presetContext = useMemo(
    () => getDiscoverPresetContext(businessDate),
    [businessDate],
  );
  const presets = useMemo(
    () => buildDiscoverFilterPresets(presetContext),
    [presetContext],
  );
  const activeCount = countActiveDiscoverFilters(filters);
  const activePresetCount = presets.filter((p) => p.isActive(filters)).length;

  const patch = (partial: Partial<DiscoverAdvancedFilters>) => {
    onChange({ ...filters, ...partial });
  };

  const clearAll = () => onChange({ ...EMPTY_DISCOVER_FILTERS });

  return (
    <div className={styles.wrap}>
      <div className={styles.quickSection}>
        <div className={styles.quickHeader}>
          <span className={styles.quickTitle}>ワンタップ</span>
          {activePresetCount > 0 && (
            <span className={styles.quickActiveHint}>{activePresetCount}件 ON</span>
          )}
        </div>
        <div className={styles.presetRow}>
          {presets.map((preset) => {
            const active = preset.isActive(filters);
            return (
              <button
                key={preset.id}
                type="button"
                className={`${styles.presetChip}${active ? ` ${styles.presetActive}` : ""}`}
                onClick={() => onChange(preset.toggle(filters))}
                aria-pressed={active}
              >
                {active && (
                  <svg className={styles.presetCheck} viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 12l5 5L19 7"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className={styles.toggleBtn}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span className={styles.toggleLabel}>
          <svg className={styles.filterIcon} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 6h16M7 12h10M10 18h4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          詳細フィルター
        </span>
        {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
        <svg
          className={`${styles.chevron}${expanded ? ` ${styles.chevronOpen}` : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {expanded && (
        <div className={styles.panel}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>接客日</h3>
            <p className={styles.sectionHint}>何日前に接客したお客様か</p>
            <div className={styles.inlinePresets}>
              <button
                type="button"
                className={`${styles.inlinePreset}${
                  filters.daysSinceVisitMin === 7 && filters.daysSinceVisitMax === 30
                    ? ` ${styles.inlinePresetActive}`
                    : ""
                }`}
                onClick={() => {
                  const active =
                    filters.daysSinceVisitMin === 7 && filters.daysSinceVisitMax === 30;
                  patch({
                    daysSinceVisitMin: active ? undefined : 7,
                    daysSinceVisitMax: active ? undefined : 30,
                  });
                }}
              >
                7〜30日前
              </button>
              <button
                type="button"
                className={`${styles.inlinePreset}${
                  filters.daysSinceVisitMin === 0 && filters.daysSinceVisitMax === 7
                    ? ` ${styles.inlinePresetActive}`
                    : ""
                }`}
                onClick={() => {
                  const active =
                    filters.daysSinceVisitMin === 0 && filters.daysSinceVisitMax === 7;
                  patch({
                    daysSinceVisitMin: active ? undefined : 0,
                    daysSinceVisitMax: active ? undefined : 7,
                  });
                }}
              >
                1週間以内
              </button>
            </div>
            <div className={styles.rangeRow}>
              <label className={styles.rangeField}>
                <span className={styles.rangeLabel}>最短</span>
                <input
                  type="number"
                  min={0}
                  className={styles.input}
                  placeholder="0"
                  value={filters.daysSinceVisitMin ?? ""}
                  onChange={(e) =>
                    patch({ daysSinceVisitMin: parseOptionalNumber(e.target.value) })
                  }
                />
                <span className={styles.unit}>日前</span>
              </label>
              <span className={styles.rangeSep}>〜</span>
              <label className={styles.rangeField}>
                <span className={styles.rangeLabel}>最長</span>
                <input
                  type="number"
                  min={0}
                  className={styles.input}
                  placeholder="30"
                  value={filters.daysSinceVisitMax ?? ""}
                  onChange={(e) =>
                    patch({ daysSinceVisitMax: parseOptionalNumber(e.target.value) })
                  }
                />
                <span className={styles.unit}>日前</span>
              </label>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>累計金額</h3>
            <div className={styles.inlinePresets}>
              {[10, 30, 50, 100].map((man) => (
                <button
                  key={man}
                  type="button"
                  className={`${styles.inlinePreset}${
                    filters.totalSpendingMin === man * 10_000 &&
                    filters.totalSpendingMax == null
                      ? ` ${styles.inlinePresetActive}`
                      : ""
                  }`}
                  onClick={() => {
                    const active =
                      filters.totalSpendingMin === man * 10_000 &&
                      filters.totalSpendingMax == null;
                    patch({
                      totalSpendingMin: active ? undefined : man * 10_000,
                      totalSpendingMax: undefined,
                    });
                  }}
                >
                  {man}万〜
                </button>
              ))}
            </div>
            <div className={styles.rangeRow}>
              <label className={styles.rangeField}>
                <input
                  type="number"
                  min={0}
                  className={styles.input}
                  placeholder="10"
                  value={formatManYen(filters.totalSpendingMin)}
                  onChange={(e) =>
                    patch({ totalSpendingMin: parseManYen(e.target.value) })
                  }
                />
                <span className={styles.unit}>万円〜</span>
              </label>
              <label className={styles.rangeField}>
                <input
                  type="number"
                  min={0}
                  className={styles.input}
                  placeholder="100"
                  value={formatManYen(filters.totalSpendingMax)}
                  onChange={(e) =>
                    patch({ totalSpendingMax: parseManYen(e.target.value) })
                  }
                />
                <span className={styles.unit}>万円</span>
              </label>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>平均利用金額</h3>
            <div className={styles.inlinePresets}>
              {[3, 5, 10].map((man) => (
                <button
                  key={man}
                  type="button"
                  className={`${styles.inlinePreset}${
                    filters.avgSpendingMin === man * 10_000 && filters.avgSpendingMax == null
                      ? ` ${styles.inlinePresetActive}`
                      : ""
                  }`}
                  onClick={() => {
                    const active =
                      filters.avgSpendingMin === man * 10_000 &&
                      filters.avgSpendingMax == null;
                    patch({
                      avgSpendingMin: active ? undefined : man * 10_000,
                      avgSpendingMax: undefined,
                    });
                  }}
                >
                  {man}万〜
                </button>
              ))}
            </div>
            <div className={styles.rangeRow}>
              <label className={styles.rangeField}>
                <input
                  type="number"
                  min={0}
                  className={styles.input}
                  placeholder="3"
                  value={formatManYen(filters.avgSpendingMin)}
                  onChange={(e) => patch({ avgSpendingMin: parseManYen(e.target.value) })}
                />
                <span className={styles.unit}>万円〜</span>
              </label>
              <label className={styles.rangeField}>
                <input
                  type="number"
                  min={0}
                  className={styles.input}
                  placeholder="20"
                  value={formatManYen(filters.avgSpendingMax)}
                  onChange={(e) => patch({ avgSpendingMax: parseManYen(e.target.value) })}
                />
                <span className={styles.unit}>万円</span>
              </label>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>接客曜日</h3>
            <div className={styles.weekdayRow}>
              {WEEKDAY_LABELS.map((label, day) => (
                <button
                  key={label}
                  type="button"
                  className={`${styles.weekdayChip}${
                    filters.weekdays.includes(day) ? ` ${styles.weekdayActive}` : ""
                  }${day === presetContext.weekday ? ` ${styles.weekdayToday}` : ""}`}
                  onClick={() => patch({ weekdays: toggleWeekday(filters.weekdays, day) })}
                  aria-pressed={filters.weekdays.includes(day)}
                  title={day === presetContext.weekday ? "今日の曜日" : undefined}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>誕生日</h3>
            <div className={styles.inlinePresets}>
              <button
                type="button"
                className={`${styles.inlinePreset}${
                  presets.find((p) => p.id === "birthday_this_month")?.isActive(filters)
                    ? ` ${styles.inlinePresetActive}`
                    : ""
                }`}
                onClick={() =>
                  onChange(
                    presets.find((p) => p.id === "birthday_this_month")!.toggle(filters),
                  )
                }
              >
                今月（{presetContext.month}月）
              </button>
              <button
                type="button"
                className={`${styles.inlinePreset}${
                  presets.find((p) => p.id === "birthday_next_month")?.isActive(filters)
                    ? ` ${styles.inlinePresetActive}`
                    : ""
                }`}
                onClick={() =>
                  onChange(
                    presets.find((p) => p.id === "birthday_next_month")!.toggle(filters),
                  )
                }
              >
                来月（{presetContext.nextMonth}月）
              </button>
            </div>
            <div className={styles.birthdayRow}>
              <label className={styles.selectField}>
                <span className={styles.selectLabel}>月</span>
                <select
                  className={styles.select}
                  value={filters.birthdayMonth ?? ""}
                  onChange={(e) =>
                    patch({
                      birthdayMonth: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                >
                  <option value="">すべて</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}月
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.selectField}>
                <span className={styles.selectLabel}>日</span>
                <select
                  className={styles.select}
                  value={filters.birthdayDay ?? ""}
                  onChange={(e) =>
                    patch({
                      birthdayDay: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                >
                  <option value="">すべて</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}日
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {activeCount > 0 && (
            <button type="button" className={styles.clearBtn} onClick={clearAll}>
              フィルターをクリア
            </button>
          )}
        </div>
      )}
    </div>
  );
}
