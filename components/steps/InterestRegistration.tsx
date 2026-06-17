"use client";

import {
  budgetOptions,
  interestOptions,
  type BudgetId,
  type Interest
} from "@/data/preferences";
import { useWizard } from "@/components/WizardProvider";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function InterestRegistration() {
  const { preferences, toggleInterest, toggleBudget, next } = useWizard();

  return (
    <section className="px-5 py-6 space-y-6">
      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] text-sub uppercase">
          Step 2
        </p>
        <h1 className="mt-1 text-[20px] font-extrabold text-ink">
          興味のある寄り道を選ぶ
        </h1>
        <p className="mt-1 text-[12px] text-sub">
          細かく決めなくて大丈夫。ざっくりでOKです。
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-semibold text-ink">ジャンル</p>
        <CheckboxGroup<Interest>
          options={interestOptions.map((v) => ({ value: v, label: v }))}
          selected={preferences.interests}
          onToggle={toggleInterest}
        />
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-semibold text-ink">予算感</p>
        <CheckboxGroup<BudgetId>
          options={budgetOptions.map((b) => ({ value: b.id, label: b.label }))}
          selected={preferences.budgetIds}
          onToggle={toggleBudget}
        />
      </div>

      <PrimaryButton onClick={next}>保存する</PrimaryButton>
    </section>
  );
}
