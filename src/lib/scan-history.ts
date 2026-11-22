import type { ScanResult } from "./scam-analysis";

const HISTORY_KEY = "scamshield-scan-history-v1";
const MAX_HISTORY_ITEMS = 50;

export function readScanHistory(): ScanResult[] {
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isScanResult).slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

export function saveScanResult(result: ScanResult): ScanResult[] {
  const next = [result, ...readScanHistory()].slice(0, MAX_HISTORY_ITEMS);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function clearScanHistory(): void {
  window.localStorage.removeItem(HISTORY_KEY);
}

export function isScanResult(value: unknown): value is ScanResult {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.content === "string" &&
    typeof record.scannedAt === "string" &&
    (record.scanType === undefined || record.scanType === "message" || record.scanType === "url" || record.scanType === "job") &&
    typeof record.riskScore === "number" &&
    (record.riskLevel === "Low" || record.riskLevel === "Medium" || record.riskLevel === "High") &&
    Array.isArray(record.findings) &&
    Array.isArray(record.recommendations)
  );
}