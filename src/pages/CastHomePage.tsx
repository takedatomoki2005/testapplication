import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { getCastDashboard } from "@/lib/castDashboard";
import { Greeting } from "@/components/Greeting";
import { EndOfDayPopupModal } from "@/components/EndOfDayPopupModal";
import { RankProgressRing } from "@/components/home/RankProgressRing";
import { BadgeShowcase } from "@/components/home/BadgeShowcase";
import { ThankYouHomeCard } from "@/components/home/ThankYouHomeCard";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import styles from "./CastHomePage.module.css";

export function CastHomePage() {
  const navigate = useNavigate();
  const { session, unsentCount, allSent, hasAnyTarget } = useApp();
  const profile = getCastDashboard(session.castId);
  const [popupOpen, setPopupOpen] = useState(true);

  const startReflection = () => {
    setPopupOpen(false);
    navigate("/thank-you", {
      state: { openSwipe: !allSent && unsentCount > 0 },
    });
  };

  return (
    <div className={`${styles.page} page-home`}>
      <div className={styles.topBar}>
        <button type="button" className={styles.logoutBtn}>
          ログアウト
        </button>
      </div>

      <h1 className={styles.castName}>{profile.displayName}</h1>

      <Greeting messageOnly centered />

      <RankProgressRing profile={profile} />

      <button type="button" className={styles.goalBtn}>
        目標設定
      </button>

      <BadgeShowcase badges={profile.badges} />

      <ThankYouHomeCard
        unsentCount={unsentCount}
        allSent={allSent}
        hasAnyTarget={hasAnyTarget}
      />

      <div className={styles.devSwitcher}>
        <RoleSwitcher />
      </div>

      {popupOpen && (
        <EndOfDayPopupModal
          castName={profile.displayName}
          unsentCount={unsentCount}
          allSent={allSent}
          onStartReflection={startReflection}
          onDismiss={() => setPopupOpen(false)}
        />
      )}
    </div>
  );
}
