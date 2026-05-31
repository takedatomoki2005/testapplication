import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

export function AppLayout() {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <AppHeader />
        <main className="app-main">
          <Outlet />
        </main>
        <AppFooter />
      </div>
    </div>
  );
}
