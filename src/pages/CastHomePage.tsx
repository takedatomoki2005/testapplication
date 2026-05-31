import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { initialAppData } from "@/data";
import { getCastDashboard } from "@/lib/castDashboard";
import { getRecommendReasonScore } from "@/lib/discoverRecommendReasons";
import {
  getFollowUpContacts,
  mergeFollowUpRecords,
} from "@/lib/followUpDiscover";
import { getMonthlyCustomers } from "@/lib/monthlyCustomers";
import { Greeting } from "@/components/Greeting";
import { EndOfDayPopupModal } from "@/components/EndOfDayPopupModal";
import { RankProgressRing } from "@/components/home/RankProgressRing";
import { BadgeShowcase } from "@/components/home/BadgeShowcase";
import { MonthlyCustomersCard } from "@/components/home/MonthlyCustomersCard";
import { ThankYouHomeCard } from "@/components/home/ThankYouHomeCard";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import styles from "./CastHomePage.module.css";

export function CastHomePage() {
  const navigate = useNavigate();
  const { session, businessDate, unsentCount, allSent, hasAnyTarget, myEntries, hotCriteria, followUpOverrides } = useApp();
  const profile = getCastDashboard(session.castId);
  const [popupOpen, setPopupOpen] = useState(true);

  const monthlyCustomers = useMemo(
    () =>
      getMonthlyCustomers(
        session.castId ?? "cast-a",
        businessDate,
        initialAppData.customers,
        initialAppData.serviceRecords,
        initialAppData.followUpRecords,
      ),
    [session.castId, businessDate],
  );

  const discoverCount = useMemo(() => {
    const castId = session.castId ?? "cast-a";
    const records = mergeFollowUpRecords(initialAppData.followUpRecords, followUpOverrides);
    const contacts = getFollowUpContacts(
      records,
      initialAppData.customers,
      castId,
      hotCriteria,
      businessDate,
    );
    return contacts.filter(
      (c) =>
        getRecommendReasonScore(c, businessDate) > 0 &&
        !followUpOverrides[c.id]?.followUpSentAt,
    ).length;
  }, [session.castId, businessDate, hotCriteria, followUpOverrides]);

  const startReflection = () => {
    setPopupOpen(false);
    navigate("/thank-you", {
      state: { openSwipe: !allSent && unsentCount > 0 },
    });
  };

  const goDiscover = () => {
    setPopupOpen(false);
    navigate("/discover");
  };

  return (
    <div className={`${styles.page} page-home`}>
      <div className={styles.topBar}>
        <button type="button" className={styles.logoutBtn}>
          ログアウト
        </button>
      </div>

      <h1 className={styles.castName}>{profile.displayName}</h1>

      <Greeting messageOnly centered monthlyCount={monthlyCustomers.count} />

      <MonthlyCustomersCard summary={monthlyCustomers} />

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
          todayCustomerCount={myEntries.length}
          discoverCount={discoverCount}
          onDiscover={goDiscover}
          onStartReflection={startReflection}
          onDismiss={() => setPopupOpen(false)}
        />
      )}
    </div>
  );
}
