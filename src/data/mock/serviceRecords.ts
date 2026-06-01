import type { ServiceRecord } from "../types";
import { getDefaultTablePhotoUrl } from "@/lib/tablePhotos";
import { offsetBusinessDate } from "@/lib/thankYou";
import { config } from "./config";

const d = config.businessDate;
const d1 = offsetBusinessDate(d, -1);
const d2 = offsetBusinessDate(d, -2);

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

/** cast-a 本日 — 7卓（場内指名・同伴） */
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
    id: "sr-a-5",
    customerId: "cust-inoue",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "3",
    serviceStartTime: "20:50",
    serviceEndTime: "21:40",
  },
  {
    id: "sr-a-6",
    customerId: "cust-kobayashi",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "6",
    serviceStartTime: "21:45",
    serviceEndTime: "22:30",
  },
  {
    id: "sr-a-7",
    customerId: "cust-sato",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "5",
    serviceStartTime: "22:35",
    serviceEndTime: "23:20",
  },
  {
    id: "sr-a-1",
    customerId: "cust-kato",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "7",
    serviceStartTime: "23:25",
    serviceEndTime: "00:10",
  },
  {
    id: "sr-a-4",
    customerId: "cust-kimura",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "4",
    serviceStartTime: "00:15",
    serviceEndTime: "01:05",
  },
];

/** cast-a 前日 — 8卓 */
const castAD1Slots: Slot[] = [
  {
    id: "sr-a-d1-1",
    customerId: "cust-inoue",
    castId: "cast-a",
    visitDate: d1,
    tableNumber: "3",
    serviceStartTime: "19:00",
    serviceEndTime: "19:50",
  },
  {
    id: "sr-a-d1-2",
    customerId: "cust-kobayashi",
    castId: "cast-a",
    visitDate: d1,
    tableNumber: "6",
    serviceStartTime: "19:55",
    serviceEndTime: "20:40",
  },
  {
    id: "sr-a-d1-3",
    customerId: "cust-sato",
    castId: "cast-a",
    visitDate: d1,
    tableNumber: "5",
    serviceStartTime: "20:45",
    serviceEndTime: "21:30",
  },
  {
    id: "sr-a-d1-4",
    customerId: "cust-nakamura",
    castId: "cast-a",
    visitDate: d1,
    tableNumber: "2",
    serviceStartTime: "21:35",
    serviceEndTime: "22:20",
  },
  {
    id: "sr-a-d1-5",
    customerId: "cust-takahashi",
    castId: "cast-a",
    visitDate: d1,
    tableNumber: "1",
    serviceStartTime: "22:25",
    serviceEndTime: "23:10",
  },
  {
    id: "sr-a-d1-6",
    customerId: "cust-kato",
    castId: "cast-a",
    visitDate: d1,
    tableNumber: "7",
    serviceStartTime: "23:15",
    serviceEndTime: "00:00",
  },
  {
    id: "sr-a-d1-7",
    customerId: "cust-yoshida",
    castId: "cast-a",
    visitDate: d1,
    tableNumber: "8",
    serviceStartTime: "20:00",
    serviceEndTime: "21:00",
  },
  {
    id: "sr-a-d1-8",
    customerId: "cust-yamada",
    castId: "cast-a",
    visitDate: d1,
    tableNumber: "9",
    serviceStartTime: "21:00",
    serviceEndTime: "22:00",
  },
];

/** cast-a 前々日 — 8卓 */
const castAD2Slots: Slot[] = [
  {
    id: "sr-a-d2-1",
    customerId: "cust-nakamura",
    castId: "cast-a",
    visitDate: d2,
    tableNumber: "2",
    serviceStartTime: "19:00",
    serviceEndTime: "19:50",
  },
  {
    id: "sr-a-d2-2",
    customerId: "cust-takahashi",
    castId: "cast-a",
    visitDate: d2,
    tableNumber: "1",
    serviceStartTime: "19:55",
    serviceEndTime: "20:40",
  },
  {
    id: "sr-a-d2-3",
    customerId: "cust-inoue",
    castId: "cast-a",
    visitDate: d2,
    tableNumber: "3",
    serviceStartTime: "20:45",
    serviceEndTime: "21:30",
  },
  {
    id: "sr-a-d2-4",
    customerId: "cust-kobayashi",
    castId: "cast-a",
    visitDate: d2,
    tableNumber: "6",
    serviceStartTime: "21:35",
    serviceEndTime: "22:20",
  },
  {
    id: "sr-a-d2-5",
    customerId: "cust-sato",
    castId: "cast-a",
    visitDate: d2,
    tableNumber: "5",
    serviceStartTime: "22:25",
    serviceEndTime: "23:10",
  },
  {
    id: "sr-a-d2-6",
    customerId: "cust-kato",
    castId: "cast-a",
    visitDate: d2,
    tableNumber: "7",
    serviceStartTime: "23:15",
    serviceEndTime: "00:00",
  },
  {
    id: "sr-a-d2-7",
    customerId: "cust-yoshida",
    castId: "cast-a",
    visitDate: d2,
    tableNumber: "8",
    serviceStartTime: "20:30",
    serviceEndTime: "21:30",
  },
  {
    id: "sr-a-d2-8",
    customerId: "cust-kimura",
    castId: "cast-a",
    visitDate: d2,
    tableNumber: "4",
    serviceStartTime: "21:30",
    serviceEndTime: "22:30",
  },
];

export const serviceRecords: ServiceRecord[] = [...castASlots, ...castAD1Slots, ...castAD2Slots].map(
  (s) => slot(s, s.serviceStartTime, s.serviceEndTime),
);
