import type { SendStatusRecord } from "../types";
import { entryId } from "@/lib/thankYou";
import { config } from "./config";

const d = config.businessDate;

/** LINE表示名（振り返り・退勤前メモで共通） */
export const sendStatuses: Record<string, SendStatusRecord> = {
  [entryId("cust-nakamura", "cast-a", d)]: {
    status: "unsent",
    lineName: "しゅんくん",
  },
  [entryId("cust-takahashi", "cast-a", d)]: {
    status: "unsent",
    lineName: "マッキー",
  },
  [entryId("cust-sato", "cast-a", d)]: {
    status: "unsent",
    lineName: "けんくん",
  },
  [entryId("cust-kato", "cast-a", d)]: {
    status: "unsent",
    lineName: "かとりん",
  },
  [entryId("cust-kimura", "cast-a", d)]: {
    status: "unsent",
    lineName: "たっくん",
  },
};
