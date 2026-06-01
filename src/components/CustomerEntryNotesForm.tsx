import styles from "./CustomerEntryNotesForm.module.css";

type NoteField = "lineName" | "memo";

type EditableProps = {
  readOnly?: false;
  lineName: string;
  memo: string;
  onLineNameChange: (value: string) => void;
  onMemoChange: (value: string) => void;
  fields?: NoteField[];
  variant?: "default" | "embedded";
  memoRows?: number;
  memoLabel?: string;
};

type ReadOnlyProps = {
  readOnly: true;
  lineName?: string;
  memo?: string;
  fields?: NoteField[];
  variant?: "default" | "embedded";
  memoRows?: number;
  memoLabel?: string;
};

type Props = EditableProps | ReadOnlyProps;

const DEFAULT_FIELDS: NoteField[] = ["lineName", "memo"];

function formClass(variant: "default" | "embedded" | undefined) {
  return variant === "embedded"
    ? `${styles.form} ${styles.formEmbedded}`
    : styles.form;
}

export function CustomerEntryNotesForm(props: Props) {
  const fields = props.fields ?? DEFAULT_FIELDS;
  const variant = props.variant ?? "default";
  const memoRows = props.memoRows ?? 2;
  const memoLabel = props.memoLabel ?? "お客様メモ";
  const showLineName = fields.includes("lineName");
  const showMemo = fields.includes("memo");

  if (props.readOnly) {
    const { lineName, memo } = props;
    if (!showLineName && !showMemo) return null;
    if (showLineName && !lineName && showMemo && !memo) return null;
    if (!showLineName && showMemo && !memo) return null;
    if (!showMemo && showLineName && !lineName) return null;

    return (
      <div className={formClass(variant)}>
        {showLineName && (
          <div className={styles.field}>
            <span className={styles.label}>LINE名</span>
            {lineName ? (
              <span className={styles.readOnlyValue}>{lineName}</span>
            ) : (
              <span className={styles.emptyValue}>—</span>
            )}
          </div>
        )}
        {showMemo && (
          <div className={styles.field}>
            <span className={styles.label}>{memoLabel}</span>
            {memo ? (
              <span className={styles.readOnlyValue}>{memo}</span>
            ) : (
              <span className={styles.emptyValue}>—</span>
            )}
          </div>
        )}
      </div>
    );
  }

  const { lineName, memo, onLineNameChange, onMemoChange } = props;

  return (
    <div className={formClass(variant)} onPointerDown={(e) => e.stopPropagation()}>
      {showLineName && (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="entry-line-name">
            LINE名
          </label>
          <input
            id="entry-line-name"
            type="text"
            className={styles.input}
            value={lineName}
            onChange={(e) => onLineNameChange(e.target.value)}
            placeholder="LINEの表示名"
            autoComplete="off"
          />
        </div>
      )}
      {showMemo && (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="entry-memo">
            {memoLabel}
          </label>
          <textarea
            id="entry-memo"
            className={styles.textarea}
            value={memo}
            onChange={(e) => onMemoChange(e.target.value)}
            placeholder="接客メモなど"
            rows={memoRows}
          />
        </div>
      )}
    </div>
  );
}
