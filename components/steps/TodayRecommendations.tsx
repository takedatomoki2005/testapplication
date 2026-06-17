"use client";

import { route } from "@/data/route";
import { useWizard } from "@/components/WizardProvider";
import { scoreEvents } from "@/lib/recommendations";
import { EventCard } from "@/components/ui/EventCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function TodayRecommendations() {
  const { preferences, selectEvent, next } = useWizard();
  const ranked = scoreEvents(preferences);
  const top = ranked[0];

  return (
    <section className="px-5 py-6 space-y-5">
      <div className="rounded-card bg-primary text-white p-4 shadow-card">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase opacity-80">
          Notification
        </p>
        <p className="mt-1 text-[13px] font-bold leading-snug">
          今日の帰り道、{top.event.stationName}で寄れそうです。
        </p>
        <p className="mt-1 text-[11px] opacity-90">
          いつもの帰宅ルートから、追加{top.event.extraMinutes}分で立ち寄れます。
        </p>
      </div>

      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] text-sub uppercase">
          Step 3
        </p>
        <h1 className="mt-1 text-[18px] font-extrabold text-ink leading-snug">
          今日の帰り道に、寄れる場所があります。
        </h1>
        <p className="mt-2 text-[12px] text-sub">
          {route.origin.name} → {route.destination.name}
          <span className="mx-1.5 text-line">|</span>
          いつもの移動 {route.travelMinutes}分
        </p>
      </div>

      <div className="space-y-4">
        {ranked.map((rec, i) => (
          <EventCard
            key={rec.event.id}
            index={i + 1}
            event={rec.event}
            isStrong={rec.isStrong}
            isTop={i === 0}
            onSelect={() => {
              selectEvent(rec.event.id);
              next();
            }}
          />
        ))}
      </div>

      <div className="rounded-card border border-primary/30 bg-primary-tint p-3.5">
        <p className="text-[12px] font-semibold text-ink leading-relaxed">
          今日は、{top.event.stationName}の「{top.event.name}」が一番寄りやすそうです。
        </p>
      </div>

      <PrimaryButton
        onClick={() => {
          selectEvent(top.event.id);
          next();
        }}
      >
        この寄り道を詳しく見る
      </PrimaryButton>
    </section>
  );
}
