"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  defaultPreferences,
  type BudgetId,
  type Interest,
  type Preferences,
  type TimeOfDay
} from "@/data/preferences";
import { mockEvents } from "@/data/events";
import { totalSteps } from "@/lib/wizard";

type WizardState = {
  step: number;
  preferences: Preferences;
  selectedEventId: string;
};

type WizardContextValue = WizardState & {
  totalSteps: number;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
  reset: () => void;
  toggleTimeOfDay: (value: TimeOfDay) => void;
  setDetourMinutes: (value: number) => void;
  toggleInterest: (value: Interest) => void;
  toggleBudget: (value: BudgetId) => void;
  selectEvent: (id: string) => void;
};

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [selectedEventId, setSelectedEventId] = useState<string>(mockEvents[0].id);

  const value = useMemo<WizardContextValue>(() => {
    const toggleInList = <T,>(list: T[], item: T): T[] =>
      list.includes(item) ? list.filter((v) => v !== item) : [...list, item];

    return {
      step,
      preferences,
      selectedEventId,
      totalSteps,
      next: () => setStep((s) => Math.min(s + 1, totalSteps - 1)),
      back: () => setStep((s) => Math.max(s - 1, 0)),
      goTo: (s) => setStep(Math.max(0, Math.min(s, totalSteps - 1))),
      reset: () => {
        setStep(0);
        setPreferences(defaultPreferences);
        setSelectedEventId(mockEvents[0].id);
      },
      toggleTimeOfDay: (v) =>
        setPreferences((p) => ({ ...p, timeOfDay: toggleInList(p.timeOfDay, v) })),
      setDetourMinutes: (v) =>
        setPreferences((p) => ({ ...p, detourMinutes: v })),
      toggleInterest: (v) =>
        setPreferences((p) => ({ ...p, interests: toggleInList(p.interests, v) })),
      toggleBudget: (v) =>
        setPreferences((p) => ({ ...p, budgetIds: toggleInList(p.budgetIds, v) })),
      selectEvent: (id) => setSelectedEventId(id)
    };
  }, [step, preferences, selectedEventId]);

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}
