import { useRef } from "react";
import styles from "./TablePhotoField.module.css";

type Props = {
  tableNumber?: string;
  photoUrl?: string;
  defaultPhotoUrl?: string;
  onPhotoChange?: (dataUrl: string | undefined) => void;
  readOnly?: boolean;
  compact?: boolean;
};

export function TablePhotoField({
  tableNumber,
  photoUrl,
  defaultPhotoUrl,
  onPhotoChange,
  readOnly = false,
  compact = false,
}: Props) {
  const displayUrl = photoUrl || defaultPhotoUrl;
  const hasUserPhoto = Boolean(photoUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (readOnly || !onPhotoChange) return;
    inputRef.current?.click();
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !onPhotoChange) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onPhotoChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoChange?.(undefined);
  };

  return (
    <div className={`${styles.wrap} ${compact ? styles.wrapCompact : ""}`}>
      {!readOnly && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={onFile}
          aria-hidden
          tabIndex={-1}
        />
      )}

      {displayUrl ? (
        <div className={styles.preview}>
          <img src={displayUrl} alt={tableNumber ? `卓${tableNumber}の写真` : "卓の写真"} />
          {!readOnly && onPhotoChange && (
            <button type="button" className={styles.changeBtn} onClick={openPicker}>
              写真を変更
            </button>
          )}
          {!readOnly && onPhotoChange && hasUserPhoto && (
            <button type="button" className={styles.removeBtn} onClick={clearPhoto} aria-label="写真を削除">
              ✕
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          className={styles.placeholder}
          onClick={openPicker}
          disabled={readOnly || !onPhotoChange}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className={styles.placeholderIcon} aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M7 5l2-2h6l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <span className={styles.placeholderTitle}>
            {tableNumber ? `卓${tableNumber}` : "卓"}の写真
          </span>
          <span className={styles.placeholderSub}>
            {readOnly ? "写真なし" : "タップして追加"}
          </span>
        </button>
      )}
    </div>
  );
}
