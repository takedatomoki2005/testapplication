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

/** cast-a 振り返りデモ — 5卓・接客時間は重ならない */
const castASlots: Slot[] = [
  {
    id: "sr-a-3",
    customerId: "cust-matsumoto",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "2",
    serviceStartTime: "19:00",
    serviceEndTime: "19:50",
  },
  {
    id: "sr-a-2",
    customerId: "cust-watanabe",
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
    customerId: "cust-tanaka",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "7",
    serviceStartTime: "21:45",
    serviceEndTime: "22:35",
  },
  {
    id: "sr-a-4",
    customerId: "cust-itou",
    castId: "cast-a",
    visitDate: d,
    tableNumber: "4",
    serviceStartTime: "22:40",
    serviceEndTime: "23:30",
  },
];

const castBSlots: Slot[] = [
  {
    id: "sr-b-1",
    customerId: "cust-yamada",
    castId: "cast-b",
    visitDate: d,
    tableNumber: "12",
    serviceStartTime: "19:00",
    serviceEndTime: "19:55",
  },
  {
    id: "sr-b-3",
    customerId: "cust-watanabe",
    castId: "cast-b",
    visitDate: d,
    tableNumber: "1",
    serviceStartTime: "20:55",
    serviceEndTime: "21:45",
  },
  {
    id: "sr-b-4",
    customerId: "cust-sato",
    castId: "cast-b",
    visitDate: d,
    tableNumber: "5",
    serviceStartTime: "21:50",
    serviceEndTime: "22:40",
  },
];

export const serviceRecords: ServiceRecord[] = [
  ...castASlots.map((s) => slot(s, s.serviceStartTime, s.serviceEndTime)),
  ...castBSlots.map((s) => slot(s, s.serviceStartTime, s.serviceEndTime)),
];
