"use client";

import { totalSteps } from "@/lib/wizard";
import { useWizard } from "./WizardProvider";

export function StepProgress() {
  const { step } = useWizard();
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <span
          key={i}
          className={`h-1 rounded-pill transition-all ${
            i <= step ? "bg-white w-5" : "bg-white/40 w-2"
          }`}
        />
      ))}
    </div>
  );
}
