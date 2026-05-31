import { useLayoutEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

export function AppLayout() {
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useLayoutEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <div className="app-frame">
        <AppHeader />
        <main ref={mainRef} className="app-main">
          <Outlet />
        </main>
      </div>
      <AppFooter />
    </div>
  );
}
