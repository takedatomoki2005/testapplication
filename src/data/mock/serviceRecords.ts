import type { ServiceRecord } from "../types";
import { getDefaultTablePhotoUrl } from "@/lib/tablePhotos";
import { config } from "./config";

const d = config.businessDate;

type Slot = Omit<ServiceRecord, "serviceStartTime" | "serviceEndTime" | "tablePhotoUrl"> & {
  serviceStartTime: string;
  serviceEndTime: string;
};

function slot(
  record: Omit<ServiceRecord, "serviceStartTime" | "serviceEndTime" | "tablePhotoUrl">,
  serviceStartTime: string,
  serviceEndTime: string,
): ServiceRecord {
  const tableSeed = Number(record.tableNumber) || 0;
  return {
    ...record,
    serviceStartTime,
    serviceEndTime,
    tablePhotoUrl: getDefaultTablePhotoUrl(tableSeed),
  };
}

/** cast-a 振り返りデモ — 5卓・本指名以外（場内指名・フリー） */
const castASlots: Slot[] = [
  {
    id: "sr-a-3",
    customerId: "cust-nakamura",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "2",
    serviceStartTime: "19:00",
    serviceEndTime: "19:50",
  },
  {
    id: "sr-a-2",
    customerId: "cust-takahashi",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "1",
    serviceStartTime: "19:55",
    serviceEndTime: "20:45",
  },
  {
    id: "sr-a-7",
    customerId: "cust-sato",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "5",
    serviceStartTime: "20:50",
    serviceEndTime: "21:40",
  },
  {
    id: "sr-a-1",
    customerId: "cust-kato",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "7",
    serviceStartTime: "21:45",
    serviceEndTime: "22:35",
  },
  {
    id: "sr-a-4",
    customerId: "cust-kimura",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "4",
    serviceStartTime: "22:40",
    serviceEndTime: "23:30",
  },
];

export const serviceRecords: ServiceRecord[] = castASlots.map((s) =>
  slot(s, s.serviceStartTime, s.serviceEndTime),
);
