import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatBusinessDate } from "@/lib/thankYou";
import { buildMemoMap, splitEntriesForMemoTimeline, type EntryMemoRow } from "@/lib/shiftMemo";
import { ShiftMemoFlow } from "@/components/ShiftMemoFlow";
import { ShiftMemoEditModal } from "@/components/ShiftMemoEditModal";
import styles from "./MemoPage.module.css";

export function MemoPage() {
  const {
    businessDate,
    myMemoEntries,
    myShiftMemos,
    upsertShiftMemo,
    completeShiftMemo,
    reopenShiftMemo,
  } = useApp();
  const [selectedRow, setSelectedRow] = useState<EntryMemoRow | null>(null);

  const memoMap = useMemo(() => buildMemoMap(myShiftMemos), [myShiftMemos]);

  const { doneRows, currentRows } = useMemo(
    () => splitEntriesForMemoTimeline(myMemoEntries, memoMap),
    [myMemoEntries, memoMap],
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.date}>{formatBusinessDate(businessDate)}</p>
        <h1 className={styles.title}>退勤前メモ</h1>
        <p className={styles.sub}>
          上から順に対応したお客様 — タップしてLINE名とお客様メモを残せます
        </p>
      </header>

      <ShiftMemoFlow
        doneRows={doneRows}
        currentRows={currentRows}
        onSelect={setSelectedRow}
      />

      {selectedRow && (
        <ShiftMemoEditModal
          entry={selectedRow.entry}
          memo={
            selectedRow.memo ?? memoMap.get(selectedRow.entry.serviceRecordId)
          }
          onClose={() => setSelectedRow(null)}
          onSave={upsertShiftMemo}
          onMarkDone={completeShiftMemo}
          onMarkPending={reopenShiftMemo}
        />
      )}
    </div>
  );
}
