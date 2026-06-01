import { formatListCustomerName } from "@/lib/customerDisplay";
import { formatMemoEntryHeading } from "@/lib/memoDisplay";
import { formatServiceTimeRange } from "@/lib/serviceDisplay";
import type { EntryMemoRow } from "@/lib/shiftMemo";
import { ExpectationRankStars } from "./ExpectationRankStars";
import styles from "./ShiftMemoFlow.module.css";

type Props = {
  doneRows: EntryMemoRow[];
  currentRows: EntryMemoRow[];
  onSelect: (row: EntryMemoRow) => void;
};

function MemoRow({
  row,
  variant,
  showLine,
  isLatest,
  onSelect,
}: {
  row: EntryMemoRow;
  variant: "done" | "pending";
  showLine: boolean;
  isLatest?: boolean;
  onSelect: (row: EntryMemoRow) => void;
}) {
  const { entry, memo } = row;
  const { alias } = formatListCustomerName(entry.customer);
  const heading = formatMemoEntryHeading(entry);
  const lineName = entry.lineName?.trim();
  const serviceTime = formatServiceTimeRange(
    entry.serviceStartTime,
    entry.serviceEndTime,
  );
  const preview = memo?.body?.trim() || "タップしてお客様メモを残す";

  return (
    <li className={styles.row}>
      <div className={styles.rail} aria-hidden>
        <span className={styles.dot} data-variant={variant} />
        {showLine && <span className={styles.line} data-variant={variant} />}
      </div>

      <button
        type="button"
        className={styles.card}
        data-variant={variant}
        data-latest={isLatest ? "" : undefined}
        data-empty={!memo?.body?.trim() ? "" : undefined}
        onClick={() => onSelect(row)}
      >
        <header className={styles.cardHeader}>
          <div className={styles.nameBlock}>
            <p className={styles.name}>{heading}</p>
            {alias && <p className={styles.alias}>{alias}</p>}
            {lineName && (
              <p className={styles.lineName}>
                <span className={styles.lineLabel}>LINE</span>
                {lineName}
              </p>
            )}
          </div>
          {serviceTime && <span className={styles.time}>{serviceTime}</span>}
        </header>
        {memo?.expectationRank && (
          <div className={styles.rankRow}>
            <ExpectationRankStars value={memo.expectationRank} size="sm" />
          </div>
        )}
        <p className={styles.preview}>{preview}</p>
      </button>
    </li>
  );
}

export function ShiftMemoFlow({ doneRows, currentRows, onSelect }: Props) {
  const hasDone = doneRows.length > 0;
  const hasCurrent = currentRows.length > 0;

  if (!hasDone && !hasCurrent) {
    return <p className={styles.empty}>本日の接客はまだ登録されていません</p>;
  }

  return (
    <div className={styles.wrap}>
      <ol className={styles.flow}>
        {hasDone && (
          <li className={styles.eraRow} aria-hidden>
            <div className={styles.rail}>
              <span className={styles.eraLabel}>昔</span>
            </div>
            <p className={styles.eraHint}>対応し終えたお客様</p>
          </li>
        )}

        {doneRows.map((row, index) => (
          <MemoRow
            key={row.entry.serviceRecordId}
            row={row}
            variant="done"
            showLine={index < doneRows.length - 1 || hasCurrent}
            onSelect={onSelect}
          />
        ))}

        {hasCurrent && (
          <li className={styles.eraRow} aria-hidden>
            <div className={styles.rail}>
              <span className={styles.eraLabel} data-active>
                今
              </span>
            </div>
            <p className={styles.eraHint}>現在対応中 — タップしてお客様メモ</p>
          </li>
        )}

        {currentRows.map((row, index) => (
          <MemoRow
            key={row.entry.serviceRecordId}
            row={row}
            variant="pending"
            showLine={index < currentRows.length - 1}
            isLatest={index === currentRows.length - 1}
            onSelect={onSelect}
          />
        ))}
      </ol>
    </div>
  );
}
