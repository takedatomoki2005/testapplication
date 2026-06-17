import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YORIMICHI",
  description: "いつもの帰り道に、今日だけの寄り道を。"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen flex justify-center bg-bg">
          <div className="w-full max-w-[420px] min-h-screen bg-surface shadow-shell flex flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
