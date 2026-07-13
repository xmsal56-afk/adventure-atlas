import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import destinations from "../data/destinations";
import { isInBestTime } from "../utils/bestTime";
import SafeImage from "../components/SafeImage";

const regions = ["All", "Europe", "Asia", "North America", "South America", "Africa", "Oceania", "Middle East", "Caribbean", "Central America"];

export default function CostIndex() {
  const [region, setRegion] = useState("All");
  const [tier, setTier] = useState("all");

  const maxBudget = Math.max(...destinations.map((d) => d.budget?.max || 0));

  const filtered = useMemo(() => {
    return destinations
      .filter((d) => d.budget)
      .filter((d) => region === "All" || d.region === region)
      .filter((d) => {
        if (tier === "all") return true;
        if (tier === "budget") return d.budget.max <= 50;
        if (tier === "moderate") return d.budget.min >= 50 && d.budget.max <= 120;
        if (tier === "premium") return d.budget.min >= 120;
        return true;
      })
      .sort((a, b) => (a.budget?.min || 0) - (b.budget?.min || 0));
  }, [region, tier]);

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">📊 Travel Cost Index</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          All 45 destinations ranked by estimated daily budget — from backpacker-friendly to premium escapes
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
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
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { key: "all", label: "All Tiers" },
          { key: "budget", label: "🟢 Budget (≤$50)" },
          { key: "moderate", label: "🔵 Moderate ($50–$120)" },
          { key: "premium", label: "🟣 Premium ($120+)" },
        ].map((t) => (
          <button key={t.key} onClick={() => setTier(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              tier === t.key
                ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Ranking */}
      <div className="space-y-2">
        {filtered.map((d, idx) => {
          const avg = Math.round(((d.budget.min + d.budget.max) / 2));
          const pct = (d.budget.max / maxBudget) * 100;
          const barColor = d.budget.max <= 50
            ? "bg-green-500"
            : d.budget.min >= 120
            ? "bg-purple-500"
            : "bg-blue-500";

          return (
            <Link key={d.id} to={`/destination/${d.id}`}
              className="block group no-underline">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md transition-all overflow-hidden">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Rank + Image */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx < 5 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : idx < 15 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <SafeImage src={d.image} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </div>

                  {/* Name + Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                        {d.name}
                      </h3>
                      {isInBestTime(d.bestTime) && (
                        <span className="text-[10px]">✅</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{d.region}</span>
                      <span>·</span>
                      <span className="font-bold text-accent">★ {d.rating}</span>
                    </div>
                  </div>

                  {/* Budget Bar + Value */}
                  <div className="flex-shrink-0 text-right w-28 sm:w-36">
                    <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                      ${d.budget.min}–${d.budget.max}
                    </div>
                    <div className="text-[10px] text-gray-400 mb-1">USD / day</div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden w-full max-w-[120px] ml-auto">
                      <div className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.max(pct, 4)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl">🔍</span>
          <p className="text-gray-500 mt-4">No destinations match the selected filters</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">💡 How to Read This</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
            <span><strong>Budget (≤$50/day)</strong> — Hostels, street food, local transport. Perfect for backpackers.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
            <span><strong>Moderate ($50–$120/day)</strong> — Mid-range hotels, nice meals, some activities.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0" />
            <span><strong>Premium ($120+/day)</strong> — Luxury resorts, fine dining, premium experiences.</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">✅ = currently in peak season &mdash; great time to visit!</p>
      </div>
    </div>
  );
}
