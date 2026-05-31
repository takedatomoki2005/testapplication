import type { DiscoverAdvancedFilters } from "@/data/types";
import { WEEKDAY_LABELS } from "./followUpDiscover";

export type DiscoverFilterPresetId =
  | "weekday_today"
  | "avg_30k"
  | "total_500k"
  | "birthday_this_month"
  | "birthday_next_month";

export interface DiscoverPresetContext {
  weekday: number;
  weekdayLabel: string;
  month: number;
  nextMonth: number;
}

export interface DiscoverFilterPreset {
  id: DiscoverFilterPresetId;
  label: string;
  isActive: (filters: DiscoverAdvancedFilters) => boolean;
  toggle: (filters: DiscoverAdvancedFilters) => DiscoverAdvancedFilters;
}

export function getDiscoverPresetContext(referenceDate: string): DiscoverPresetContext {
  const date = new Date(`${referenceDate}T00:00:00`);
  const weekday = date.getDay();
  const month = date.getMonth() + 1;
  return {
    weekday,
    weekdayLabel: WEEKDAY_LABELS[weekday],
    month,
    nextMonth: month === 12 ? 1 : month + 1,
  };
}

export function buildDiscoverFilterPresets(ctx: DiscoverPresetContext): DiscoverFilterPreset[] {
  return [
    {
      id: "weekday_today",
      label: `${ctx.weekdayLabel}曜接客`,
      isActive: (filters) => filters.weekdays.includes(ctx.weekday),
      toggle: (filters) => {
        const active = filters.weekdays.includes(ctx.weekday);
        return {
          ...filters,
          weekdays: active
            ? filters.weekdays.filter((d) => d !== ctx.weekday)
            : [...filters.weekdays, ctx.weekday].sort((a, b) => a - b),
        };
      },
    },
    {
      id: "avg_30k",
      label: "平均3万〜",
      isActive: (filters) =>
        filters.avgSpendingMin === 30_000 && filters.avgSpendingMax == null,
      toggle: (filters) => {
        const active =
          filters.avgSpendingMin === 30_000 && filters.avgSpendingMax == null;
        return {
          ...filters,
          avgSpendingMin: active ? undefined : 30_000,
          avgSpendingMax: undefined,
        };
      },
    },
    {
      id: "total_500k",
      label: "累計50万〜",
      isActive: (filters) =>
        filters.totalSpendingMin === 500_000 && filters.totalSpendingMax == null,
      toggle: (filters) => {
        const active =
          filters.totalSpendingMin === 500_000 && filters.totalSpendingMax == null;
        return {
          ...filters,
          totalSpendingMin: active ? undefined : 500_000,
          totalSpendingMax: undefined,
        };
      },
    },
    {
      id: "birthday_this_month",
      label: "今月誕生日",
      isActive: (filters) =>
        filters.birthdayMonth === ctx.month && filters.birthdayDay == null,
      toggle: (filters) => {
        const active =
          filters.birthdayMonth === ctx.month && filters.birthdayDay == null;
        return {
          ...filters,
          birthdayMonth: active ? undefined : ctx.month,
          birthdayDay: undefined,
        };
      },
    },
    {
      id: "birthday_next_month",
      label: "来月誕生日",
      isActive: (filters) =>
        filters.birthdayMonth === ctx.nextMonth && filters.birthdayDay == null,
      toggle: (filters) => {
        const active =
          filters.birthdayMonth === ctx.nextMonth && filters.birthdayDay == null;
        return {
          ...filters,
          birthdayMonth: active ? undefined : ctx.nextMonth,
          birthdayDay: undefined,
        };
      },
    },
  ];
}
