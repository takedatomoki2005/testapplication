import { Link } from "react-router-dom";

type Props = {
  title: string;
};

export function PlaceholderPage({ title }: Props) {
  return (
    <div className="page" style={{ textAlign: "center", paddingTop: 48 }}>
      <h1 className="page-title">{title}</h1>
      <p style={{ fontSize: 13, color: "var(--color-text-sub)", marginTop: 12, lineHeight: 1.6 }}>
        この画面はモック用のプレースホルダーです。
      </p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: 24,
          color: "var(--color-primary)",
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        ホームに戻る
      </Link>
    </div>
  );
}
