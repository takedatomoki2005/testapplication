export type MockEvent = {
  id: string;
  stationId: string;
  stationName: string;
  name: string;
  venue: string;
  walkMinutes: number;
  opensAt: string;
  closesAt: string;
  costLabel: string;
  costMaxYen: number;
  extraMinutes: number;
  genre: string;
  interests: string[];
  arrivalIfDetour: string;
};

export const mockEvents: MockEvent[] = [
  {
    id: "shirahashi-photo",
    stationId: "shirahashi",
    stationName: "白橋駅",
    name: "夕暮れ写真展",
    venue: "白橋ギャラリールーム",
    walkMinutes: 4,
    opensAt: "16:00",
    closesAt: "20:00",
    costLabel: "無料",
    costMaxYen: 0,
    extraMinutes: 17,
    genre: "写真・展示",
    interests: ["写真", "展示"],
    arrivalIfDetour: "18:51"
  },
  {
    id: "sannomori-sweets",
    stationId: "sannomori",
    stationName: "三ノ杜駅",
    name: "夜の焼き菓子市",
    venue: "三ノ杜広場",
    walkMinutes: 6,
    opensAt: "17:00",
    closesAt: "21:00",
    costLabel: "500〜900円",
    costMaxYen: 900,
    extraMinutes: 22,
    genre: "フード・地域イベント",
    interests: ["地域イベント", "カフェ"],
    arrivalIfDetour: "18:56"
  },
  {
    id: "aonomachi-book",
    stationId: "aonomachi",
    stationName: "青ノ町駅",
    name: "本とコーヒーの小さな読書会",
    venue: "青ノ町ブックラウンジ",
    walkMinutes: 8,
    opensAt: "19:30",
    closesAt: "21:00",
    costLabel: "1,200円",
    costMaxYen: 1200,
    extraMinutes: 38,
    genre: "本・カフェ",
    interests: ["カフェ"],
    arrivalIfDetour: "19:12"
  }
];
