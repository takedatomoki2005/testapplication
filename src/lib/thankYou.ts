import type {
  AppData,
  CastSendSummary,
  Customer,
  HotCriteria,
  SendStatusRecord,
  ServiceRecord,
  ThankYouEntry,
} from "@/data/types";
import { evaluateHotCustomer } from "./hotCustomer";
import { customerSortKey, rankSortKey } from "./customerDisplay";
import { visitCategorySortKey } from "./visitCategory";
import { sortEntriesByServiceTime } from "./entryOrder";

export function entryId(customerId: string, castId: string, visitDate: string): string {
  return `${customerId}__${castId}__${visitDate}`;
}

export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

export function formatAmountYen(amount: number): string {
  return `${amount.toLocaleString()} 円`;
}

export function formatBusinessDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

function getCustomer(customers: Customer[], customerId: string): Customer | undefined {
  return customers.find((c) => c.id === customerId);
}

export function buildThankYouEntry(
  record: ServiceRecord,
  customer: Customer,
  criteria: HotCriteria,
  sendStatuses: Record<string, SendStatusRecord>,
): ThankYouEntry {
  const id = entryId(record.customerId, record.castId, record.visitDate);
  const statusRecord = sendStatuses[id];
  return {
    id,
    serviceRecordId: record.id,
    customer,
    castId: record.castId,
    visitDate: record.visitDate,
    tableNumber: record.tableNumber,
    serviceStartTime: record.serviceStartTime,
    serviceEndTime: record.serviceEndTime,
    tablePhotoUrl: statusRecord?.tablePhotoUrl ?? record.tablePhotoUrl,
    hot: evaluateHotCustomer(customer, criteria),
    sendStatus: statusRecord?.status ?? "unsent",
    markedAt: statusRecord?.markedAt,
    markedByCastId: statusRecord?.markedByCastId,
    lineName: statusRecord?.lineName,
    memo: statusRecord?.memo,
  };
}

/** 退勤前メモ用 — 卓ごとの全接客を接客順で返す（振り返りの並び順とは別） */
export function getMemoEntriesForCast(
  data: AppData,
  castId: string,
  visitDate: string,
  sendStatuses: Record<string, SendStatusRecord>,
  criteria: HotCriteria,
): ThankYouEntry[] {
  const entries = data.serviceRecords
    .filter((r) => r.castId === castId && r.visitDate === visitDate)
    .map((record) => {
      const customer = getCustomer(data.customers, record.customerId);
      if (!customer) return null;
      return buildThankYouEntry(record, customer, criteria, sendStatuses);
    })
    .filter((e): e is ThankYouEntry => e !== null);

  return sortEntriesByServiceTime(entries);
}

export function getEntriesForCast(
  data: AppData,
  castId: string,
  visitDate: string,
  sendStatuses: Record<string, SendStatusRecord>,
  criteria: HotCriteria,
): ThankYouEntry[] {
  return sortThankYouEntries(
    data.serviceRecords
      .filter((r) => r.castId === castId && r.visitDate === visitDate)
      .map((record) => {
        const customer = getCustomer(data.customers, record.customerId);
        if (!customer) return null;
        return buildThankYouEntry(record, customer, criteria, sendStatuses);
      })
      .filter((e): e is ThankYouEntry => e !== null),
  );
}

export function sortThankYouEntries(entries: ThankYouEntry[]): ThankYouEntry[] {
  const sendPriority = (entry: ThankYouEntry): number => {
    if (entry.sendStatus === "unsent" && entry.hot.isHot) return 0;
    if (entry.sendStatus === "unsent") return 1;
    return 2;
  };
  return [...entries].sort((a, b) => {
    const catDiff = visitCategorySortKey(a) - visitCategorySortKey(b);
    if (catDiff !== 0) return catDiff;
    const rankDiff = rankSortKey(a.customer, a.hot) - rankSortKey(b.customer, b.hot);
    if (rankDiff !== 0) return rankDiff;
    const diff = sendPriority(a) - sendPriority(b);
    if (diff !== 0) return diff;
    return customerSortKey(a.customer).localeCompare(customerSortKey(b.customer), "ja");
  });
}

export function getCastSummaries(
  data: AppData,
  visitDate: string,
  sendStatuses: Record<string, SendStatusRecord>,
  criteria: HotCriteria,
): CastSendSummary[] {
  return data.casts.map((cast) => {
    const entries = getEntriesForCast(data, cast.id, visitDate, sendStatuses, criteria);
    const sentCount = entries.filter((e) => e.sendStatus === "sent").length;
    const unsentEntries = entries.filter((e) => e.sendStatus === "unsent");
    const totalCount = entries.length;
    return {
      cast,
      totalCount,
      hotCount: entries.filter((e) => e.hot.isHot).length,
      sentCount,
      unsentCount: unsentEntries.length,
      sendRate: totalCount === 0 ? 0 : Math.round((sentCount / totalCount) * 100),
      unsentEntries,
    };
  });
}
