import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialAppData,
  type AppData,
  type EntryNotes,
  type HotCriteria,
  type SendStatusRecord,
  type SessionUser,
  type ShiftMemo,
  type ShiftMemoStatus,
  type ThankYouEntry,
  type FollowUpRecordOverride,
} from "@/data";
import {
  entryId,
  getEntriesForCast,
  getMemoEntriesForCast,
} from "@/lib/thankYou";
import {
  filterThankYouEntriesByMode,
  isThankYouCastMode,
  type ThankYouCastMode,
} from "@/lib/thankYouCastMode";

const STORAGE_KEY = "cast-app-thank-you-state-v5";

interface PersistedState {
  sendStatuses: AppData["sendStatuses"];
  hotCriteria: HotCriteria;
  session: SessionUser;
  shiftMemos: ShiftMemo[];
  followUpOverrides: Record<string, FollowUpRecordOverride>;
  thankYouCastMode?: ThankYouCastMode;
}

type LegacyShiftMemo = ShiftMemo & { entryId?: string };

function normalizeShiftMemos(value: unknown): ShiftMemo[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return (value as LegacyShiftMemo[])
    .map((m) => {
      const serviceRecordId = m.serviceRecordId ?? m.entryId;
      if (typeof serviceRecordId !== "string" || typeof m.body !== "string") return null;
      const { entryId: _, ...rest } = m;
      return { ...rest, serviceRecordId } as ShiftMemo;
    })
    .filter((m): m is ShiftMemo => m !== null);
}

function loadPersistedState(): Partial<PersistedState> {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem("cast-app-thank-you-state-v4");
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...parsed,
      shiftMemos: normalizeShiftMemos(parsed.shiftMemos),
      followUpOverrides: parsed.followUpOverrides ?? {},
      thankYouCastMode: isThankYouCastMode(parsed.thankYouCastMode)
        ? parsed.thankYouCastMode
        : "full",
    };
  } catch {
    return {};
  }
}

