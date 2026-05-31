import { useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { BarcelonaLogo } from "./BarcelonaLogo";
import styles from "./AppHeader.module.css";

const PINK_HEADER_PATHS = ["/", "/thank-you", "/discover"];

export function AppHeader() {
  const { session } = useApp();
  const { pathname } = useLocation();
  const isPink =
    session.role === "cast" &&
    PINK_HEADER_PATHS.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));

  return (
    <header className={`${styles.header} ${isPink ? styles.headerPink : ""}`}>
      <div className={styles.inner}>
        <BarcelonaLogo variant={isPink ? "light" : "dark"} />
        {session.role === "cast" && (
          <button type="button" className={styles.bellBtn} aria-label="お知らせ">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      {!isPink && <div className={styles.accent} aria-hidden />}
    </header>
  );
}
