import { useState, useMemo } from "react";
import { parseBestTimeRanges } from "../utils/bestTime";

const regions = [
  "All", "Europe", "Asia", "North America", "South America",
  "Africa", "Oceania", "Middle East", "Caribbean", "Central America",
];

const budgetTiers = [
  { key: "all", label: "Any Budget" },
  { key: "budget", label: "🟢 Budget", max: 50 },
  { key: "moderate", label: "🔵 Moderate", min: 50, max: 120 },
  { key: "premium", label: "🟣 Premium", min: 120 },
];

const vibeList = [
  { key: "all", label: "All Vibes" },
  { key: "beach", label: "🏖️ Beach" }, { key: "adventure", label: "🏔️ Adventure" },
  { key: "romance", label: "💑 Romance" }, { key: "culture", label: "🏛️ Culture" },
  { key: "foodie", label: "🍜 Foodie" }, { key: "nature", label: "🌿 Nature" },
  { key: "nightlife", label: "🌙 Nightlife" }, { key: "luxury", label: "💎 Luxury" },
  { key: "family", label: "👨‍👩‍👧‍👦 Family" }, { key: "backpacker", label: "🎒 Backpacker" },
];

const months = [
  "Any Month", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function matchesMonth(dest, monthIdx) {
  if (monthIdx === -1) return true;
  const ranges = parseBestTimeRanges(dest.bestTime);
  if (ranges.length === 0) return true;
  return ranges.some((r) => {
    if (r.start <= r.end) return monthIdx >= r.start && monthIdx <= r.end;
    return monthIdx >= r.start || monthIdx <= r.end;
  });
}

export default function SearchBar({ destinations, onFilter }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [budgetTier, setBudgetTier] = useState("all");
  const [vibe, setVibe] = useState("all");
  const [month, setMonth] = useState(-1);

  useMemo(() => {
    const filtered = destinations.filter((d) => {
      const q = query.toLowerCase();
      const matchesQuery =
        query === "" ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        (d.famousFor || []).some((item) => item.toLowerCase().includes(q));
      const matchesRegion = region === "All" || d.region === region;

      let matchesBudget = true;
      if (budgetTier !== "all" && d.budget) {
        const tier = budgetTiers.find((t) => t.key === budgetTier);
        if (tier) {
          const { min = 0, max = Infinity } = tier;
          matchesBudget =
            (d.budget.min >= min || d.budget.max >= min) &&
            (d.budget.max <= max || d.budget.min <= max);
        }
      }

      const matchesVibe = vibe === "all" || (d.vibes || []).includes(vibe);
      const matchesMonth = month === -1 || matchesMonth(d, month);

      return matchesQuery && matchesRegion && matchesBudget && matchesVibe && matchesMonth;
    });
    onFilter(filtered);
  }, [query, region, budgetTier, vibe, month, destinations, onFilter]);

  return (
    <div className="mb-8 space-y-3">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input type="text" placeholder="Search destinations, countries, or attractions..."
          value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-base transition-all" />
      </div>

      <div className="flex flex-wrap gap-2">
        {regions.map((r) => (
          <button key={r} onClick={() => setRegion(r)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              region === r
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}>
            {r === "All" ? "🌍 All Regions" : r}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {budgetTiers.map((t) => (
          <button key={t.key} onClick={() => setBudgetTier(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              budgetTier === t.key
                ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {vibeList.map((v) => (
          <button key={v.key} onClick={() => setVibe(v.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              vibe === v.key
                ? "bg-pink-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}>
            {v.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {months.map((m, i) => (
          <button key={m} onClick={() => setMonth(i - 1)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              month === i - 1
                ? "bg-green-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}>
            {i === 0 ? "📅 Any" : m}
          </button>
        ))}
      </div>
    </div>
  );
}
