import type { ShiftMemo } from "../types";
import { config } from "./config";

const d = config.businessDate;
const base = "2026-05-31T";

/** 4人が昔（対応済み）、みーちゃんのみが今（対応中） */
export const shiftMemos: ShiftMemo[] = [
  {
    serviceRecordId: "sr-a-3",
    castId: "cast-a",
    businessDate: d,
    body: "同伴予定の日程を黒服に共有済み",
    status: "done",
    createdAt: `${base}19:50:00.000Z`,
    completedAt: `${base}19:55:00.000Z`,
  },
  {
    serviceRecordId: "sr-a-2",
    castId: "cast-a",
    businessDate: d,
    body: "LINE交換済み。お礼メッセージ送信後、1週間以内にフォローアップ",
    status: "done",
    createdAt: `${base}20:45:00.000Z`,
    completedAt: `${base}20:50:00.000Z`,
  },
  {
    serviceRecordId: "sr-a-7",
    castId: "cast-a",
    businessDate: d,
    body: "日本酒が好み。次回は新メニューを提案",
    status: "done",
    createdAt: `${base}21:40:00.000Z`,
    completedAt: `${base}21:45:00.000Z`,
  },
  {
    serviceRecordId: "sr-a-1",
    castId: "cast-a",
    businessDate: d,
    body: "誕生日が来月 — プレゼント候補をリスト化",
    status: "done",
    createdAt: `${base}22:35:00.000Z`,
    completedAt: `${base}22:40:00.000Z`,
  },
];
