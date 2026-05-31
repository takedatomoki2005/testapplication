import type { ThankYouEntry } from "@/data/types";
import { formatListCustomerName } from "./customerDisplay";

/** 一覧用 — お名前の直後に卓番（例: 田中 様 卓7） */
export function formatMemoEntryHeading(entry: ThankYouEntry): string {
  const { primary } = formatListCustomerName(entry.customer);
  if (!entry.tableNumber) return primary;
  return `${primary} 卓${entry.tableNumber}`;
}
