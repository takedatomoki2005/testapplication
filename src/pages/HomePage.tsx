import { useApp } from "@/context/AppContext";
import { CastHomePage } from "./CastHomePage";

export function HomePage() {
  const { session } = useApp();

  if (session.role === "cast") {
    return <CastHomePage />;
  }

  return (
    <div className="page">
      <h1 className="page-title">ホーム</h1>
      <p style={{ fontSize: 13, lineHeight: 1.6 }}>
        黒服・管理者はフッターの「管理」から送信状況を確認できます。
      </p>
    </div>
  );
}
