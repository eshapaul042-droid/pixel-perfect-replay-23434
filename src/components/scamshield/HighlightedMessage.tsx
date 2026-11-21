import type { ScanFinding } from "@/lib/scam-analysis";

interface HighlightedMessageProps {
  content: string;
  findings: ScanFinding[];
}

export function HighlightedMessage({ content, findings }: HighlightedMessageProps) {
  const ranges = findings
    .flatMap((finding) => {
      if (!finding.matchedText) return [];
      const start = content.toLowerCase().indexOf(finding.matchedText.toLowerCase());
      return start < 0 ? [] : [{ start, end: start + finding.matchedText.length }];
    })
    .sort((left, right) => left.start - right.start);

  const segments: Array<{ text: string; highlighted: boolean; key: number }> = [];
  let cursor = 0;
  for (const range of ranges) {
    if (range.start < cursor) continue;
    if (range.start > cursor) {
      segments.push({ text: content.slice(cursor, range.start), highlighted: false, key: cursor });
    }
    segments.push({ text: content.slice(range.start, range.end), highlighted: true, key: range.start });
    cursor = range.end;
  }
  if (cursor < content.length) {
    segments.push({ text: content.slice(cursor), highlighted: false, key: cursor });
  }

  return (
    <blockquote className="scanned-message">
      {segments.map((segment) =>
        segment.highlighted ? (
          <mark className="matched-phrase" key={segment.key}>{segment.text}</mark>
        ) : (
          <span key={segment.key}>{segment.text}</span>
        ),
      )}
    </blockquote>
  );
}