import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CircleAlert, ShieldCheck } from "lucide-react";

import { HighlightedMessage } from "@/components/scamshield/HighlightedMessage";
import { RiskBadge } from "@/components/scamshield/RiskBadge";
import { Button } from "@/components/ui/button";
import { useScanHistory } from "@/hooks/use-scan-history";
import { DEMO_RULES } from "@/lib/scam-analysis";

export const Route = createFileRoute("/results/$scanId")({
  head: () => ({
    meta: [
      { title: "Demo Analysis Results · ScamShield" },
      { name: "description", content: "Review a transparent ScamShield demo analysis and its matched message signals." },
      { property: "og:title", content: "Demo Analysis Results · ScamShield" },
      { property: "og:description", content: "See the demo rules that matched a suspicious message and practical next steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { scanId } = Route.useParams();
  const { scans, isLoaded } = useScanHistory();
  const result = scans.find((scan) => scan.id === scanId);

  if (!isLoaded) {
    return <main className="content-width page-main"><p className="loading-note">Loading your local result…</p></main>;
  }

  if (!result) {
    return (
      <main className="content-width page-main missing-result">
        <div className="empty-icon"><CircleAlert aria-hidden="true" /></div>
        <p className="eyebrow">Result unavailable</p>
        <h1>This scan isn’t saved in this browser.</h1>
        <p>Scan history is stored locally and may be cleared when browser data is removed.</p>
        <Button asChild><Link to="/scan">Start a new scan <ArrowRight aria-hidden="true" /></Link></Button>
      </main>
    );
  }

  const resultTone = `risk-summary risk-${result.riskLevel.toLowerCase()}`;
  const date = new Date(result.scannedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="content-width page-main results-page">
      <div className="page-back-link"><Button asChild variant="ghost" size="sm"><Link to="/scan"><ArrowLeft aria-hidden="true" /> New scan</Link></Button></div>
      <div className="results-heading">
        <div>
          <p className="eyebrow"><ShieldCheck aria-hidden="true" /> DEMO ANALYSIS · {date}</p>
          <h1>Here’s what stood out.</h1>
          <p>These are example rule matches—not a real-world security verdict.</p>
        </div>
        <Button asChild variant="outline"><Link to="/history">Scan history <ArrowRight aria-hidden="true" /></Link></Button>
      </div>

      <section className={resultTone} aria-label="Demo risk result">
        <div className="risk-summary-main">
          <RiskBadge level={result.riskLevel} />
          <h2>{result.riskLevel === "Low" ? "Few demo signals matched" : `${result.riskLevel} demo signal level`}</h2>
          <p>This score reflects only the sample rules listed below. It is not a probability.</p>
        </div>
        <div className="score-display">
          <span className="score-number">{result.riskScore}</span>
          <span className="score-out-of">/ 100</span>
          <span className="score-caption">demo signal score</span>
          <progress className="risk-progress" max={100} value={result.riskScore} aria-label={`${result.riskScore} out of 100 demo signal score`} />
        </div>
      </section>

      <section className="message-review" aria-labelledby="message-review-heading">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Your message</p>
          <h2 id="message-review-heading">Matched phrases are highlighted</h2>
        </div>
        <HighlightedMessage content={result.content} findings={result.findings} />
      </section>

      <section className="findings-section" aria-labelledby="findings-heading">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Rule matches</p>
          <h2 id="findings-heading">What the demo noticed</h2>
        </div>
        {result.findings.length === 0 ? (
          <div className="no-findings"><ShieldCheck aria-hidden="true" /><p>No demo rules matched this message. That does not confirm it is safe.</p></div>
        ) : (
          <ul className="findings-list">
            {result.findings.map((finding) => (
              <li className="finding-row" key={finding.id}>
                <span className="finding-icon"><CircleAlert aria-hidden="true" /></span>
                <div className="finding-copy">
                  <h3>{finding.label}</h3>
                  {finding.matchedText && <p className="matched-label">Matched: <mark className="matched-phrase">{finding.matchedText}</mark></p>}
                  <p>{finding.detail}</p>
                </div>
                <span className="finding-points">+{finding.points}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="recommendations-section" aria-labelledby="recommendations-heading">
        <div className="section-heading compact-heading">
          <p className="eyebrow">A thoughtful next step</p>
          <h2 id="recommendations-heading">What you can do</h2>
        </div>
        <ul className="recommendations-list">
          {result.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}
        </ul>
      </section>

      <details className="rules-disclosure">
        <summary>View the demo rules used in this check</summary>
        <ul>{DEMO_RULES.map((rule) => <li key={rule}>{rule}</li>)}</ul>
      </details>
    </main>
  );
}