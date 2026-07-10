const monthNames = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const monthAbbr = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parseMonth(text) {
  const t = text.trim().toLowerCase().replace(/[()]/g, "");
  // Try full name
  const idx = monthNames.indexOf(t);
  if (idx !== -1) return idx;
  // Try abbreviation
  const short = t.slice(0, 3);
  if (monthAbbr[short] !== undefined) return monthAbbr[short];
  return -1;
}

export function parseBestTimeRanges(bestTime) {
  if (!bestTime) return [];
  // Split on & or , that's followed by a month name
  // First normalize: split on '&' and ',' separately
  const segments = bestTime.split(/[,&]/).map((s) => s.trim()).filter(Boolean);
  const ranges = [];

  for (const seg of segments) {
    // Extract month-month patterns like "April to October" or "June to August"
    const match = seg.match(/([a-zA-Z]+)\s*(?:to|–|-)\s*([a-zA-Z]+)/);
    if (match) {
      const start = parseMonth(match[1]);
      const end = parseMonth(match[2]);
      if (start !== -1 && end !== -1) {
        ranges.push({ start, end });
      }
    }
  }
  return ranges;
}

export function isInBestTime(bestTime) {
  const ranges = parseBestTimeRanges(bestTime);
  if (ranges.length === 0) return false;
  const now = new Date().getMonth(); // 0-11
  return ranges.some((r) => {
    if (r.start <= r.end) {
      return now >= r.start && now <= r.end;
    } else {
      // Wrapping range (e.g., December to March)
      return now >= r.start || now <= r.end;
    }
  });
}

export function getSeasonEmoji(bestTime) {
  const ranges = parseBestTimeRanges(bestTime);
  if (ranges.length === 0) return "🌤️";
  const now = new Date().getMonth();
  const inSeason = ranges.some((r) => {
    if (r.start <= r.end) return now >= r.start && now <= r.end;
    return now >= r.start || now <= r.end;
  });
  return inSeason ? "✅" : "⏳";
}
