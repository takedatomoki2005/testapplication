import type { ShiftMemo, ThankYouEntry } from "@/data/types";

export type EntryMemoRow = {
  entry: ThankYouEntry;
  memo?: ShiftMemo;
};

export function buildMemoMap(memos: ShiftMemo[]): Map<string, ShiftMemo> {
  return new Map(memos.map((m) => [m.serviceRecordId, m]));
}

export function splitEntriesForMemoTimeline(
  entries: ThankYouEntry[],
  memoMap: Map<string, ShiftMemo>,
): { doneRows: EntryMemoRow[]; currentRows: EntryMemoRow[] } {
  const doneRows: EntryMemoRow[] = [];
  const currentRows: EntryMemoRow[] = [];

  for (const entry of entries) {
    const memo = memoMap.get(entry.serviceRecordId);
    const row = { entry, memo };
    if (memo?.status === "done") {
      doneRows.push(row);
    } else {
      currentRows.push(row);
    }
  }

  return { doneRows, currentRows };
}
