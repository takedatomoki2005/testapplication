import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { AchievementReminder } from "@/components/AchievementReminder";
import { CustomerCard } from "@/components/CustomerCard";
import { Greeting } from "@/components/Greeting";
import { SwipeCustomerModal } from "@/components/SwipeCustomerModal";
import { ProcessedCustomerModal } from "@/components/ProcessedCustomerModal";
import { UndoStatusModal } from "@/components/UndoStatusModal";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { computeAchievementProgress } from "@/lib/achievementProgress";
import type { ThankYouEntry } from "@/data/types";
import styles from "./ThankYouListPage.module.css";

export function ThankYouListPage() {
  const location = useLocation();
  const { session, myEntries, unsentCount, allSent, hasAnyTarget, undoSent } = useApp();
  const [swipeOpen, setSwipeOpen] = useState(false);
  const [swipeStartIndex, setSwipeStartIndex] = useState(0);
  const [detailEntry, setDetailEntry] = useState<ThankYouEntry | null>(null);
  const [undoTarget, setUndoTarget] = useState<ThankYouEntry | null>(null);

  const unsentEntries = useMemo(
    () => myEntries.filter((e) => e.sendStatus === "unsent"),
    [myEntries],
  );

  useEffect(() => {
    const state = location.state as { openSwipe?: boolean } | null;
    if (state?.openSwipe && unsentEntries.length > 0) {
      setSwipeStartIndex(0);
      setSwipeOpen(true);
    }
  }, [location.state, unsentEntries.length]);
  const achievement = computeAchievementProgress(myEntries);

  const openEntry = (entry: ThankYouEntry) => {
    if (entry.sendStatus === "unsent") {
      const idx = unsentEntries.findIndex((e) => e.id === entry.id);
      if (idx === -1) return;
      setSwipeStartIndex(idx);
      setSwipeOpen(true);
      return;
    }
    setDetailEntry(entry);
  };

  const requestUndo = (entry: ThankYouEntry) => {
    setUndoTarget(entry);
  };

  const confirmUndo = () => {
    if (!undoTarget) return;
    undoSent(undoTarget.id);
    setUndoTarget(null);
    setDetailEntry(null);
  };

  if (session.role !== "cast") {
    return (
      <div className="page">
        <p>キャストロールに切り替えてください</p>
        <RoleSwitcher />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Greeting name={session.name} allSent={allSent} unsent={unsentCount} />

      {hasAnyTarget && <AchievementReminder summary={achievement} />}

      <h2 className={styles.listTitle}>振り返り</h2>
      <p className={styles.listHint}>お客様をタップ → フリックで処理</p>

      {!hasAnyTarget ? (
        <p className={styles.empty}>本日の接客履歴はありません</p>
      ) : (
        myEntries.map((entry) => (
          <CustomerCard
            key={entry.id}
            entry={entry}
            onOpen={openEntry}
          />
        ))
      )}

      <RoleSwitcher />

      {swipeOpen && (
        <SwipeCustomerModal
          entries={unsentEntries}
          startIndex={swipeStartIndex}
          onClose={() => setSwipeOpen(false)}
        />
      )}

      {detailEntry && (
        <ProcessedCustomerModal
          entry={detailEntry}
          onClose={() => setDetailEntry(null)}
          onUndo={() => requestUndo(detailEntry)}
        />
      )}

      {undoTarget && (
        <UndoStatusModal
          entry={undoTarget}
          onClose={() => setUndoTarget(null)}
          onConfirm={confirmUndo}
        />
      )}
    </div>
  );
}
