import type { FollowUpRecord } from "../types";
import { config } from "./config";
import { buildDiscoverSeed } from "./discoverSeed";

const discoverSeed = buildDiscoverSeed("cast-a", config.businessDate);

/** cast-a 向け — お礼送信後のフォローアップ候補（営業日基準） */
const coreFollowUpRecords: FollowUpRecord[] = [
  {
    id: "fu-1",
    customerId: "cust-watanabe",
    castId: "cast-a",
    visitDate: "2026-05-24",
    thankYouSentAt: "2026-05-24",
    lineName: "わたべ",
    lastMemo: "シャンパン好き。次は限定ボトルを提案",
  },
  {
    id: "fu-2",
    customerId: "cust-yamada",
    castId: "cast-a",
    visitDate: "2026-05-17",
    thankYouSentAt: "2026-05-18",
    lineName: "やまちゃん",
    lastMemo: "同伴。記念日の前後は丁寧に",
  },
  {
    id: "fu-4",
    customerId: "cust-fujita",
    castId: "cast-a",
    visitDate: "2026-05-03",
    thankYouSentAt: "2026-05-04",
    lineName: "リョウちゃん",
    lastMemo: "指名5回目。ゴルフの話が盛り上がった",
  },
  {
    id: "fu-5",
    customerId: "cust-matsumoto",
    castId: "cast-a",
    visitDate: "2026-05-28",
    thankYouSentAt: "2026-05-28",
    lineName: "あやちゃん🍾",
    lastMemo: "同伴4回目。モデル系が好み",
  },
  {
    id: "fu-6",
    customerId: "cust-tanaka",
    castId: "cast-a",
    visitDate: "2026-05-29",
    thankYouSentAt: "2026-05-29",
    lineName: "ゆうこ🌸",
    lastMemo: "初指名。医療系。落ち着いた接客が好き",
  },
  {
    id: "fu-7",
    customerId: "cust-yoshida",
    castId: "cast-a",
    visitDate: "2026-05-14",
    thankYouSentAt: "2026-05-15",
    lineName: "ヨッシー",
    lastMemo: "同伴常連。ボトルキープ確認済み",
  },
  {
    id: "fu-8",
    customerId: "cust-itou",
    castId: "cast-a",
    visitDate: "2026-05-21",
    thankYouSentAt: "2026-05-22",
    lineName: "みーちゃん",
    lastMemo: "指名3回。可愛い系キャスト希望",
  },
  {
    id: "fu-9",
    customerId: "cust-kato",
    castId: "cast-a",
    visitDate: "2026-05-07",
    thankYouSentAt: "2026-05-08",
    lineName: "かとりん",
    lastMemo: "同伴2回。週末来店が多い",
  },
  {
    id: "fu-10",
    customerId: "cust-sato",
    castId: "cast-a",
    visitDate: "2026-05-26",
    thankYouSentAt: "2026-05-27",
    lineName: "けんくん",
    lastMemo: "場内2回目。新規感あり",
  },
];

export const followUpRecords: FollowUpRecord[] = [
  ...coreFollowUpRecords,
  ...discoverSeed.followUpRecords,
];
