import type { CastDashboardProfile } from "@/data/mock/castDashboard";
import styles from "./RankProgressRing.module.css";

type Props = {
  profile: CastDashboardProfile;
};

const SIZE = 220;
const STROKE = 14;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export function RankProgressRing({ profile }: Props) {
  const filled = Math.min(1, Math.max(0, profile.rankProgress));
  const dash = filled * C;

  return (
    <div className={styles.wrap}>
      <div className={styles.sideLeft}>
        <p className={styles.sideLabel}>現在</p>
        <p className={styles.sideValue}>
          <span className={styles.bpNum}>{profile.currentBp}</span>
          <span className={styles.bpUnit}> BP</span>
        </p>
      </div>

      <div className={styles.ringCol}>
        <svg className={styles.ring} width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <defs>
            <linearGradient id="rankGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff6baa" />
              <stop offset="55%" stopColor="#f0276b" />
              <stop offset="100%" stopColor="#ffd600" />
            </linearGradient>
          </defs>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="url(#rankGrad)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </svg>
        <div className={styles.center}>
          <span className={styles.avatarIcon} aria-hidden>
            ♡
          </span>
        </div>
      </div>

      <div className={styles.sideRight}>
        <p className={styles.rankTitle}>{profile.rankName} ランク</p>
        <p className={styles.rankNext}>
          次のランクまで
          <br />
          あと <strong>{profile.pointsToNextRank}</strong> pt
        </p>
      </div>
    </div>
  );
}
