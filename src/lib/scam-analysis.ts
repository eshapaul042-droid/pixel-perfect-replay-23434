export type RiskLevel = "Low" | "Medium" | "High";

export interface ScanFinding {
  id: string;
  label: string;
  detail: string;
  points: number;
  matchedText?: string;
}

export interface ScanResult {
  id: string;
  scannedAt: string;
  content: string;
  scanType?: "message" | "url" | "job";
  riskLevel: RiskLevel;
  riskScore: number;
  findings: ScanFinding[];
  recommendations: string[];
}

export const DEMO_RULES = [
  "Urgency or pressure phrases, such as ‘act now’ or ‘within 24 hours’",
  "Requests for passwords, verification codes, or account sign-in",
  "Unusual payment requests, including gift cards, wire transfers, or fees",
  "Job-related fees and work-from-home claims",
  "Links in messages; shortened links receive a stronger demo signal",
];

const urgencyPattern = /\b(?:act now|immediately|urgent|within\s+(?:24|48)\s+hours|today only|account\s+(?:is\s+)?suspended)\b/i;
const credentialPattern = /\b(?:password|one[-\s]?time code|verification code|\botp\b|verify your account|login credentials|sign in to your account)\b/i;
const paymentPattern = /\b(?:gift cards?|wire transfer|cryptocurrency|bitcoin|upfront fee|processing fee|pay(?:ment)? in advance)\b/i;
const jobFeePattern = /\b(?:application fee|training fee|equipment fee)\b/i;
const remoteJobPattern = /\b(?:remote job|work from home)\b/i;
const urlPattern = /https?:\/\/[^\s<>"']+/gi;
const shortenerHosts = new Set(["bit.ly", "tinyurl.com", "t.co", "cutt.ly", "rb.gy"]);

function classifyScore(score: number): RiskLevel {
  if (score >= 55) return "High";
  if (score >= 25) return "Medium";
  return "Low";
}

export function analyzeMessageDemo(
  content: string,
  id: string,
  scannedAt = new Date().toISOString(),
): ScanResult {
  const findings: ScanFinding[] = [];
  const addFinding = (finding: ScanFinding) => findings.push(finding);

  if (urgencyPattern.test(content)) {
    addFinding({
      id: "urgency",
      label: "Urgency or pressure language",
      detail: "The message uses language that can pressure someone to act quickly.",
      points: 24,
      matchedText: content.match(urgencyPattern)?.[0],
    });
  }

  if (credentialPattern.test(content)) {
    addFinding({
      id: "credentials",
      label: "Account or sign-in information requested",
      detail: "Unexpected requests for passwords or verification codes deserve extra caution.",
      points: 30,
      matchedText: content.match(credentialPattern)?.[0],
    });
  }

  if (paymentPattern.test(content)) {
    addFinding({
      id: "payment",
      label: "Unusual payment language",
      detail: "The message mentions a payment method or fee often used in scam requests.",
      points: 32,
      matchedText: content.match(paymentPattern)?.[0],
    });
  }

  if (jobFeePattern.test(content)) {
    addFinding({
      id: "job-fee",
      label: "Job-related fee mentioned",
      detail: "Legitimate employers generally do not require applicants to pay upfront fees.",
      points: 28,
      matchedText: content.match(jobFeePattern)?.[0],
    });
  } else if (remoteJobPattern.test(content)) {
    addFinding({
      id: "remote-job",
      label: "Remote-work offer mentioned",
      detail: "A remote-work offer alone is not proof of fraud; verify the employer independently.",
      points: 10,
      matchedText: content.match(remoteJobPattern)?.[0],
    });
  }

  const urls = content.match(urlPattern) ?? [];
  if (urls.length > 0) {
    const hosts = urls.map((url) => {
      try {
        return new URL(url).hostname.toLowerCase();
      } catch {
        return "";
      }
    });
    const shortened = hosts.some((host) => shortenerHosts.has(host));
    addFinding({
      id: "links",
      label: shortened ? "Shortened link found" : "Link included in the message",
      detail: shortened
        ? "Shortened links hide their destination. Check the full address before opening."
        : "A link is not proof of fraud. Confirm its destination before opening it.",
      points: shortened ? 22 : 8,
      matchedText: urls[0],
    });
  }

  const riskScore = Math.min(100, findings.reduce((total, finding) => total + finding.points, 0));
  const riskLevel = classifyScore(riskScore);
  const recommendations = [
    "Contact the organization using contact details you find independently.",
    "Never share a password or sign-in code in response to an unexpected message.",
  ];

  if (urls.length > 0) {
    recommendations.unshift("Avoid opening the link; visit the official site or app directly.");
  }
  if (riskLevel === "High") {
    recommendations.unshift("Pause before replying, paying, or sharing personal information.");
  }
  if (findings.length === 0) {
    recommendations.unshift(
      "No demo rules matched. That does not confirm the message is safe.",
    );
  }

  return {
    id,
    scannedAt,
    content,
    scanType: "message",
    riskLevel,
    riskScore,
    findings,
    recommendations,
  };
}