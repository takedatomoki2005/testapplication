"use client";

import { route } from "@/data/route";
import {
  detourTimeOptions,
  timeOfDayOptions,
  type TimeOfDay
} from "@/data/preferences";
import { useWizard } from "@/components/WizardProvider";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function RouteRegistration() {
  const { preferences, toggleTimeOfDay, setDetourMinutes, next } = useWizard();

  return (
    <section className="px-5 py-6 space-y-6">
      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] text-sub uppercase">
          Step 1
        </p>
        <h1 className="mt-1 text-[20px] font-extrabold text-ink">
          いつものルートを登録
        </h1>
        <p className="mt-1 text-[12px] text-sub">
          毎日の移動を登録しておくだけ。検索は要りません。
        </p>
      </div>

      <div className="space-y-3">
        <Field label="出発地" value={route.origin.name} />
        <Field label="目的地" value={route.destination.name} />
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-semibold text-ink">よく使う時間帯</p>
        <CheckboxGroup<TimeOfDay>
          options={timeOfDayOptions.map((v) => ({ value: v, label: v }))}
          selected={preferences.timeOfDay}
          onToggle={toggleTimeOfDay}
        />
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-semibold text-ink">寄り道できる時間</p>
        <div className="grid grid-cols-3 gap-2">
          {detourTimeOptions.map((opt) => {
            const active = preferences.detourMinutes === opt.minutes;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDetourMinutes(opt.minutes)}
                className={`rounded-pill border py-2.5 text-[12px] font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-white text-sub"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <PrimaryButton onClick={next}>このルートを登録する</PrimaryButton>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card bg-white px-4 py-3 shadow-card border border-line">
      <p className="text-[10px] tracking-wider text-sub uppercase">{label}</p>
      <p className="mt-0.5 text-[15px] font-bold text-ink">{value}</p>
    </div>
  );
}
