import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleCheck,
  ExternalLink,
  MessageCircleWarning,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScamShield — Stay Safe. Stay Scam-Free." },
      {
        name: "description",
        content: "Review suspicious messages using clear, rule-based demo checks—not a real AI verdict.",
      },
      { property: "og:title", content: "ScamShield — Stay Safe. Stay Scam-Free." },
      {
        property: "og:description",
        content: "A friendly, transparent demo for checking suspicious messages, links, and job offers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <div className="content-width hero-content">
          <div className="demo-kicker"><span className="status-dot" /> Transparent demo mode</div>
          <h1>Stay Safe.<br />Stay Scam-Free.</h1>
          <p className="hero-copy">
            A calmer way to pause and review suspicious messages, links, and job offers.
            ScamShield shows the demo rules behind every result.
          </p>
          <div className="hero-actions">
            <Button asChild size="lg" className="primary-action">
              <Link to="/scan">Scan a message <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Link to="/history" className="text-link">View scan history</Link>
          </div>
          <div className="hero-preview" aria-label="Illustrative demo scan preview">
            <div className="preview-header">
              <div className="preview-icon"><ShieldCheck aria-hidden="true" /></div>
              <div>
                <p className="preview-eyebrow">EXAMPLE RESULT · DEMO</p>
                <p className="preview-title">A second look, made simple</p>
              </div>
              <span className="risk-pill risk-medium">Medium signal</span>
            </div>
            <div className="preview-findings">
              <span><CircleCheck aria-hidden="true" /> Clear rule-by-rule notes</span>
              <span><CircleCheck aria-hidden="true" /> No message leaves this browser</span>
              <span><CircleCheck aria-hidden="true" /> Not a real AI or security verdict</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-width feature-section" aria-labelledby="features-heading">
        <div className="section-heading">
          <p className="eyebrow">A little more clarity</p>
          <h2 id="features-heading">One careful check can change the next step.</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card feature-blue">
            <div className="feature-icon"><MessageCircleWarning aria-hidden="true" /></div>
            <h3>Message detection</h3>
            <p>Review pressure language, requests for sign-in details, and unusual payment wording.</p>
          </article>
          <article className="feature-card feature-pink">
            <div className="feature-icon"><ExternalLink aria-hidden="true" /></div>
            <h3>URL analysis</h3>
            <p>Spot links in a message and get a gentle reminder to check their destination first.</p>
          </article>
          <article className="feature-card feature-olive">
            <div className="feature-icon"><BriefcaseBusiness aria-hidden="true" /></div>
            <h3>Job scam signals</h3>
            <p>Notice fee requests in job offers and verify an employer through independent channels.</p>
          </article>
        </div>
      </section>

      <section className="how-section">
        <div className="content-width how-content">
          <div className="section-heading">
            <p className="eyebrow">Simple by design</p>
            <h2>How it works</h2>
          </div>
          <ol className="steps-grid">
            <li><span className="step-number">01</span><h3>Paste the message</h3><p>Keep the original context so the demo rules can review the wording.</p></li>
            <li><span className="step-number">02</span><h3>See what stood out</h3><p>Each signal is named and explained, with the matched phrase shown.</p></li>
            <li><span className="step-number">03</span><h3>Choose your next step</h3><p>Use the notes as a reminder to verify—not as a final security verdict.</p></li>
          </ol>
          <div className="demo-disclaimer">
            <ShieldCheck aria-hidden="true" />
            <p><strong>Clear about its limits.</strong> ScamShield is a local demonstration, not an AI model or live threat detection service.</p>
            <Button asChild variant="outline"><Link to="/scan">Try the demo <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
        </div>
      </section>
    </main>
  );
}