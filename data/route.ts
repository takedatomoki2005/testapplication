export type Station = {
  id: string;
  name: string;
};

export const stations: Station[] = [
  { id: "umibe-oka", name: "海辺丘駅" },
  { id: "shirahashi", name: "白橋駅" },
  { id: "sannomori", name: "三ノ杜駅" },
  { id: "aonomachi", name: "青ノ町駅" },
  { id: "hokuto-daigakumae", name: "北灯大学前駅" }
];

export const route = {
  origin: stations[0],
  destination: stations[stations.length - 1],
  intermediate: stations.slice(1, -1),
  travelMinutes: 27,
  usualWindow: "平日 17:30〜19:30",
  normalArrivalTime: "18:34",
  demoContext: "火曜日 18:05、授業後の帰り道"
};
