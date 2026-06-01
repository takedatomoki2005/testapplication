import type { SendStatusRecord } from "../types";
import { entryId, offsetBusinessDate } from "@/lib/thankYou";
import { config } from "./config";

const d = config.businessDate;
const d1 = offsetBusinessDate(d, -1);
const d2 = offsetBusinessDate(d, -2);

function sent(lineName: string, markedAt: string): SendStatusRecord {
  return { status: "sent", lineName, markedAt, markedByCastId: "cast-a" };
}

function noLine(lineName: string, markedAt: string): SendStatusRecord {
  return { status: "no_line_exchange", lineName, markedAt, markedByCastId: "cast-a" };
}

function noContact(markedAt: string): SendStatusRecord {
  return { status: "no_contact", markedAt, markedByCastId: "cast-a" };
}

/** LINE表示名（振り返り・退勤前メモで共通） */
export const sendStatuses: Record<string, SendStatusRecord> = {
  // 本日（7件 — 未送信）
  [entryId("cust-nakamura", "cast-a", d)]: { status: "unsent", lineName: "しゅんくん" },
  [entryId("cust-takahashi", "cast-a", d)]: { status: "unsent", lineName: "マッキー" },
  [entryId("cust-inoue", "cast-a", d)]: { status: "unsent", lineName: "ゴウさん" },
  [entryId("cust-kobayashi", "cast-a", d)]: { status: "unsent", lineName: "なおちゃん" },
  [entryId("cust-sato", "cast-a", d)]: { status: "unsent", lineName: "けんくん" },
  [entryId("cust-kato", "cast-a", d)]: { status: "unsent", lineName: "かとりん" },
  [entryId("cust-kimura", "cast-a", d)]: { status: "unsent", lineName: "たっくん" },

  // 前日（8件 — 処理済み）
  [entryId("cust-inoue", "cast-a", d1)]: sent("ゴウさん", "2026-05-30T23:30:00.000Z"),
  [entryId("cust-kobayashi", "cast-a", d1)]: sent("なおちゃん", "2026-05-30T23:35:00.000Z"),
  [entryId("cust-sato", "cast-a", d1)]: sent("けんくん", "2026-05-30T23:40:00.000Z"),
  [entryId("cust-nakamura", "cast-a", d1)]: sent("しゅんくん", "2026-05-30T23:45:00.000Z"),
  [entryId("cust-takahashi", "cast-a", d1)]: sent("マッキー", "2026-05-30T23:50:00.000Z"),
  [entryId("cust-kato", "cast-a", d1)]: noLine("かとりん", "2026-05-30T23:52:00.000Z"),
  [entryId("cust-yoshida", "cast-a", d1)]: noLine("ヨッシー", "2026-05-30T23:55:00.000Z"),
  [entryId("cust-yamada", "cast-a", d1)]: sent("やまちゃん", "2026-05-30T23:58:00.000Z"),

  // 前々日（8件 — 処理済み）
  [entryId("cust-nakamura", "cast-a", d2)]: sent("しゅんくん", "2026-05-29T23:30:00.000Z"),
  [entryId("cust-takahashi", "cast-a", d2)]: sent("マッキー", "2026-05-29T23:35:00.000Z"),
  [entryId("cust-inoue", "cast-a", d2)]: sent("ゴウさん", "2026-05-29T23:40:00.000Z"),
  [entryId("cust-kobayashi", "cast-a", d2)]: sent("なおちゃん", "2026-05-29T23:42:00.000Z"),
  [entryId("cust-sato", "cast-a", d2)]: noContact("2026-05-29T23:45:00.000Z"),
  [entryId("cust-kato", "cast-a", d2)]: sent("かとりん", "2026-05-29T23:48:00.000Z"),
  [entryId("cust-yoshida", "cast-a", d2)]: sent("ヨッシー", "2026-05-29T23:50:00.000Z"),
  [entryId("cust-kimura", "cast-a", d2)]: sent("たっくん", "2026-05-29T23:55:00.000Z"),
};
