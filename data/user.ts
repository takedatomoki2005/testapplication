export type MockUser = {
  name: string;
  attribute: string;
  lifestyle: string;
  concern: string;
  interests: string[];
  detourMinutesLimit: number;
  budgetYenLimit: number;
};

export const mockUser: MockUser = {
  name: "桐谷 春",
  attribute: "大学2年生",
  lifestyle: "平日は大学に通っている",
  concern: "毎日同じ道で、帰り道が少し退屈",
  interests: ["写真", "カフェ", "小さな展示", "地域イベント"],
  detourMinutesLimit: 30,
  budgetYenLimit: 1000
};
