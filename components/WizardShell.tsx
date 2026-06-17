"use client";

import { useWizard } from "./WizardProvider";
import { StepProgress } from "./StepProgress";

export function WizardShell({ children }: { children: React.ReactNode }) {
  const { step, back, reset, totalSteps } = useWizard();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <header className="bg-primary text-white px-5 py-3.5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="text-white/90 text-sm w-8 text-left disabled:opacity-0"
            aria-label="戻る"
          >
            ‹
          </button>
          <div className="flex items-center gap-[1px] font-extrabold tracking-[0.08em] text-[17px]">
            YORIMICH
            <span className="inline-block w-[9px] h-[9px] bg-white rounded-full mx-[1px] relative -top-[1px]" />
            I
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-white/90 text-[11px] w-8 text-right"
          >
            最初
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <StepProgress />
          <span className="text-[10px] tracking-wider text-white/80">
            STEP {step + 1} / {totalSteps}
          </span>
        </div>
      </header>

      <main className="flex-1 bg-bg pb-24">{children}</main>
    </div>
  );
}
