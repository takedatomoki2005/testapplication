import { formatServiceTimeRange } from "@/lib/serviceDisplay";
import { getDefaultTablePhotoUrl } from "@/lib/tablePhotos";
import { TablePhotoField } from "./TablePhotoField";
import styles from "./TableServiceInfo.module.css";

type Props = {
  tableNumber?: string;
  serviceStartTime?: string;
  serviceEndTime?: string;
  tablePhotoUrl?: string;
  onPhotoChange?: (dataUrl: string | undefined) => void;
  readOnly?: boolean;
};

export function TableServiceInfo({
  tableNumber,
  serviceStartTime,
  serviceEndTime,
  tablePhotoUrl,
  onPhotoChange,
  readOnly = false,
}: Props) {
  const timeLabel = formatServiceTimeRange(serviceStartTime, serviceEndTime);
  const defaultPhotoUrl = getDefaultTablePhotoUrl(Number(tableNumber) || 0);

  return (
    <section className={styles.section}>
      <div className={styles.metaRow}>
        {timeLabel && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>接客時間</span>
            <span className={styles.metaValue}>{timeLabel}</span>
          </div>
        )}
        {tableNumber && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>卓番</span>
            <span className={styles.metaValue}>卓{tableNumber}</span>
          </div>
        )}
      </div>
      <TablePhotoField
        tableNumber={tableNumber}
        photoUrl={tablePhotoUrl}
        defaultPhotoUrl={defaultPhotoUrl}
        onPhotoChange={onPhotoChange}
        readOnly={readOnly}
      />
    </section>
  );
}
