import type { Customer, CustomerRank, FollowUpRecord } from "../types";

const LINE_MEMOS = [
  "シャンパン好き。次は限定ボトルを提案",
  "同伴。記念日の前後は丁寧に",
  "VIP同伴。次回は席の指定あり",
  "指名常連。ゴルフの話が盛り上がった",
  "初指名。落ち着いた接客が好き",
  "場内2回目。新規感あり",
  "週末来店が多い",
  "ボトルキープ確認済み",
  "可愛い系キャスト希望",
  "近況メッセージから再アプローチ",
  "誕生日前後は特別対応",
  "LINE返信が早い。短文が好み",
];

const NICKNAMES = [
  "りくくん",
  "さっちゃん",
  "みっちゃん",
  "たくや",
  "あいちゃん",
  "ひろくん",
  "ななちゃん",
  "しょうくん",
  "まいちゃん",
  "だいくん",
  "えりちゃん",
  "こうくん",
  "ゆいちゃん",
  "けんた",
  "ももちゃん",
];

const FULL_NAMES = [
  "佐藤陸",
  "鈴木咲",
  "高橋拓也",
  "田中愛",
  "伊藤浩",
  "渡辺奈々",
  "山本翔",
  "中村舞",
  "小林大輔",
  "加藤結衣",
  "吉田健",
  "松本凛",
  "井上優",
  "木村蓮",
  "林美咲",
];

