import { useCallback, useEffect, useState } from "react";

import {
  clearScanHistory as clearStoredHistory,
  readScanHistory,
  saveScanResult as saveStoredResult,
} from "@/lib/scan-history";
import type { ScanResult } from "@/lib/scam-analysis";

export function useScanHistory() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setScans(readScanHistory());
    setIsLoaded(true);
  }, []);

  const saveScan = useCallback((result: ScanResult) => {
    setScans(saveStoredResult(result));
  }, []);

  const clearHistory = useCallback(() => {
    clearStoredHistory();
    setScans([]);
  }, []);

  return { scans, isLoaded, saveScan, clearHistory };
}