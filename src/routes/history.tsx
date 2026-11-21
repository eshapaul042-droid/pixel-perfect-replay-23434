import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, History as HistoryIcon, Trash2 } from "lucide-react";

import { RiskBadge } from "@/components/scamshield/RiskBadge";
import { Button } from "@/components/ui/button";
import { useScanHistory } from "@/hooks/use-scan-history";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan History · ScamShield" },
      { name: "description", content: "Review past ScamShield demo scans saved in this browser." },
      { property: "og:title", content: "Scan History · ScamShield" },
      { property: "og:description", content: "Your locally saved demo scan results, available only in this browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { scans, isLoaded, clearHistory } = useScanHistory();

  return (
    <main className="content-width page-main history-page">
      <div className="results-heading">
        <div>
          <p className="eyebrow"><Clock3 aria-hidden="true" /> PRIVATE TO THIS BROWSER</p>
          <h1>Your scan history</h1>
          <p>Only scans saved in this browser appear here.</p>
        </div>
        {isLoaded && scans.length > 0 && (
          <Button variant="outline" onClick={clearHistory} className="clear-history-button">
            <Trash2 aria-hidden="true" /> Clear history
          </Button>
        )}
      </div>

      {!isLoaded ? (
        <p className="loading-note">Loading your local scan history…</p>
      ) : scans.length === 0 ? (
        <section className="history-empty">
          <div className="empty-icon"><HistoryIcon aria-hidden="true" /></div>
          <p className="eyebrow">Nothing saved yet</p>
          <h2>Your next check will show up here.</h2>
          <p>Run a demo scan and come back to review its notes whenever you need them.</p>
          <Button asChild size="lg"><Link to="/scan">Scan a message <ArrowRight aria-hidden="true" /></Link></Button>
        </section>
      ) : (
        <section className="history-list" aria-label="Previous scans">
          <p className="history-count">{scans.length} {scans.length === 1 ? "scan" : "scans"} saved in this browser</p>
          {scans.map((scan) => (
            <article className="history-row" key={scan.id}>
              <div className="history-row-main">
                <span className="history-date">{new Date(scan.scannedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
                <p className="history-preview">{scan.content.replace(/\s+/g, " ")}</p>
                <span className="history-score">Demo score: {scan.riskScore}/100</span>
              </div>
              <div className="history-row-end">
                <RiskBadge level={scan.riskLevel} compact />
                <Button asChild variant="outline" size="sm" aria-label={`View result from ${new Date(scan.scannedAt).toLocaleDateString()}`}>
                  <Link to="/results/$scanId" params={{ scanId: scan.id }}>View <ArrowRight aria-hidden="true" /></Link>
                </Button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}