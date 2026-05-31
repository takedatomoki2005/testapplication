import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ShiftMemo, ThankYouEntry } from "@/data/types";
import type { ShiftMemoEntryPayload } from "@/context/AppContext";
import { formatListCustomerName } from "@/lib/customerDisplay";
import { formatMemoEntryHeading } from "@/lib/memoDisplay";
import { formatServiceTimeRange } from "@/lib/serviceDisplay";
import { CustomerEntryNotesForm } from "./CustomerEntryNotesForm";
import styles from "./ShiftMemoEditModal.module.css";

type Props = {
  entry: ThankYouEntry;
  memo?: ShiftMemo;
  onClose: () => void;
  onSave: (serviceRecordId: string, payload: ShiftMemoEntryPayload) => void;
  onMarkDone: (serviceRecordId: string, payload: ShiftMemoEntryPayload) => void;
  onMarkPending: (serviceRecordId: string) => void;
};

export function ShiftMemoEditModal({
  entry,
  memo,
  onClose,
  onSave,
  onMarkDone,
  onMarkPending,
}: Props) {
  const [lineName, setLineName] = useState(entry.lineName ?? "");
  const [body, setBody] = useState(memo?.body ?? "");
  const { alias } = formatListCustomerName(entry.customer);
  const heading = formatMemoEntryHeading(entry);
  const serviceTime = formatServiceTimeRange(
    entry.serviceStartTime,
    entry.serviceEndTime,
  );
  const isDone = memo?.status === "done";
  const canSave = body.trim().length > 0;

  const payload = (): ShiftMemoEntryPayload => ({
    body: body.trim(),
    lineName: lineName.trim(),
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="shift-memo-title"
      >
        <h2 id="shift-memo-title" className={styles.title}>
          退勤前メモ
        </h2>

        <div className={styles.customerBlock}>
          <p className={styles.name}>{heading}</p>
          {alias && <p className={styles.alias}>{alias}</p>}
          {serviceTime && <p className={styles.time}>{serviceTime}</p>}
        </div>

        <div className={styles.notesCard}>
          <CustomerEntryNotesForm
            variant="embedded"
            lineName={lineName}
            memo={body}
            memoRows={4}
            onLineNameChange={setLineName}
            onMemoChange={setBody}
          />
        </div>

        <div className={styles.primaryActions}>
          <button
            type="button"
            className={styles.saveBtn}
            disabled={!canSave}
            onClick={() => {
              onSave(entry.serviceRecordId, payload());
              onClose();
            }}
          >
            保存
          </button>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            閉じる
          </button>
        </div>

        {!isDone ? (
          <button
            type="button"
            className={styles.doneBtn}
            disabled={!canSave}
            onClick={() => {
              onMarkDone(entry.serviceRecordId, payload());
              onClose();
            }}
          >
            対応済みにする
          </button>
        ) : (
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => {
              onMarkPending(entry.serviceRecordId);
              onClose();
            }}
          >
            現在対応中に戻す
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
