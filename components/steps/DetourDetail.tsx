"use client";

import { mockEvents } from "@/data/events";
import { route } from "@/data/route";
import { useWizard } from "@/components/WizardProvider";
import { scoreEvents } from "@/lib/recommendations";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function DetourDetail() {
  const { preferences, selectedEventId, next, back } = useWizard();
  const event =
    mockEvents.find((e) => e.id === selectedEventId) ?? mockEvents[0];
  const rec = scoreEvents(preferences).find((r) => r.event.id === event.id);

  const reasons = [
    `いつもの帰り道の途中駅（${event.stationName}）にあります`,
    `駅から徒歩${event.walkMinutes}分で着けます`,
    rec?.withinTime
      ? `${preferences.detourMinutes}分以内の寄り道で戻れます`
      : `寄り道時間は+${event.extraMinutes}分かかります`,
    rec && rec.matchedInterests.length > 0
      ? `あなたが保存した「${rec.matchedInterests.join("・")}」に近い内容です`
      : "新しいジャンルとの出会いになりそうです",
    `今日${event.closesAt}まで開催されています`
  ];

  return (
    <section className="px-5 py-6 space-y-5">
      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] text-sub uppercase">
          Step 4
        </p>
        <h1 className="mt-1 text-[18px] font-extrabold text-ink leading-snug">
          {event.stationName}で、少しだけ寄り道しませんか？
        </h1>
      </div>

      <div className="rounded-card bg-white p-4 shadow-card border border-line space-y-2">
        <h2 className="text-[17px] font-extrabold text-ink">{event.name}</h2>
        <p className="text-[12px] text-sub">{event.venue}</p>
        <dl className="mt-2 grid grid-cols-2 gap-y-1.5 text-[12px]">
          <Spec label="駅から" value={`徒歩${event.walkMinutes}分`} />
          <Spec label="開催時間" value={`${event.opensAt}〜${event.closesAt}`} />
          <Spec label="費用" value={event.costLabel} />
          <Spec label="追加時間" value={`+${event.extraMinutes}分`} />
        </dl>
      </div>

      <div className="rounded-card bg-primary-tint p-4 space-y-2">
        <p className="text-[12px] font-bold text-primary">なぜおすすめ？</p>
        <ul className="space-y-1.5 text-[12px] text-ink leading-relaxed">
          {reasons.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-card bg-white p-4 shadow-card border border-line">
        <p className="text-[11px] font-bold tracking-wider text-sub uppercase">
          帰宅時間の目安
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-sub">通常</p>
            <p className="text-[18px] font-bold text-ink">
              {route.normalArrivalTime}着
            </p>
          </div>
          <div className="text-primary text-xl">→</div>
          <div className="text-right">
            <p className="text-[11px] text-sub">寄り道する場合</p>
            <p className="text-[18px] font-bold text-primary">
              {event.arrivalIfDetour}着
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <PrimaryButton onClick={next}>この寄り道で帰る</PrimaryButton>
        <PrimaryButton variant="secondary" onClick={() => alert("保存しました")}>
          保存する
        </PrimaryButton>
        <PrimaryButton variant="ghost" onClick={back}>
          今日は行かない
        </PrimaryButton>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-sub">{label}</dt>
      <dd className="text-ink font-semibold text-right">{value}</dd>
    </>
  );
}