function savePersistedState(state: PersistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function trimNotes(notes?: EntryNotes): EntryNotes | undefined {
  if (!notes) return undefined;
  const lineName = notes.lineName?.trim();
  const memo = notes.memo?.trim();
  const tablePhotoUrl = notes.tablePhotoUrl;
  if (!lineName && !memo && !tablePhotoUrl) return undefined;
  return {
    ...(lineName ? { lineName } : {}),
    ...(memo ? { memo } : {}),
    ...(tablePhotoUrl ? { tablePhotoUrl } : {}),
  };
}

function buildStatusRecord(
  status: "sent" | "no_line_exchange" | "no_contact",
  castId: string,
  notes?: EntryNotes,
) {
  return {
    status,
    markedAt: new Date().toISOString(),
    markedByCastId: castId,
    ...trimNotes(notes),
  };
}

interface AppContextValue {
  businessDate: string;
  session: SessionUser;
  hotCriteria: HotCriteria;
  thankYouCastMode: ThankYouCastMode;
  setThankYouCastMode: (mode: ThankYouCastMode) => void;
  myEntries: ThankYouEntry[];
  myMemoEntries: ThankYouEntry[];
  myShiftMemos: ShiftMemo[];
  unsentCount: number;
  allSent: boolean;
  hasAnyTarget: boolean;
  pendingMemoCount: number;
  filterEntriesByCastMode: (entries: ThankYouEntry[]) => ThankYouEntry[];
  markSent: (entryId: string, notes?: EntryNotes) => void;
  markNoLineExchange: (entryId: string, notes?: EntryNotes) => void;
  markNoContact: (entryId: string, notes?: EntryNotes) => void;
  undoSent: (entryId: string) => void;
  getEntryById: (entryId: string) => ThankYouEntry | undefined;
  getEntriesForVisitDate: (visitDate: string) => ThankYouEntry[];
  upsertShiftMemo: (serviceRecordId: string, payload: ShiftMemoEntryPayload) => void;
  completeShiftMemo: (serviceRecordId: string, payload: ShiftMemoEntryPayload) => void;
  reopenShiftMemo: (serviceRecordId: string) => void;
  followUpOverrides: Record<string, FollowUpRecordOverride>;
  updateFollowUpMemo: (recordId: string, payload: FollowUpRecordOverride) => void;
  markDiscoverFollowUpSent: (recordId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export type ShiftMemoEntryPayload = {
  body: string;
  lineName: string;
  expectationRank?: ShiftMemo["expectationRank"];
};

function resolveThankYouEntryId(serviceRecordId: string): string | null {
  const record = initialAppData.serviceRecords.find((r) => r.id === serviceRecordId);
  if (!record) return null;
  return entryId(record.customerId, record.castId, record.visitDate);
}

function normalizeSession(session: SessionUser | undefined): SessionUser {
  if (session?.role === "cast" && session.castId === "cast-a") {
    return session;
  }
  return initialAppData.session;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersistedState();
  const [sendStatuses, setSendStatuses] = useState({
    ...initialAppData.sendStatuses,
    ...persisted.sendStatuses,
  });
  const [hotCriteria] = useState({
    ...initialAppData.hotCriteria,
    ...persisted.hotCriteria,
  });
  const [session] = useState(() =>
    normalizeSession(persisted.session ?? initialAppData.session),
  );
  const [shiftMemos, setShiftMemos] = useState<ShiftMemo[]>(
    () => persisted.shiftMemos ?? initialAppData.shiftMemos,
  );
  const [followUpOverrides, setFollowUpOverrides] = useState<
    Record<string, FollowUpRecordOverride>
  >(() => persisted.followUpOverrides ?? {});
  const [thankYouCastMode, setThankYouCastModeState] = useState<ThankYouCastMode>(
    () =>
      isThankYouCastMode(persisted.thankYouCastMode) ? persisted.thankYouCastMode : "full",
  );

  const businessDate = initialAppData.config.businessDate;

  const persist = useCallback(
    (next: Partial<PersistedState>) => {
      savePersistedState({
        sendStatuses: next.sendStatuses ?? sendStatuses,
        hotCriteria: next.hotCriteria ?? hotCriteria,
        session: next.session ?? session,
        shiftMemos: next.shiftMemos ?? shiftMemos,
        followUpOverrides: next.followUpOverrides ?? followUpOverrides,
        thankYouCastMode: next.thankYouCastMode ?? thankYouCastMode,
      });
    },
    [sendStatuses, hotCriteria, session, shiftMemos, followUpOverrides, thankYouCastMode],
  );

  const setThankYouCastMode = useCallback(
    (mode: ThankYouCastMode) => {
      setThankYouCastModeState(mode);
      persist({ thankYouCastMode: mode });
    },
    [persist],
  );

  const filterEntriesByCastMode = useCallback(
    (entries: ThankYouEntry[]) => filterThankYouEntriesByMode(entries, thankYouCastMode),
    [thankYouCastMode],
  );

  const castId = session.castId ?? "cast-a";

  const myEntries = useMemo(
    () =>
      getEntriesForCast(
        initialAppData,
        castId,
        businessDate,
        sendStatuses,
        hotCriteria,
      ),
    [castId, businessDate, sendStatuses, hotCriteria],
  );

  const myMemoEntries = useMemo(
    () =>
      getMemoEntriesForCast(
        initialAppData,
        castId,
        businessDate,
        sendStatuses,
        hotCriteria,
      ),
    [castId, businessDate, sendStatuses, hotCriteria],
  );

  const modeEntries = useMemo(
    () => filterThankYouEntriesByMode(myEntries, thankYouCastMode),
    [myEntries, thankYouCastMode],
  );

  const unsentCount = modeEntries.filter((e) => e.sendStatus === "unsent").length;
  const allSent =
    modeEntries.length > 0 &&
    modeEntries.every(
      (e) =>
        e.sendStatus === "sent" ||
        e.sendStatus === "no_line_exchange" ||
        e.sendStatus === "no_contact",
    );
  const hasAnyTarget = modeEntries.length > 0;

  const myShiftMemos = useMemo(() => {
    if (session.role !== "cast" || !session.castId) return [];
    return shiftMemos
      .filter((m) => m.castId === session.castId && m.businessDate === businessDate)
      .sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [shiftMemos, session, businessDate]);

  const pendingMemoCount = useMemo(() => {
    if (session.role !== "cast" || !session.castId) return 0;
    const memoByRecord = new Map(myShiftMemos.map((m) => [m.serviceRecordId, m]));
    return myMemoEntries.filter((e) => memoByRecord.get(e.serviceRecordId)?.status !== "done")
      .length;
  }, [myShiftMemos, myMemoEntries, session]);

  const markSent = useCallback(
    (entryId: string, notes?: EntryNotes) => {
      if (!session.castId) return;
      setSendStatuses((prev) => {
        const next = {
          ...prev,
          [entryId]: buildStatusRecord("sent", session.castId!, notes),
        };
        persist({ sendStatuses: next });
        return next;
      });
    },
    [session.castId, persist],
  );

  const markNoLineExchange = useCallback(
    (entryId: string, notes?: EntryNotes) => {
      if (!session.castId) return;
      setSendStatuses((prev) => {
        const next = {
          ...prev,
          [entryId]: buildStatusRecord("no_line_exchange", session.castId!, notes),
        };
        persist({ sendStatuses: next });
        return next;
      });
    },
    [session.castId, persist],
  );

  const markNoContact = useCallback(
    (entryId: string, notes?: EntryNotes) => {
      if (!session.castId) return;
      setSendStatuses((prev) => {
        const next = {
          ...prev,
          [entryId]: buildStatusRecord("no_contact", session.castId!, notes),
        };
        persist({ sendStatuses: next });
        return next;
      });
    },
    [session.castId, persist],
  );

  const undoSent = useCallback(
    (entryId: string) => {
      setSendStatuses((prev) => {
        const next = { ...prev };
        delete next[entryId];
        persist({ sendStatuses: next });
        return next;
      });
    },
    [persist],
  );

  const patchEntryLineName = useCallback(
    (thankYouEntryId: string, lineName: string) => {
      const trimmed = lineName.trim();
      setSendStatuses((prev) => {
        const existing = prev[thankYouEntryId];
        const nextRecord: SendStatusRecord = {
          status: existing?.status ?? "unsent",
          ...(existing?.markedAt ? { markedAt: existing.markedAt } : {}),
          ...(existing?.markedByCastId
            ? { markedByCastId: existing.markedByCastId }
            : {}),
          ...(existing?.memo ? { memo: existing.memo } : {}),
          ...(existing?.tablePhotoUrl ? { tablePhotoUrl: existing.tablePhotoUrl } : {}),
          ...(trimmed ? { lineName: trimmed } : {}),
        };
        const next = { ...prev, [thankYouEntryId]: nextRecord };
        persist({ sendStatuses: next });
        return next;
      });
    },
    [persist],
  );

  const upsertShiftMemo = useCallback(
    (serviceRecordId: string, payload: ShiftMemoEntryPayload) => {
      if (!session.castId) return;
      const trimmed = payload.body.trim();
      if (!trimmed) return;

      const thankYouEntryId = resolveThankYouEntryId(serviceRecordId);
      if (thankYouEntryId) {
        patchEntryLineName(thankYouEntryId, payload.lineName);
      }

      const now = new Date().toISOString();
      setShiftMemos((prev) => {
        const existing = prev.find((m) => m.serviceRecordId === serviceRecordId);
        const next = existing
          ? prev.map((m) =>
              m.serviceRecordId === serviceRecordId
                ? { ...m, body: trimmed, expectationRank: payload.expectationRank }
                : m,
            )
          : [
              ...prev,
              {
                serviceRecordId,
                castId: session.castId!,
                businessDate,
                body: trimmed,
                expectationRank: payload.expectationRank,
                status: "pending" as ShiftMemoStatus,
                createdAt: now,
              },
            ];
        persist({ shiftMemos: next });
        return next;
      });
    },
    [session.castId, businessDate, persist, patchEntryLineName],
  );

  const completeShiftMemo = useCallback(
    (serviceRecordId: string, payload: ShiftMemoEntryPayload) => {
      if (!session.castId) return;
      const trimmed = payload.body.trim();
      if (!trimmed) return;

      const thankYouEntryId = resolveThankYouEntryId(serviceRecordId);
      if (thankYouEntryId) {
        patchEntryLineName(thankYouEntryId, payload.lineName);
      }

      const now = new Date().toISOString();
      setShiftMemos((prev) => {
        const existing = prev.find((m) => m.serviceRecordId === serviceRecordId);
        const record: ShiftMemo = existing
          ? {
              ...existing,
              body: trimmed,
              expectationRank: payload.expectationRank,
              status: "done",
              completedAt: now,
            }
          : {
              serviceRecordId,
              castId: session.castId!,
              businessDate,
              body: trimmed,
              expectationRank: payload.expectationRank,
              status: "done",
              createdAt: now,
              completedAt: now,
            };
        const next = existing
          ? prev.map((m) => (m.serviceRecordId === serviceRecordId ? record : m))
          : [...prev, record];
        persist({ shiftMemos: next });
        return next;
      });
    },
    [session.castId, businessDate, persist, patchEntryLineName],
  );

  const reopenShiftMemo = useCallback(
    (serviceRecordId: string) => {
      setShiftMemos((prev) => {
        const next = prev.map((m) => {
          if (m.serviceRecordId !== serviceRecordId) return m;
          const { completedAt: _, ...rest } = m;
          return { ...rest, status: "pending" as ShiftMemoStatus };
        });
        persist({ shiftMemos: next });
        return next;
      });
    },
    [persist],
  );

  const updateFollowUpMemo = useCallback(
    (recordId: string, payload: FollowUpRecordOverride) => {
      setFollowUpOverrides((prev) => {
        const next = {
          ...prev,
          [recordId]: {
            ...prev[recordId],
            lineName: payload.lineName?.trim(),
            lastMemo: payload.lastMemo?.trim(),
          },
        };
        persist({ followUpOverrides: next });
        return next;
      });
    },
    [persist],
  );

  const markDiscoverFollowUpSent = useCallback(
    (recordId: string) => {
      setFollowUpOverrides((prev) => {
        const next = {
          ...prev,
          [recordId]: {
            ...prev[recordId],
            followUpSentAt: new Date().toISOString(),
          },
        };
        persist({ followUpOverrides: next });
        return next;
      });
    },
    [persist],
  );

  const getEntryById = useCallback(
    (id: string) => myEntries.find((e) => e.id === id),
    [myEntries],
  );

  const getEntriesForVisitDate = useCallback(
    (visitDate: string) =>
      getEntriesForCast(initialAppData, castId, visitDate, sendStatuses, hotCriteria),
    [castId, sendStatuses, hotCriteria],
  );

  return (
    <AppContext.Provider
      value={{
        businessDate,
        session,
        hotCriteria,
        thankYouCastMode,
        setThankYouCastMode,
        myEntries,
        myMemoEntries,
        myShiftMemos,
        unsentCount,
        allSent,
        hasAnyTarget,
        pendingMemoCount,
        filterEntriesByCastMode,
        markSent,
        markNoLineExchange,
        markNoContact,
        undoSent,
        getEntryById,
        getEntriesForVisitDate,
        upsertShiftMemo,
        completeShiftMemo,
        reopenShiftMemo,
        followUpOverrides,
        updateFollowUpMemo,
        markDiscoverFollowUpSent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
