import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Info, ShieldCheck } from "lucide-react";

import { ScanMessageForm } from "@/components/scamshield/ScanMessageForm";
import { Button } from "@/components/ui/button";
import { DEMO_RULES } from "@/lib/scam-analysis";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan a Message · ScamShield Demo" },
      { name: "description", content: "Paste a message to review it using ScamShield's clearly labeled demo rules." },
      { property: "og:title", content: "Scan a Message · ScamShield Demo" },
      { property: "og:description", content: "Review message wording with transparent, local demo checks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScanPage,
});

function ScanPage() {
  return (
    <main className="content-width page-main scanner-page">
      <div className="page-back-link"><Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft aria-hidden="true" /> Home</Link></Button></div>
      <div className="page-intro">
        <p className="eyebrow"><span className="status-dot" /> ScamShield · DEMO MODE</p>
        <h1>Check a message before you trust it.</h1>
        <p>Paste a text, email, or job offer to see which simple demo rules match its wording.</p>
      </div>

      <div className="scanner-layout">
        <section className="scanner-workspace" aria-label="Message scanner">
          <ScanMessageForm />
        </section>
        <aside className="scanner-side">
          <section className="rules-panel">
            <div className="panel-heading">
              <span className="panel-icon"><ShieldCheck aria-hidden="true" /></span>
              <div><h2>What the demo checks</h2><p>Transparent rules, not AI.</p></div>
            </div>
            <ul className="rules-list">
              {DEMO_RULES.map((rule) => <li key={rule}>{rule}</li>)}
            </ul>
          </section>
          <section className="limit-note">
            <Info aria-hidden="true" />
            <p><strong>Important:</strong> a score is not a probability. No sender identity, link destination, or live threat data is checked.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}