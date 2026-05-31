import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { ThankYouListPage } from "./pages/ThankYouListPage";
import { MemoPage } from "./pages/MemoPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { AdminStatusPage } from "./pages/AdminStatusPage";
import { AdminSettingsPage } from "./pages/AdminSettingsPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

export function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="thank-you" element={<ThankYouListPage />} />
            <Route path="memo" element={<MemoPage />} />
            <Route path="ranking" element={<PlaceholderPage title="ランキング" />} />
            <Route path="graph" element={<PlaceholderPage title="グラフ" />} />
            <Route path="calendar" element={<PlaceholderPage title="カレンダー" />} />
            <Route path="gacha" element={<PlaceholderPage title="ガチャ" />} />
            <Route path="admin" element={<AdminStatusPage />} />
            <Route path="admin/settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
