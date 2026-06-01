import type { ShiftMemo } from "../types";
import { config } from "./config";

const d = config.businessDate;
const base = "2026-05-31T";

/** 6人が昔（対応済み）、たっくんのみが今（対応中） */
export const shiftMemos: ShiftMemo[] = [
  {
    serviceRecordId: "sr-a-3",
    castId: "cast-a",
    businessDate: d,
    body: "初来店。落ち着いた接客が好み",
    expectationRank: 3,
    status: "done",
    createdAt: `${base}19:50:00.000Z`,
    completedAt: `${base}19:55:00.000Z`,
  },
  {
    serviceRecordId: "sr-a-2",
    castId: "cast-a",
    businessDate: d,
    body: "LINE交換済み。お礼メッセージ送信後、1週間以内にフォローアップ",
    expectationRank: 5,
    status: "done",
    createdAt: `${base}20:45:00.000Z`,
    completedAt: `${base}20:50:00.000Z`,
  },
  {
    serviceRecordId: "sr-a-5",
    castId: "cast-a",
    businessDate: d,
    body: "ドリンク好き。次回は新メニューを提案",
    status: "done",
    createdAt: `${base}21:40:00.000Z`,
    completedAt: `${base}21:45:00.000Z`,
  },
  {
    serviceRecordId: "sr-a-6",
    castId: "cast-a",
    businessDate: d,
    body: "新人キャストに興味あり。紹介を検討",
    status: "done",
    createdAt: `${base}22:30:00.000Z`,
    completedAt: `${base}22:35:00.000Z`,
  },
  {
    serviceRecordId: "sr-a-7",
    castId: "cast-a",
    businessDate: d,
    body: "日本酒が好み。次回は新メニューを提案",
    status: "done",
    createdAt: `${base}23:20:00.000Z`,
    completedAt: `${base}23:25:00.000Z`,
  },
  {
    serviceRecordId: "sr-a-1",
    castId: "cast-a",
    businessDate: d,
    body: "同伴で来店。次回は席の希望を確認",
    status: "done",
    createdAt: `${base}00:10:00.000Z`,
    completedAt: `${base}00:15:00.000Z`,
  },
];
