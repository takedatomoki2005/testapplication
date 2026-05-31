import type { Customer, FollowUpRecord, ServiceRecord } from "@/data/types";
import { formatListCustomerName } from "./customerDisplay";

export interface MonthlyCustomerEntry {
  customerId: string;
  primary: string;
  lastVisitDate: string;
}

export interface MonthlyCustomerSummary {
  month: number;
  count: number;
  entries: MonthlyCustomerEntry[];
}

function monthPrefixFromDate(businessDate: string): string {
  const [year, month] = businessDate.split("-").map(Number);
  return `${year}-${String(month).padStart(2, "0")}`;
}

function addVisit(
  map: Map<string, string>,
  customerId: string,
  visitDate: string,
): void {
  const existing = map.get(customerId);
  if (!existing || visitDate > existing) {
    map.set(customerId, visitDate);
  }
}

export function getMonthlyCustomers(
  castId: string,
  businessDate: string,
  customers: Customer[],
  serviceRecords: ServiceRecord[],
  followUpRecords: FollowUpRecord[],
): MonthlyCustomerSummary {
  const monthPrefix = monthPrefixFromDate(businessDate);
  const month = Number(businessDate.split("-")[1]);
  const visitDates = new Map<string, string>();

  for (const record of serviceRecords) {
    if (record.castId === castId && record.visitDate.startsWith(monthPrefix)) {
      addVisit(visitDates, record.customerId, record.visitDate);
    }
  }

  for (const record of followUpRecords) {
    if (record.castId === castId && record.visitDate.startsWith(monthPrefix)) {
      addVisit(visitDates, record.customerId, record.visitDate);
    }
  }

  const customerMap = new Map(customers.map((c) => [c.id, c]));
  const entries: MonthlyCustomerEntry[] = [...visitDates.entries()]
    .map(([customerId, lastVisitDate]) => {
      const customer = customerMap.get(customerId);
      const { primary } = customer
        ? formatListCustomerName(customer)
        : { primary: "お客様" };
      return { customerId, primary, lastVisitDate };
    })
    .sort((a, b) => b.lastVisitDate.localeCompare(a.lastVisitDate));

  return { month, count: entries.length, entries };
}
