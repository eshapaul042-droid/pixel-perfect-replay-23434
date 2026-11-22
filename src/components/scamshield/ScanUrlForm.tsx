import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eraser, ScanSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useScanHistory } from "@/hooks/use-scan-history";
import { analyzeUrlDemo } from "@/lib/url-analysis";

const exampleUrl = "http://account-check.bit.ly/secure-login";

export function ScanUrlForm() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const { saveScan } = useScanHistory();
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = address.trim();
    if (!value) {
      setError("Paste a web address first to run the demo checks.");
      return;
    }

    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    let parsed: URL;
    try {
      parsed = new URL(normalized);
    } catch {
      setError("Enter a complete web address, such as example.com.");
      return;
    }
    if ((parsed.protocol !== "https:" && parsed.protocol !== "http:") || !parsed.hostname.includes(".")) {
      setError("Enter a web address with a domain name, such as example.com.");
      return;
    }

    setError("");
    const result = analyzeUrlDemo(parsed.href, globalThis.crypto.randomUUID());
    saveScan(result);
    void navigate({ to: "/url-results/$scanId", params: { scanId: result.id } });
  }

  function handleChange(value: string) {
    setAddress(value);
    if (error && value.trim()) setError("");
  }

  return (
    <form className="scanner-form" onSubmit={handleSubmit}>
      <div className="textarea-heading">
        <label htmlFor="url-input" className="field-label">Web address to check</label>
        <Button type="button" variant="ghost" size="sm" className="clear-button" onClick={() => handleChange("")} disabled={!address}>
          <Eraser aria-hidden="true" /> Clear
        </Button>
      </div>
      <Textarea
        id="url-input"
        className="message-textarea url-textarea"
        value={address}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Paste a URL, such as https://example.com/account"
        rows={3}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "url-error" : "url-help"}
      />
      {error ? (
        <p id="url-error" className="form-error" role="alert">{error}</p>
      ) : (
        <p id="url-help" className="field-hint">The link is not opened or contacted; only its written address is reviewed.</p>
      )}
      <div className="form-bottom-row">
        <Button type="button" variant="outline" onClick={() => handleChange(exampleUrl)}>Use example link</Button>
        <Button type="submit" size="lg" className="primary-action scan-submit">
          <ScanSearch aria-hidden="true" /> Check address <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}