import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eraser, ScanSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useScanHistory } from "@/hooks/use-scan-history";
import { analyzeJobMessageDemo } from "@/lib/job-analysis";
import { saveJobScanSession } from "@/lib/scan-session";

const exampleOffer =
  "Remote data entry opening: earn $900 per day with no experience required. We are hiring immediately. Pay a refundable equipment fee before your interview, then use your personal bank account to receive payments from customers.";

export function ScanJobForm() {
  const [offer, setOffer] = useState("");
  const [error, setError] = useState("");
  const { saveScan } = useScanHistory();
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = offer.trim();
    if (!content) {
      setError("Paste a job offer first to run the demo checks.");
      return;
    }

    setError("");
    const result = analyzeJobMessageDemo(content, globalThis.crypto.randomUUID());
    saveScan(result);
    saveJobScanSession(result);
    void navigate({ to: "/job-results/$scanId", params: { scanId: result.id } });
  }

  function handleChange(value: string) {
    setOffer(value);
    if (error && value.trim()) setError("");
  }

  return (
    <form className="scanner-form" onSubmit={handleSubmit}>
      <div className="textarea-heading">
        <label htmlFor="job-offer-input" className="field-label">Job offer to review</label>
        <Button type="button" variant="ghost" size="sm" className="clear-button" onClick={() => handleChange("")} disabled={!offer}>
          <Eraser aria-hidden="true" /> Clear
        </Button>
      </div>
      <Textarea
        id="job-offer-input"
        className="message-textarea"
        value={offer}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Paste the job description, recruiter message, or offer details here…"
        rows={12}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "job-error" : "job-help"}
      />
      {error ? (
        <p id="job-error" className="form-error" role="alert">{error}</p>
      ) : (
        <p id="job-help" className="field-hint">Only the text you paste is checked; no employer or link is contacted.</p>
      )}
      <div className="form-bottom-row">
        <Button type="button" variant="outline" onClick={() => handleChange(exampleOffer)}>Use example offer</Button>
        <Button type="submit" size="lg" className="primary-action scan-submit">
          <ScanSearch aria-hidden="true" /> Check offer <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}