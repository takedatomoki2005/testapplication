import type { SendStatusRecord } from "../types";
import { entryId } from "@/lib/thankYou";
import { config } from "./config";

const d = config.businessDate;

/** LINE表示名（振り返り・退勤前メモで共通） */
export const sendStatuses: Record<string, SendStatusRecord> = {
  [entryId("cust-matsumoto", "cast-a", d)]: {
    status: "unsent",
    lineName: "まつもと🍾",
  },
  [entryId("cust-watanabe", "cast-a", d)]: {
    status: "unsent",
    lineName: "わたべ",
  },
  [entryId("cust-sato", "cast-a", d)]: {
    status: "unsent",
    lineName: "さとう",
  },
  [entryId("cust-tanaka", "cast-a", d)]: {
    status: "unsent",
    lineName: "たなか🌸",
  },
  [entryId("cust-itou", "cast-a", d)]: {
    status: "unsent",
    lineName: "いとう",
  },
};
