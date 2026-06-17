"use client";

import { mockEvents } from "@/data/events";
import { route, stations } from "@/data/route";
import { useWizard } from "@/components/WizardProvider";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function ReturnRoute() {
  const { selectedEventId, reset } = useWizard();
  const event =
    mockEvents.find((e) => e.id === selectedEventId) ?? mockEvents[0];

  return (
    <section className="px-5 py-6 space-y-5">
      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] text-sub uppercase">
          Step 5
        </p>
        <h1 className="mt-1 text-[18px] font-extrabold text-ink leading-snug">
          この寄り道で帰る
        </h1>
        <p className="mt-1 text-[12px] text-sub">
          いつもの帰り道が、少しだけ新しい体験になります。
        </p>
      </div>

      <RouteTimeline title="通常ルート" muted>
        {stations.map((s, i) => (
          <RouteNode key={s.id} label={s.name} last={i === stations.length - 1} />
        ))}
      </RouteTimeline>

      <RouteTimeline title="寄り道ルート" highlight>
        {stations.map((s) => {
          const detourHere = s.id === event.stationId;
          return (
            <RouteNode
              key={s.id}
              label={s.name}
              detour={
                detourHere
                  ? {
                      walkMinutes: event.walkMinutes,
                      name: event.name,
                      venue: event.venue
                    }
                  : undefined
              }
              last={s.id === stations[stations.length - 1].id}
            />
          );
        })}
      </RouteTimeline>

      <div className="rounded-card bg-white p-4 shadow-card border border-line space-y-2">
        <Row label="通常到着" value={`${route.normalArrivalTime}`} />
        <Row label="寄り道後の到着" value={`${event.arrivalIfDetour}`} accent />
        <Row label="追加時間" value={`+${event.extraMinutes}分`} />
        <Row
          label="追加費用"
          value={event.costMaxYen === 0 ? "0円" : event.costLabel}
        />
      </div>

      <div className="rounded-card bg-primary text-white p-4 shadow-card">
        <p className="text-[13px] leading-relaxed">
          わざわざ探さなくても、いつもの道の中にある「行ってもいいかも」を見つけてくれる。
        </p>
      </div>

      <PrimaryButton variant="secondary" onClick={reset}>
        最初から見直す
      </PrimaryButton>
    </section>
  );
}

function RouteTimeline({
  title,
  children,
  highlight,
  muted
}: {
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-card p-4 border ${
        highlight
          ? "border-primary bg-primary-tint"
          : "border-line bg-white shadow-card"
      } ${muted ? "opacity-90" : ""}`}
    >
      <p
        className={`text-[11px] font-bold tracking-[0.14em] uppercase ${
          highlight ? "text-primary" : "text-sub"
        }`}
      >
        {title}
      </p>
      <ol className="mt-3 space-y-0">{children}</ol>
    </div>
  );
}

function RouteNode({
  label,
  last,
  detour
}: {
  label: string;
  last?: boolean;
  detour?: { walkMinutes: number; name: string; venue: string };
}) {
  return (
    <li className="relative pl-6">
      <span className="absolute left-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
      {!last && (
        <span className="absolute left-[9px] top-3.5 bottom-0 w-px bg-line" />
      )}
      <div className="pb-3">
        <p className="text-[13px] font-semibold text-ink">{label}</p>
        {detour && (
          <div className="mt-1.5 rounded-badge bg-white border border-primary/40 px-3 py-2">
            <p className="text-[10px] text-sub">
              徒歩{detour.walkMinutes}分で立ち寄り
            </p>
            <p className="text-[12px] font-bold text-primary mt-0.5">
              {detour.name}
            </p>
            <p className="text-[10px] text-sub">{detour.venue}</p>
            <p className="mt-1 text-[10px] text-sub">→ {label}に戻る</p>
          </div>
        )}
      </div>
    </li>
  );
}

function Row({
  label,
  value,
  accent
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[12px] text-sub">{label}</span>
      <span
        className={`text-[14px] font-bold ${accent ? "text-primary" : "text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}
