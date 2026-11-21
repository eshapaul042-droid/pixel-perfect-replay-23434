import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Clock3, ScanLine, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const scanIsActive = pathname === "/scan" || pathname.startsWith("/results/");

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="content-width header-inner">
          <Link to="/" className="brand-lockup" aria-label="ScamShield home">
            <span className="brand-mark"><ShieldCheck aria-hidden="true" /></span>
            <span className="brand-name">ScamShield</span>
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <Link to="/" className={`nav-link ${pathname === "/" ? "nav-link-active" : ""}`}>
              Home
            </Link>
            <Link to="/scan" className={`nav-link ${scanIsActive ? "nav-link-active" : ""}`}>
              <ScanLine aria-hidden="true" /> Scan
            </Link>
            <Link to="/history" className={`nav-link ${pathname === "/history" ? "nav-link-active" : ""}`}>
              <Clock3 aria-hidden="true" /> History
            </Link>
          </nav>
          <Button asChild size="sm" className="header-cta">
            <Link to="/scan">Scan now</Link>
          </Button>
        </div>
      </header>
      <div className="app-content">{children}</div>
      <footer className="site-footer">
        <div className="content-width footer-inner">
          <span className="footer-brand"><ShieldCheck aria-hidden="true" /> ScamShield</span>
          <span>Demo mode · Your scans stay in this browser</span>
          <span>Not a real AI or security verdict</span>
        </div>
      </footer>
    </div>
  );
}