import type { AppData } from "./types";
import { config } from "./mock/config";
import { casts } from "./mock/casts";
import { customers } from "./mock/customers";
import { serviceRecords } from "./mock/serviceRecords";
import { sendStatuses } from "./mock/sendStatuses";
import { hotCriteria } from "./mock/hotCriteria";
import { session } from "./mock/session";
import { shiftMemos } from "./mock/shiftMemos";

export const initialAppData: AppData = {
  config,
  casts,
  customers,
  serviceRecords,
  sendStatuses,
  hotCriteria,
  session,
  shiftMemos,
};

export * from "./types";
