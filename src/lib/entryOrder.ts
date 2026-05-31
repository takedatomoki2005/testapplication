import type { ThankYouEntry } from "@/data/types";

/** 接客開始時刻の早い順（対応した順） */
export function sortEntriesByServiceTime(entries: ThankYouEntry[]): ThankYouEntry[] {
  return [...entries].sort((a, b) => {
    const ta = a.serviceStartTime ?? "24:00";
    const tb = b.serviceStartTime ?? "24:00";
    if (ta !== tb) return ta.localeCompare(tb);
    const tableA = a.tableNumber ?? "999";
    const tableB = b.tableNumber ?? "999";
    return tableA.localeCompare(tableB, "ja", { numeric: true });
  });
}
