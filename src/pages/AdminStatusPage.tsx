import { Navigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { formatBusinessDate } from "@/lib/thankYou";
import { resolveCustomerRank, getRankLabel } from "@/lib/customerDisplay";

export function AdminStatusPage() {
  const { canManage, isAdmin, castSummaries, businessDate } = useApp();
  if (!canManage) return <Navigate to="/" replace />;

  return (
    <div className="page">
      <div className="page-header-row">
        <h1 className="page-title">送信状況</h1>
        {isAdmin && <Link to="/admin/settings">基準設定</Link>}
      </div>
      <p style={{ fontSize: 13, color: "var(--color-text-sub)", marginBottom: 16 }}>{formatBusinessDate(businessDate)}</p>
      {castSummaries.map((s) => (
        <div key={s.cast.id} className="card" style={{ marginBottom: 10 }}>
          <strong>{s.cast.name}</strong>
          <p style={{ fontSize: 12, marginTop: 6, color: "var(--color-text-sub)" }}>
            対象{s.totalCount} / 送信済{s.sentCount} / 未送信{s.unsentCount} / {s.sendRate}%
          </p>
          {s.unsentEntries.map((e) => {
            const rank = resolveCustomerRank(e.customer, e.hot);
            return (
              <p key={e.id} style={{ fontSize: 12, marginTop: 4 }}>
                未送信：{e.customer.displayName}{rank && ` (${getRankLabel(rank)})`}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}
