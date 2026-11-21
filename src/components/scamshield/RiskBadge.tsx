import type { RiskLevel } from "@/lib/scam-analysis";

interface RiskBadgeProps {
  level: RiskLevel;
  compact?: boolean;
}

export function RiskBadge({ level, compact = false }: RiskBadgeProps) {
  return (
    <span className={`risk-pill risk-${level.toLowerCase()} ${compact ? "risk-pill-compact" : ""}`}>
      {level} demo signal
    </span>
  );
}