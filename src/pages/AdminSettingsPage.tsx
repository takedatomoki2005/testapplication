import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import type { HotCriteria } from "@/data/types";

export function AdminSettingsPage() {
  const { isAdmin, hotCriteria, updateHotCriteria } = useApp();
  const [draft, setDraft] = useState<HotCriteria>(hotCriteria);
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="page">
      <h1 className="page-title">優先顧客判定基準</h1>
      <div className="card">
        <label style={{ display: "block", marginBottom: 12 }}>
          累計使用金額（円以上）
          <input type="number" value={draft.minTotalSpending} onChange={(e) => setDraft({ ...draft, minTotalSpending: +e.target.value })} style={{ width: "100%", marginTop: 4, padding: 8 }} />
        </label>
        <label style={{ display: "block", marginBottom: 12 }}>
          来店回数（回以上）
          <input type="number" value={draft.minVisitCount} onChange={(e) => setDraft({ ...draft, minVisitCount: +e.target.value })} style={{ width: "100%", marginTop: 4, padding: 8 }} />
        </label>
        <label style={{ display: "block" }}>
          指名回数（回以上）
          <input type="number" value={draft.minNominationCount} onChange={(e) => setDraft({ ...draft, minNominationCount: +e.target.value })} style={{ width: "100%", marginTop: 4, padding: 8 }} />
        </label>
      </div>
      <button type="button" onClick={() => updateHotCriteria(draft)} style={{ width: "100%", marginTop: 16, padding: 14, background: "var(--color-primary)", color: "#fff", fontWeight: 700, borderRadius: 99 }}>
        保存
      </button>
    </div>
  );
}
