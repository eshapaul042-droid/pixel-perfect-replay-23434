import type { RiskLevel, ScanFinding, ScanResult } from "@/lib/scam-analysis";

export const URL_DEMO_RULES = [
  "Whether the address uses HTTPS",
  "Known URL-shortening domains that hide the final destination",
  "IP-address hosts instead of a readable domain name",
  "Punycode or embedded sign-in details in the address",
];

const shortenerHosts = new Set(["bit.ly", "tinyurl.com", "t.co", "cutt.ly", "rb.gy"]);
const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;

function riskLevelFor(score: number): RiskLevel {
  if (score >= 55) return "High";
  if (score >= 25) return "Medium";
  return "Low";
}

function addFinding(
  findings: ScanFinding[],
  finding: ScanFinding,
): void {
  findings.push(finding);
}

export function analyzeUrlDemo(
  content: string,
  id: string,
  scannedAt = new Date().toISOString(),
): ScanResult {
  const findings: ScanFinding[] = [];
  let parsed: URL | null = null;
  try {
    parsed = new URL(content);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") parsed = null;
  } catch {
    parsed = null;
  }

  if (!parsed) {
    addFinding(findings, {
      id: "invalid-url",
      label: "Address could not be read as a web link",
      detail: "Check that the address is complete and begins with http:// or https://.",
      points: 35,
      matchedText: content,
    });
  } else {
    const hostname = parsed.hostname.toLowerCase();
    if (parsed.protocol !== "https:") {
      addFinding(findings, {
        id: "no-https",
        label: "The address does not use HTTPS",
        detail: "The connection may not be encrypted. HTTPS alone also cannot prove a site is trustworthy.",
        points: 20,
        matchedText: parsed.protocol,
      });
    }
    if (shortenerHosts.has(hostname)) {
      addFinding(findings, {
        id: "shortened-url",
        label: "Shortened link hides its destination",
        detail: "This demo does not follow the link. Check its full destination through a trusted source.",
        points: 25,
        matchedText: hostname,
      });
    }
    if (ipv4Pattern.test(hostname)) {
      addFinding(findings, {
        id: "ip-host",
        label: "The address uses a numeric host",
        detail: "A numeric host can be harder to recognize. Verify the destination before opening it.",
        points: 35,
        matchedText: hostname,
      });
    }
    if (hostname.includes("xn--")) {
      addFinding(findings, {
        id: "punycode-host",
        label: "The domain uses encoded characters",
        detail: "Encoded domain names can resemble other names. Compare the address with the official one.",
        points: 25,
        matchedText: hostname,
      });
    }
    if (parsed.username || parsed.password) {
      addFinding(findings, {
        id: "embedded-credentials",
        label: "Sign-in details appear inside the address",
        detail: "A web address should not contain a username or password. Do not open it.",
        points: 35,
        matchedText: content,
      });
    }
  }

  const riskScore = Math.min(100, findings.reduce((total, finding) => total + finding.points, 0));
  const riskLevel = riskLevelFor(riskScore);
  const recommendations = [
    "If you need the service, type its official address yourself or use its official app.",
    "This local demo does not open the link, check its destination, or use live threat data.",
  ];
  if (findings.length === 0) {
    recommendations.unshift("No URL demo rules matched. That does not confirm the site is safe.");
  }

  return {
    id,
    scannedAt,
    content,
    scanType: "url",
    riskLevel,
    riskScore,
    findings,
    recommendations,
  };
}