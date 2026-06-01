import type { ExpectationRank } from "@/lib/expectationRank";

export type UserRole = "cast";
export type SendStatus = "unsent" | "sent" | "no_line_exchange" | "no_contact";
export type HotReasonType = "spending" | "visits" | "nominations";
export type CustomerRank = "diamond" | "platinum" | "gold" | "silver";
export type VisitType = "nomination" | "accompany" | "in-store";
export type StatsPeriod = "year" | "all";

export type { Occupation, CastPreference, HobbySpendingTier, DateOfBirth } from "./customerProfileOptions";
import type { Occupation, CastPreference, HobbySpendingTier, DateOfBirth } from "./customerProfileOptions";

export interface Cast {
  id: string;
  name: string;
}

export interface VisitRecord {
  id: string;
  date: string;
  type: VisitType;
  partySize: number;
  subtotal: number;
}

export interface ContactSchedule {
  id: string;
  kind: "contact" | "anniversary";
  label: string;
  date: string;
}

export interface Customer {
  id: string;
  displayName: string;
  /**
   * false = 会員登録なし（名前・累計使用金額・メモのみの台帳データ）
   * 未指定時は通常の会員プロフィールありとみなす
   */
  profileRegistered?: boolean;
  visitCount: number;
  totalSpending: number;
  nominationCount: number;
  lineUrl?: string;
  rank?: CustomerRank;
  fullName?: string;
  nickname?: string;
  titleTag?: string;
  age?: number;
  /** @deprecated Use dateOfBirth */
  birthday?: string;
  /** 生年月日 — 表示例: 2024年 12月 31日 */
  dateOfBirth?: DateOfBirth;
  /** お住まいの地域（都道府県） */
  prefecture?: string;
  /** ご職業 */
  occupation?: Occupation;
  /** キャストのお好み（複数選択） */
  castPreferences?: CastPreference[];
  /** 毎月趣味に使う金額 */
  hobbySpending?: HobbySpendingTier;
  firstNominationDate?: string;
  averageSpending?: number;
  accompanyCount?: number;
  weeklyVisits?: number[];
  notes?: string;
  visitHistory?: VisitRecord[];
  schedules?: ContactSchedule[];
}

export interface ServiceRecord {
  id: string;
  customerId: string;
  castId: string;
  visitDate: string;
  tableNumber?: string;
  /** 接客開始（例: 21:30） */
  serviceStartTime?: string;
  /** 接客終了（例: 23:15） */
  serviceEndTime?: string;
  /** 卓写真（URL または data URL） */
  tablePhotoUrl?: string;
}

export interface EntryNotes {
  lineName?: string;
  memo?: string;
  tablePhotoUrl?: string;
}

export interface SendStatusRecord extends EntryNotes {
  status: SendStatus;
  markedAt?: string;
  markedByCastId?: string;
}

export interface HotCriteria {
  minTotalSpending: number;
  minVisitCount: number;
  minNominationCount: number;
}

export interface HotEvaluation {
  isHot: boolean;
  reasons: HotReasonType[];
}

export interface ThankYouEntry extends EntryNotes {
  id: string;
  /** 接客レコードID（卓ごとに一意） */
  serviceRecordId: string;
  customer: Customer;
  castId: string;
  visitDate: string;
  tableNumber?: string;
  serviceStartTime?: string;
  serviceEndTime?: string;
  hot: HotEvaluation;
  sendStatus: SendStatus;
  markedAt?: string;
  markedByCastId?: string;
}

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
  castId?: string;
}

export interface AppConfig {
  businessDate: string;
}

export type ShiftMemoStatus = "pending" | "done";

export type { ExpectationRank };

export interface ShiftMemo {
  serviceRecordId: string;
  castId: string;
  businessDate: string;
  body: string;
  /** 再来店・リターンなどへの感覚期待（任意） */
  expectationRank?: ExpectationRank;
  status: ShiftMemoStatus;
  createdAt: string;
  completedAt?: string;
}

export interface AppData {
  config: AppConfig;
  casts: Cast[];
  customers: Customer[];
  serviceRecords: ServiceRecord[];
  sendStatuses: Record<string, SendStatusRecord>;
  hotCriteria: HotCriteria;
  session: SessionUser;
  shiftMemos: ShiftMemo[];
  followUpRecords: FollowUpRecord[];
}

/** お礼送信済み — フォローアップ探索用 */
export interface FollowUpRecord {
  id: string;
  customerId: string;
  castId: string;
  visitDate: string;
  thankYouSentAt: string;
  lineName?: string;
  lastMemo?: string;
}

export type FollowUpPriority = "urgent" | "high" | "normal" | "low";

export type FollowUpFilter = "all" | "needs_follow" | "high_priority" | "window_3_7";

/** LINE友達から探すページ — 詳細フィルター */
export interface DiscoverAdvancedFilters {
  /** 接客から最短 ○ 日前 */
  daysSinceVisitMin?: number;
  /** 接客から最長 ○ 日前 */
  daysSinceVisitMax?: number;
  /** 累計金額（円）下限 */
  totalSpendingMin?: number;
  /** 累計金額（円）上限 */
  totalSpendingMax?: number;
  /** 平均利用金額（円）下限 */
  avgSpendingMin?: number;
  /** 平均利用金額（円）上限 */
  avgSpendingMax?: number;
  /** 接客曜日（0=日 … 6=土）— 空なら全曜日 */
  weekdays: number[];
  /** 誕生月（1–12）— 未指定なら全月 */
  birthdayMonth?: number;
  /** 誕生日（1–31）— 未指定なら全日 */
  birthdayDay?: number;
}

export interface FollowUpRecordOverride {
  lastMemo?: string;
  lineName?: string;
  /** おすすめフォローアップを送信済みにした日時 */
  followUpSentAt?: string;
}

export interface FollowUpContact {
  id: string;
  customer: Customer;
  castId: string;
  visitDate: string;
  thankYouSentAt: string;
  daysSinceSent: number;
  daysSinceVisit: number;
  visitWeekday: number;
  lineName?: string;
  lastMemo?: string;
  priority: FollowUpPriority;
  priorityScore: number;
  priorityReasons: string[];
  suggestedAction: string;
}
