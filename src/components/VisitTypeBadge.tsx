import type { VisitType } from "@/data/types";
import { VISIT_TYPE_LABEL } from "@/lib/customerDisplay";
import styles from "./VisitTypeBadge.module.css";

const TYPE_CLASS: Record<VisitType, string> = {
  nomination: styles.nomination,
  accompany: styles.accompany,
  "in-store": styles.inStore,
};

export function VisitTypeBadge({ type, solid = false }: { type: VisitType; solid?: boolean }) {
  return (
    <span className={`${styles.badge} ${TYPE_CLASS[type]}${solid ? ` ${styles.solid}` : ""}`}>
      {VISIT_TYPE_LABEL[type]}
    </span>
  );
}
