"use client";

import { WizardProvider, useWizard } from "@/components/WizardProvider";
import { WizardShell } from "@/components/WizardShell";
import { RouteRegistration } from "@/components/steps/RouteRegistration";
import { InterestRegistration } from "@/components/steps/InterestRegistration";
import { TodayRecommendations } from "@/components/steps/TodayRecommendations";
import { DetourDetail } from "@/components/steps/DetourDetail";
import { ReturnRoute } from "@/components/steps/ReturnRoute";

function CurrentStep() {
  const { step } = useWizard();
  switch (step) {
    case 0:
      return <RouteRegistration />;
    case 1:
      return <InterestRegistration />;
    case 2:
      return <TodayRecommendations />;
    case 3:
      return <DetourDetail />;
    case 4:
      return <ReturnRoute />;
    default:
      return <RouteRegistration />;
  }
}

export default function Page() {
  return (
    <WizardProvider>
      <WizardShell>
        <CurrentStep />
      </WizardShell>
    </WizardProvider>
  );
}
