import type { ScanResult } from "@/lib/scam-analysis";
import { isScanResult } from "@/lib/scan-history";

const JOB_SCAN_SESSION_PREFIX = "scamshield-job-scan-v1:";

export function saveJobScanSession(result: ScanResult): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(`${JOB_SCAN_SESSION_PREFIX}${result.id}`, JSON.stringify(result));
  } catch {
    // The browser's saved scan history remains available if session storage is unavailable.
  }
}

export function readJobScanSession(scanId: string): ScanResult | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.sessionStorage.getItem(`${JOB_SCAN_SESSION_PREFIX}${scanId}`);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isScanResult(parsed) && parsed.scanType === "job" ? parsed : null;
  } catch {
    return null;
  }
}