function addDays(isoDate: string, delta: number): string {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function findVisitDateOnWeekday(referenceDate: string, weekday: number, daysAgoStart: number): string {
  for (let offset = daysAgoStart; offset <= daysAgoStart + 13; offset += 1) {
    const candidate = addDays(referenceDate, -offset);
    if (new Date(`${candidate}T00:00:00`).getDay() === weekday) return candidate;
  }
  return addDays(referenceDate, -daysAgoStart);
}

/** LINE友達から探す — 大量のデモ用シード（cast-a） */
export function buildDiscoverSeed(
  castId: string,
  referenceDate: string,
): { customers: Customer[]; followUpRecords: FollowUpRecord[] } {
  const refWeekday = new Date(`${referenceDate}T00:00:00`).getDay();
  const refMonth = Number(referenceDate.split("-")[1]);
  const nextMonth = refMonth === 12 ? 1 : refMonth + 1;
  const customers: Customer[] = [];
  const followUpRecords: FollowUpRecord[] = [];
  const count = 60;

  for (let i = 0; i < count; i++) {
    const id = `cust-disc-${String(i + 1).padStart(3, "0")}`;
    const nickname = NICKNAMES[i % NICKNAMES.length];
    const fullName = FULL_NAMES[i % FULL_NAMES.length];
    const lineSuffix = i % 3 === 0 ? "🍾" : i % 3 === 1 ? "🌸" : "";

    const daysSinceSent = (() => {
      const bucket = i % 10;
      if (bucket <= 2) return bucket;
      if (bucket <= 5) return 3 + (bucket - 3);
      return 8 + (bucket - 6) * 3 + (i % 3);
    })();

    const thankYouSentAt = addDays(referenceDate, -daysSinceSent);
    const visitWeekdayTarget =
      i % 5 === 0 ? refWeekday : i % 7;
    const secondaryWeekday = (visitWeekdayTarget + 2) % 7;
    const tertiaryWeekday = (visitWeekdayTarget + 5) % 7;
    const visitDate = findVisitDateOnWeekday(
      referenceDate,
      visitWeekdayTarget,
      Math.max(daysSinceSent, 1) + (i % 4),
    );

    const isHighSpender = i % 4 === 0;
    const isMidSpender = i % 3 === 0;

    const weeklyVisits = [0, 0, 0, 0, 0, 0, 0];
    weeklyVisits[visitWeekdayTarget] = 2 + (i % 4);
    weeklyVisits[secondaryWeekday] = 1 + (i % 3);
    if (i % 2 === 0) weeklyVisits[tertiaryWeekday] = 1;
    if (isHighSpender) weeklyVisits[(visitWeekdayTarget + 6) % 7] = 2;
    const visitCount = isHighSpender ? 18 + (i % 12) : isMidSpender ? 6 + (i % 8) : 2 + (i % 5);
    const totalSpending = isHighSpender
      ? 520_000 + (i % 8) * 40_000
      : isMidSpender
        ? 120_000 + (i % 6) * 25_000
        : 35_000 + (i % 7) * 8_000;
    const averageSpending =
      visitCount > 0 ? Math.round(totalSpending / visitCount) : undefined;

    const rank: CustomerRank | undefined =
      isHighSpender && i % 2 === 0
        ? "platinum"
        : isHighSpender
          ? "diamond"
          : isMidSpender
            ? "gold"
            : i % 5 === 0
              ? "silver"
              : undefined;

    const nominationCount = isHighSpender ? 4 + (i % 6) : isMidSpender ? 1 + (i % 3) : i % 2;
    const accompanyCount = isHighSpender ? 2 + (i % 4) : i % 4 === 0 ? 1 : 0;

    const birthdayTimingBucket = i % 12;
    let birthdayMonth = ((i % 12) + 1);
    let birthdayDay = (i % 27) + 1;
    if (birthdayTimingBucket === 0) {
      const today = new Date(`${referenceDate}T00:00:00`);
      birthdayMonth = today.getMonth() + 1;
      birthdayDay = today.getDate();
    } else if (birthdayTimingBucket === 1) {
      const eve = addDays(referenceDate, 1);
      const d = new Date(`${eve}T00:00:00`);
      birthdayMonth = d.getMonth() + 1;
      birthdayDay = d.getDate();
    } else if (birthdayTimingBucket === 2) {
      const inWeek = addDays(referenceDate, 3 + (i % 4));
      const d = new Date(`${inWeek}T00:00:00`);
      birthdayMonth = d.getMonth() + 1;
      birthdayDay = d.getDate();
    } else if (birthdayTimingBucket === 3) {
      const inMonth = addDays(referenceDate, 14 + (i % 10));
      const d = new Date(`${inMonth}T00:00:00`);
      birthdayMonth = d.getMonth() + 1;
      birthdayDay = d.getDate();
    } else if (i % 9 === 0) {
      birthdayMonth = refMonth;
    } else if (i % 9 === 1) {
      birthdayMonth = nextMonth;
    }

    customers.push({
      id,
      displayName: `${nickname}様`,
      fullName: `${fullName}${i > 14 ? String(i) : ""}`,
      nickname,
      rank,
      dateOfBirth: { year: 1985 + (i % 15), month: birthdayMonth, day: birthdayDay },
      prefecture: i % 2 === 0 ? "東京都" : "神奈川県",
      occupation: isHighSpender ? "executive" : "employee",
      castPreferences: isHighSpender ? ["beautiful", "drinks"] : ["cute", "clean_image"],
      hobbySpending: isHighSpender ? "over_1m" : isMidSpender ? "300k_1m" : "under_300k",
      visitCount,
      totalSpending,
      averageSpending,
      nominationCount,
      accompanyCount,
      weeklyVisits,
      lineUrl: `https://line.me/R/ti/p/@mock-disc-${i + 1}`,
      visitHistory: (() => {
        const latestType = nominationCount > 0 ? "nomination" : "in-store";
        const inStoreDaysAgo = 3 + (i % 28);
        const inStoreDate = addDays(referenceDate, -inStoreDaysAgo);
        const history = [
          {
            id: `vh-${id}`,
            date: visitDate,
            type: latestType as "nomination" | "in-store",
            partySize: 1 + (i % 3),
            subtotal: Math.min(averageSpending ?? 20_000, 80_000),
          },
        ];
        if (i % 3 !== 0) {
          history.push({
            id: `vh-${id}-instore`,
            date: inStoreDate,
            type: "in-store" as const,
            partySize: 1 + (i % 2),
            subtotal: Math.min((averageSpending ?? 20_000) * 0.7, 60_000),
          });
        }
        return history.sort((a, b) => b.date.localeCompare(a.date));
      })(),
    });

    followUpRecords.push({
      id: `fu-disc-${String(i + 1).padStart(3, "0")}`,
      customerId: id,
      castId,
      visitDate,
      thankYouSentAt,
      lineName: `${nickname}${lineSuffix}`,
      lastMemo: LINE_MEMOS[i % LINE_MEMOS.length],
    });
  }

  return { customers, followUpRecords };
}
