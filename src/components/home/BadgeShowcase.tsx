import type { CastBadgeStat, BadgeKind } from "@/data/mock/castDashboard";
import styles from "./BadgeShowcase.module.css";

function BadgeIcon({ kind }: { kind: BadgeKind }) {
  switch (kind) {
    case "rainbow":
      return (
        <div className={`${styles.icon} ${styles.rainbow}`}>
          <span>B</span>
        </div>
      );
    case "gold":
      return (
        <div className={`${styles.icon} ${styles.gold}`}>
          <span>B</span>
        </div>
      );
    case "silver":
      return (
        <div className={`${styles.icon} ${styles.silver}`}>
          <span>B</span>
        </div>
      );
    case "map":
      return (
        <div className={`${styles.icon} ${styles.map}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="#fff"
            />
            <circle cx="12" cy="9" r="2.5" fill="#4a90d9" />
          </svg>
        </div>
      );
    case "gift":
      return (
        <div className={`${styles.icon} ${styles.gift}`}>
          <span className={styles.giftEmoji}>🎁</span>
        </div>
      );
    default:
      return null;
  }
}

type Props = {
  badges: CastBadgeStat[];
};

export function BadgeShowcase({ badges }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>表彰バッジ獲得数</h2>
      <div className={styles.row}>
        {badges.map((b) => (
          <div key={b.id} className={styles.item}>
            <BadgeIcon kind={b.kind} />
            <p className={styles.count}>{b.count}</p>
          </div>
        ))}
      </div>
      <button type="button" className={styles.infoBtn}>
        BP・ランク・バッジについて
      </button>
    </section>
  );
}
