import { describe, expect, it } from "vitest";

import { analyzeMessageDemo } from "./scam-analysis";

describe("transparent demo scam analysis", () => {
  it("keeps unmatched messages low and explicitly avoids calling them safe", () => {
    const result = analyzeMessageDemo("Hello, our meeting is at 2 pm.", "scan-1");

    expect(result.riskScore).toBe(0);
    expect(result.riskLevel).toBe("Low");
    expect(result.recommendations[0]).toContain("does not confirm");
  });

  it("assigns a medium demo signal score to a request for account credentials", () => {
    const result = analyzeMessageDemo("Please verify your account now.", "scan-2");

    expect(result.riskScore).toBe(30);
    expect(result.riskLevel).toBe("Medium");
    expect(result.findings[0]?.id).toBe("credentials");
  });

  it("combines separate signals into a high demo signal score", () => {
    const result = analyzeMessageDemo(
      "Act now: verify your account and pay with gift cards.",
      "scan-3",
    );

    expect(result.riskScore).toBe(86);
    expect(result.riskLevel).toBe("High");
    expect(result.findings).toHaveLength(3);
  });

  it("treats a shortened URL as a stronger link signal than an ordinary link", () => {
    const ordinary = analyzeMessageDemo("Read https://example.com/notice", "scan-4");
    const shortened = analyzeMessageDemo("Read https://bit.ly/notice", "scan-5");

    expect(ordinary.riskScore).toBe(8);
    expect(shortened.riskScore).toBe(22);
    expect(shortened.findings[0]?.label).toBe("Shortened link found");
  });
});