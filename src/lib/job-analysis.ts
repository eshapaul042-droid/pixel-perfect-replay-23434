import type { RiskLevel, ScanFinding, ScanResult } from "@/lib/scam-analysis";

export const JOB_DEMO_RULES = [
  "Requests for application, training, equipment, or other upfront fees",
  "Requests to receive, move, or forward money through a personal account",
  "Requests for sensitive banking or identity details",
  "Unusually high pay claims or pressure to act immediately",
];

const feePattern = /\b(?:application|training|equipment|processing|registration|background check)\s+fee\b|\bupfront\s+(?:payment|fee)\b|\bpay\s+(?:a\s+)?fee\s+before\b/i;
const moneyMovementPattern = /\b(?:receive|transfer|forward|move)\s+(?:payments?|money|funds?)\b|\b(?:use|using)\s+(?:your|a personal)\s+(?:bank|personal)?\s*account\b/i;
const sensitiveInfoPattern = /\b(?:social security number|\bssn\b|bank account details|bank login|banking credentials)\b/i;
const highPayPattern = /\b(?:earn|make)\s+\$?\d{2,3}(?:,\d{3})?\s+per\s+(?:day|week)\b|\bno experience (?:needed|required)\b/i;
const urgencyPattern = /\b(?:immediate start|hiring immediately|act fast|limited slots)\b/i;

function riskLevelFor(score: number): RiskLevel {
  if (score >= 55) return "High";
  if (score >= 25) return "Medium";
  return "Low";
}

export function analyzeJobMessageDemo(
  content: string,
  id: string,
  scannedAt = new Date().toISOString(),
): ScanResult {
  const findings: ScanFinding[] = [];
  const addMatch = (pattern: RegExp, finding: Omit<ScanFinding, "matchedText">) => {
    const matchedText = content.match(pattern)?.[0];
    if (matchedText) findings.push({ ...finding, matchedText });
  };

  addMatch(feePattern, {
    id: "job-fee",
    label: "Upfront job fee requested",
    detail: "A request to pay before starting work deserves independent verification.",
    points: 30,
  });
  addMatch(moneyMovementPattern, {
    id: "money-movement",
    label: "Personal account used to move money",
    detail: "A job asking you to receive or forward funds through an account is a serious warning sign.",
    points: 40,
  });
  addMatch(sensitiveInfoPattern, {
    id: "sensitive-info",
    label: "Sensitive identity or banking details requested",
    detail: "Verify the employer independently before sharing personal or financial information.",
    points: 28,
  });
  addMatch(highPayPattern, {
    id: "high-pay-claim",
    label: "Unusually high pay or no-experience claim",
    detail: "Very high pay paired with minimal requirements can merit extra scrutiny.",
    points: 18,
  });
  addMatch(urgencyPattern, {
    id: "job-urgency",
    label: "Pressure to act immediately",
    detail: "Pressure to accept quickly can make it harder to verify an opportunity.",
    points: 12,
  });

  const riskScore = Math.min(100, findings.reduce((total, finding) => total + finding.points, 0));
  const riskLevel = riskLevelFor(riskScore);
  const recommendations = [
    "Find the employer's official careers page and contact details independently.",
    "Do not pay to get a job or let an employer move money through your personal account.",
  ];
  if (findings.some((finding) => finding.id === "sensitive-info")) {
    recommendations.unshift("Wait to share identity or banking details until the employer is verified.");
  }
  if (findings.length === 0) {
    recommendations.unshift("No job-scam demo rules matched. That does not confirm the offer is legitimate.");
  }

  return {
    id,
    scannedAt,
    content,
    scanType: "job",
    riskLevel,
    riskScore,
    findings,
    recommendations,
  };
}