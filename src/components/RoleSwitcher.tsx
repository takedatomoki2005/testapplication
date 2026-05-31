import { demoSessions, useApp } from "@/context/AppContext";
import styles from "./RoleSwitcher.module.css";

export function RoleSwitcher() {
  const { session, switchSession } = useApp();
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="role-switch">デモ用ロール</label>
      <select
        id="role-switch"
        className={styles.select}
        value={session.id}
        onChange={(e) => {
          const next = demoSessions.find((s) => s.id === e.target.value);
          if (next) switchSession(next);
        }}
      >
        {demoSessions.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
    </div>
  );
}
