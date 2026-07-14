import { useState } from "react";
import { Link } from "react-router-dom";
import destinations from "../data/destinations";

export default function BudgetCalculator() {
  const [budget, setBudget] = useState(2000);
  const [days, setDays] = useState(7);
  const [region, setRegion] = useState("all");
  const [vibe, setVibe] = useState("all");

  const regions = ["all", ...new Set(destinations.map(d => d.region))];
  const vibes = ["all", "beach","adventure","culture","foodie","nature","nightlife","romance","luxury","family","backpacker"];

  const results = destinations.filter(d => {
    if (region !== "all" && d.region !== region) return false;
    if (vibe !== "all" && !d.vibes?.includes(vibe)) return false;
    if (!d.budget) return false;
    const dailyCost = d.budget.min || d.budget.max || 100;
    const totalCost = dailyCost * days;
    const flightCost = d.flightTimes?.NYC ? d.flightTimes.NYC * 80 : 500;
    return totalCost + flightCost <= budget;
  }).sort((a, b) => {
    const aCost = (a.budget?.min || 100) * days + (a.flightTimes?.NYC || 6) * 80;
    const bCost = (b.budget?.min || 100) * days + (b.flightTimes?.NYC || 6) * 80;
    return aCost - bCost;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">💰 Budget Calculator</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">I have <strong className="text-primary">${budget}</strong> for <strong className="text-primary">{days}</strong> days — where can I go?</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">💰 Budget (USD)</label>
            <input type="range" min="500" max="10000" step="100" value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$500</span>
              <span className="font-bold text-primary text-sm">${budget}</span>
              <span>$10,000</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">📅 Days</label>
            <input type="range" min="1" max="30" value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span className="font-bold text-primary text-sm">{days} days</span>
              <span>30</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🌍 Region</label>
            <select value={region} onChange={e => setRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm">
              {regions.map(r => <option key={r} value={r}>{r === "all" ? "Any Region" : r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🎯 Vibe</label>
            <select value={vibe} onChange={e => setVibe(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm">
              {vibes.map(v => <option key={v} value={v}>{v === "all" ? "Any Vibe" : v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <span className="text-5xl">😅</span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3">No destinations found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try increasing your budget or reducing the number of days.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{results.length} destinations within your budget, sorted cheapest first</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.slice(0, 20).map(d => {
              const dailyCost = d.budget?.min || d.budget?.max || 100;
              const flightCost = d.flightTimes?.NYC ? Math.round(d.flightTimes.NYC * 80) : 500;
              const total = dailyCost * days + flightCost;
              const remaining = budget - total;
              return (
                <Link key={d.id} to={`/destination/${d.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow no-underline">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{d.name}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      remaining > 300 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      remaining > 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {remaining >= 0 ? `$${remaining} left` : `-$${Math.abs(remaining)} over`}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p>✈️ Flight: ~${flightCost}</p>
                    <p>🏨 Daily: ~${dailyCost}</p>
                    <p>💵 Total: ~${total}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                    <span>⭐ {d.rating}</span>
                    <span>📍 {d.region}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          {results.length > 20 && (
            <p className="text-center text-sm text-gray-400 mt-4">+{results.length - 20} more destinations. Refine your filters to narrow it down.</p>
          )}
        </>
      )}
    </div>
  );
}
