import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eraser, ScanSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useScanHistory } from "@/hooks/use-scan-history";
import { analyzeMessageDemo } from "@/lib/scam-analysis";

const exampleMessage =
  "URGENT: Your account will be suspended within 24 hours. Verify your account now at https://bit.ly/account-check or risk losing access. Reply with your one-time code.";

export function ScanMessageForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { saveScan } = useScanHistory();
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = message.trim();
    if (!content) {
      setError("Paste a message first to run the demo checks.");
      return;
    }

    setError("");
    const result = analyzeMessageDemo(content, globalThis.crypto.randomUUID());
    saveScan(result);
    void navigate({ to: "/results/$scanId", params: { scanId: result.id } });
  }

  function handleChange(value: string) {
    setMessage(value);
    if (error && value.trim()) setError("");
  }

  return (
    <form className="scanner-form" onSubmit={handleSubmit}>
      <div className="textarea-heading">
        <label htmlFor="message-input" className="field-label">Message to check</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="clear-button"
          onClick={() => {
            handleChange("");
          }}
          disabled={!message}
        >
          <Eraser aria-hidden="true" /> Clear
        </Button>
      </div>
      <Textarea
        id="message-input"
        className="message-textarea"
        value={message}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Paste a suspicious text, email, or job offer here…"
        rows={12}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "message-error" : "message-help"}
      />
      {error ? (
        <p id="message-error" className="form-error" role="alert">{error}</p>
      ) : (
        <p id="message-help" className="field-hint">Only the text you paste is checked; no sender or link is contacted.</p>
      )}
      <div className="form-bottom-row">
        <Button type="button" variant="outline" onClick={() => handleChange(exampleMessage)}>
          Use example message
        </Button>
        <Button type="submit" size="lg" className="primary-action scan-submit">
          <ScanSearch aria-hidden="true" /> Scan message <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}