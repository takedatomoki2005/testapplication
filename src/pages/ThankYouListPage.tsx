import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { AchievementReminder } from "@/components/AchievementReminder";
import { CustomerCard } from "@/components/CustomerCard";
import { Greeting } from "@/components/Greeting";
import { SwipeCustomerModal } from "@/components/SwipeCustomerModal";
import { ProcessedCustomerModal } from "@/components/ProcessedCustomerModal";
import { UndoStatusModal } from "@/components/UndoStatusModal";
import { computeVisitCategoryProgress } from "@/lib/visitCategory";
import { buildThankYouFlameMap } from "@/lib/matchRate";
import { formatBusinessDate, offsetBusinessDate } from "@/lib/thankYou";
import type { ThankYouEntry } from "@/data/types";
import styles from "./ThankYouListPage.module.css";

const MAX_PAST_DAYS = 2;

export function ThankYouListPage() {
  const location = useLocation();
  const { session, businessDate, getEntriesForVisitDate, undoSent } = useApp();
  const [dateOffset, setDateOffset] = useState(0);
  const [swipeOpen, setSwipeOpen] = useState(false);
  const [swipeStartIndex, setSwipeStartIndex] = useState(0);
  const [detailEntry, setDetailEntry] = useState<ThankYouEntry | null>(null);
  const [undoTarget, setUndoTarget] = useState<ThankYouEntry | null>(null);

  const selectedDate = useMemo(
    () => offsetBusinessDate(businessDate, -dateOffset),
    [businessDate, dateOffset],
  );
  const isToday = dateOffset === 0;

  const displayEntries = useMemo(
    () => getEntriesForVisitDate(selectedDate),
    [getEntriesForVisitDate, selectedDate],
  );

  const unsentEntries = useMemo(
    () => displayEntries.filter((e) => e.sendStatus === "unsent"),
    [displayEntries],
  );

  const unsentCount = unsentEntries.length;
  const hasAnyTarget = displayEntries.length > 0;
  const allSent =
    displayEntries.length > 0 &&
    displayEntries.every(
      (e) =>
        e.sendStatus === "sent" ||
        e.sendStatus === "no_line_exchange" ||
        e.sendStatus === "no_contact",
    );

  useEffect(() => {
    const state = location.state as { openSwipe?: boolean } | null;
    if (isToday && state?.openSwipe && unsentEntries.length > 0) {
      setSwipeStartIndex(0);
      setSwipeOpen(true);
    }
  }, [location.state, unsentEntries.length, isToday]);

  const achievement = computeVisitCategoryProgress(displayEntries);
  const flameMap = useMemo(
    () => buildThankYouFlameMap(displayEntries),
    [displayEntries],
  );

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

  const goToOlderDay = () => {
    setDateOffset((current) => Math.min(current + 1, MAX_PAST_DAYS));
  };

  const goToNewerDay = () => {
    setDateOffset((current) => Math.max(current - 1, 0));
  };

  const canGoOlder = dateOffset < MAX_PAST_DAYS;
  const canGoNewer = dateOffset > 0;

  return (
    <div className={styles.page}>
      {isToday ? (
        <Greeting name={session.name} allSent={allSent} unsent={unsentCount} />
      ) : (
        <div className={styles.pastGreeting}>
          <p className={styles.pastGreetingMain}>{formatBusinessDate(selectedDate)}</p>
          <p className={styles.pastGreetingSub}>
            {allSent
              ? "この日のお礼LINE、全員に処理完了 ✨"
              : unsentCount > 0
                ? `未対応があと${unsentCount}件 — タップして確認`
                : "この日のお礼LINE"}
          </p>
        </div>
      )}

      {hasAnyTarget && <AchievementReminder summary={achievement} />}

      <div className={styles.listHeader}>
        <div>
          <h2 className={styles.listTitle}>お礼LINE</h2>
          {!isToday && <p className={styles.listDate}>{formatBusinessDate(selectedDate)}</p>}
        </div>
        {(canGoOlder || canGoNewer) && (
          <div className={styles.dateNav}>
            {canGoOlder && (
              <button type="button" className={styles.dateNavBtn} onClick={goToOlderDay}>
                ← 前日
              </button>
            )}
            {canGoNewer && (
              <button type="button" className={styles.dateNavBtn} onClick={goToNewerDay}>
                {dateOffset === 1 ? "今日 →" : "翌日 →"}
              </button>
            )}
          </div>
        )}
      </div>
      <p className={styles.listHint}>
        場内指名 → フリーの順。お客様をタップ → フリックで対応
      </p>

      {!hasAnyTarget ? (
        <p className={styles.empty}>
          {isToday ? "本日の接客履歴はありません" : "この日の接客履歴はありません"}
        </p>
      ) : (
        displayEntries.map((entry) => (
          <CustomerCard
            key={entry.id}
            entry={entry}
            flameCount={flameMap.get(entry.id)}
            onOpen={openEntry}
          />
        ))
      )}

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
