"use client";

import type { MockEvent } from "@/data/events";

type Props = {
  index: number;
  event: MockEvent;
  isStrong: boolean;
  isTop?: boolean;
  onSelect: () => void;
};

export function EventCard({ index, event, isStrong, isTop, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full text-left rounded-card bg-white p-4 shadow-card border transition-colors ${
        isStrong
          ? "border-line hover:border-primary"
          : "border-line opacity-70 hover:opacity-100"
      }`}
    >
      {isTop && (
        <span className="absolute -top-2 left-4 rounded-pill bg-accent px-2 py-0.5 text-[10px] font-extrabold text-ink">
          おすすめ
        </span>
      )}
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
              isStrong ? "bg-primary text-white" : "bg-line text-sub"
            }`}
          >
            {index}
          </span>
          <span className="text-[11px] font-semibold tracking-wide text-sub">
            {event.stationName}
          </span>
        </div>
        <span className="text-[11px] text-sub">+{event.extraMinutes}分</span>
      </div>
      <h3 className="mt-2 text-[15px] font-bold text-ink">{event.name}</h3>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-sub">
        <span>駅から徒歩{event.walkMinutes}分</span>
        <span>{event.costLabel}</span>
        <span>{event.closesAt}まで</span>
      </div>
      {!isStrong && (
        <div className="mt-3 rounded-badge bg-bg px-2.5 py-1.5 text-[10px] text-sub">
          条件から少し外れる候補
        </div>
      )}
    </button>
  );
}
