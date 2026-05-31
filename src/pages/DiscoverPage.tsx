import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { DiscoverFiltersPanel } from "@/components/DiscoverFiltersPanel";
import { FollowUpCard } from "@/components/FollowUpCard";
import { FollowUpMemoModal } from "@/components/FollowUpMemoModal";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { initialAppData, type DiscoverAdvancedFilters, type FollowUpContact, type FollowUpFilter } from "@/data";
import {
  EMPTY_DISCOVER_FILTERS,
  filterFollowUpContacts,
  getFollowUpContacts,
  mergeFollowUpRecords,
} from "@/lib/followUpDiscover";
import styles from "./DiscoverPage.module.css";

const QUICK_FILTERS: { id: FollowUpFilter; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "needs_follow", label: "要フォロー" },
  { id: "high_priority", label: "優先度高" },
  { id: "window_3_7", label: "3〜7日" },
];

export function DiscoverPage() {
  const { session, businessDate, hotCriteria, followUpOverrides, updateFollowUpMemo } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FollowUpFilter>("needs_follow");
  const [advancedFilters, setAdvancedFilters] = useState<DiscoverAdvancedFilters>({
    ...EMPTY_DISCOVER_FILTERS,
  });
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selectedContact, setSelectedContact] = useState<FollowUpContact | null>(null);

  const castId = session.castId ?? "cast-a";

  const allContacts = useMemo(() => {
    const records = mergeFollowUpRecords(initialAppData.followUpRecords, followUpOverrides);
    return getFollowUpContacts(records, initialAppData.customers, castId, hotCriteria, businessDate);
  }, [castId, hotCriteria, businessDate, followUpOverrides]);

  const contacts = useMemo(
    () => filterFollowUpContacts(allContacts, query, filter, advancedFilters),
    [allContacts, query, filter, advancedFilters],
  );

  const urgentCount = allContacts.filter(
    (c) => c.priority === "urgent" || c.priority === "high",
  ).length;

  const handleSaveMemo = (recordId: string, payload: { lineName: string; lastMemo: string }) => {
    updateFollowUpMemo(recordId, payload);
  };

  if (session.role !== "cast") {
    return (
      <div className="page">
        <p>キャストロールに切り替えてください</p>
        <RoleSwitcher />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>探す</h1>
        <p className={styles.subtitle}>
          接客したお客様を絞り込んで、フォロー先を見つける
          {urgentCount > 0 && (
            <span className={styles.urgentHint}> — 優先 {urgentCount}件</span>
          )}
        </p>
      </header>

      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="名前・LINE名・メモで探す"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="フォロー候補を検索"
        />
      </div>

      <div className={styles.filters} role="tablist" aria-label="クイックフィルター">
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`${styles.filterChip}${filter === f.id ? ` ${styles.filterActive}` : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DiscoverFiltersPanel
        filters={advancedFilters}
        onChange={setAdvancedFilters}
        expanded={filtersExpanded}
        onToggle={() => setFiltersExpanded((v) => !v)}
        businessDate={businessDate}
      />

      <div className={styles.resultBar}>
        <p className={styles.resultCount}>{contacts.length}件</p>
        <p className={styles.resultHint}>カードをタップしてメモ</p>
      </div>

      {contacts.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>該当するお客様はいません</p>
          <p className={styles.emptyHint}>フィルターや検索条件を変えてみてください</p>
        </div>
      ) : (
        <div className={styles.list}>
          {contacts.map((contact) => (
            <FollowUpCard
              key={contact.id}
              contact={contact}
              onSelect={setSelectedContact}
            />
          ))}
        </div>
      )}

      {selectedContact && (
        <FollowUpMemoModal
          contact={
            contacts.find((c) => c.id === selectedContact.id) ??
            allContacts.find((c) => c.id === selectedContact.id) ??
            selectedContact
          }
          onClose={() => setSelectedContact(null)}
          onSave={handleSaveMemo}
        />
      )}

      <RoleSwitcher />
    </div>
  );
}
