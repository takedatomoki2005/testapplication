import { NavLink } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import styles from "./AppFooter.module.css";

const active = "#F0276B";
const inactive = "#888";

const castTabs = [
  {
    to: "/",
    label: "ホーム",
    end: true,
    icon: (a: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={a ? active : inactive} />
      </svg>
    ),
  },
  {
    to: "/thank-you",
    label: "振り返り",
    end: false,
    icon: (a: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
          stroke={a ? active : inactive}
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M8 12h8M8 9h5"
          stroke={a ? active : inactive}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: "/memo",
    label: "メモ",
    end: false,
    icon: (a: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
          stroke={a ? active : inactive}
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M14 2v6h6M8 13h8M8 17h5"
          stroke={a ? active : inactive}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: "/discover",
    label: "探す",
    end: false,
    icon: (a: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="11"
          cy="11"
          r="7"
          stroke={a ? active : inactive}
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M16 16l5 5"
          stroke={a ? active : inactive}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const adminTab = {
  to: "/admin",
  label: "管理",
  end: false,
  icon: (a: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill={a ? active : inactive} />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill={a ? active : inactive} />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill={a ? active : inactive} />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill={a ? active : inactive} />
    </svg>
  ),
};

export function AppFooter() {
  const { canManage, session } = useApp();
  const tabs =
    session.role === "cast"
      ? castTabs
      : canManage
        ? [castTabs[0], adminTab]
        : castTabs;

  return (
    <footer className={styles["app-footer"]}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `${styles["tab-item"]}${isActive ? ` ${styles.active}` : ""}`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`${styles["tab-icon"]}${isActive ? "" : ` ${styles.inactive}`}`}>
                {tab.icon(isActive)}
              </div>
              <span className={styles["tab-label"]}>{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </footer>
  );
}
