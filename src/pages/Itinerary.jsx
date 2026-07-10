import { useState } from "react";
import { Link } from "react-router-dom";
import destinations from "../data/destinations";
import SafeImage from "../components/SafeImage";

const GOAL_KEY = "travel-budget-goal";

export default function Itinerary({ stops, addStop, removeStop, updateDays, moveStop, clearItinerary, totalDays }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [budgetGoal, setBudgetGoal] = useState(() => {
    try { return Number(localStorage.getItem(GOAL_KEY)) || 0; } catch { return 0; }
  });
  const [copied, setCopied] = useState(false);

  const stopDestinations = stops
    .map((s) => ({ ...s, dest: destinations.find((d) => d.id === s.destId) }))
    .filter((s) => s.dest);

  const totalBudgetMin = stopDestinations.reduce((sum, s) => sum + (s.dest.budget?.min || 0) * s.days, 0);
  const totalBudgetMax = stopDestinations.reduce((sum, s) => sum + (s.dest.budget?.max || 0) * s.days, 0);

  const available = destinations.filter(
    (d) => !stops.some((s) => s.destId === d.id) &&
      (search === "" || d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1">🗓️ Your Itinerary</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stops.length === 0
              ? "Start planning your adventure by adding destinations"
              : `${stops.length} stop${stops.length > 1 ? "s" : ""} · ${totalDays} day${totalDays > 1 ? "s" : ""} · $${totalBudgetMin.toLocaleString()}–$${totalBudgetMax.toLocaleString()} estimated total`
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAdd(true)}
            className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer border-0">
            + Add Stop
          </button>
          {stops.length > 0 && (
            <button onClick={clearItinerary}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer border-0">
              🗑️ Clear
            </button>
          )}
        </div>
      </div>

      {stops.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl">🗺️</span>
          <p className="text-gray-500 dark:text-gray-400 text-lg mt-4 mb-6">No stops in your itinerary yet</p>
          <button onClick={() => setShowAdd(true)}
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors cursor-pointer border-0">
            + Add Your First Destination
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-12 bottom-12 w-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

          <div className="space-y-4">
            {stopDestinations.map((stop, idx) => {
              const d = stop.dest;
              const costMin = (d.budget?.min || 0) * stop.days;
              const costMax = (d.budget?.max || 0) * stop.days;

              return (
                <div key={d.id} className="relative flex items-start gap-4 group">
                  {/* Timeline dot */}
                  <div className="hidden sm:flex flex-shrink-0 w-12 justify-center pt-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Stop card */}
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-5">
                    <div className="flex items-start gap-4">
                      <Link to={`/destination/${d.id}`} className="flex-shrink-0 no-underline">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden">
                          <SafeImage src={d.image} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link to={`/destination/${d.id}`} className="no-underline">
                              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base hover:text-primary transition-colors">
                                {d.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400">{d.region}</span>
                              <span className="text-xs font-bold text-accent">★ {d.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {d.budget && (
                              <span className="text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                                ${d.budget.min}–${d.budget.max}/day
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Stay:</span>
                            <div className="flex items-center gap-1">
                              <button onClick={() => updateDays(d.id, stop.days - 1)}
                                className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer border-0 flex items-center justify-center">
                                –
                              </button>
                              <span className="w-8 text-center font-bold text-gray-900 dark:text-white text-sm">{stop.days}</span>
                              <button onClick={() => updateDays(d.id, stop.days + 1)}
                                className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer border-0 flex items-center justify-center">
                                +
                              </button>
                              <span className="text-xs text-gray-400 ml-1">days</span>
                            </div>
                          </div>
                          <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                            ${costMin.toLocaleString()}–${costMax.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions row */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => moveStop(d.id, -1)} disabled={idx === 0}
                          className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors cursor-pointer border-0">
                          ↑
                        </button>
                        <button onClick={() => moveStop(d.id, 1)} disabled={idx === stopDestinations.length - 1}
                          className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors cursor-pointer border-0">
                          ↓
                        </button>
                        <span className="text-[10px] text-gray-400">Reorder</span>
                      </div>
                      <button onClick={() => removeStop(d.id)}
                        className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors cursor-pointer bg-transparent border-0">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary card */}
          <div className="mt-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-5 border border-primary/20 dark:border-primary/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-2xl font-extrabold text-primary">{stops.length}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium uppercase tracking-wide">Stops</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-accent">{totalDays}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium uppercase tracking-wide">Total Days</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-green-600 dark:text-green-400">${totalBudgetMin.toLocaleString()}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium uppercase tracking-wide">Min Budget</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">${totalBudgetMax.toLocaleString()}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium uppercase tracking-wide">Max Budget</p>
              </div>
            </div>
          </div>

          {/* Budget Goal */}
          {totalBudgetMax > 0 && (
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">💰 Trip Budget Goal</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">$</span>
                  <input type="number" min={0} step={100} value={budgetGoal || ""}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setBudgetGoal(v);
                      localStorage.setItem(GOAL_KEY, String(v));
                    }}
                    placeholder="Set a budget..."
                    className="w-28 px-3 py-1.5 text-sm font-semibold border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              {budgetGoal > 0 && (
                <>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (totalBudgetMax / budgetGoal) * 100)}%`,
                        background: totalBudgetMax <= budgetGoal
                          ? "linear-gradient(90deg, #22c55e, #16a34a)"
                          : "linear-gradient(90deg, #f97316, #ef4444)",
                      }} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      ${totalBudgetMin.toLocaleString()}–${totalBudgetMax.toLocaleString()} estimated
                    </span>
                    <span className={`font-semibold ${
                      totalBudgetMax <= budgetGoal
                        ? "text-green-600 dark:text-green-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}>
                      {totalBudgetMax <= budgetGoal
                        ? `$${(budgetGoal - totalBudgetMax).toLocaleString()} remaining`
                        : `$${(totalBudgetMax - budgetGoal).toLocaleString()} over budget`}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Export */}
          {stopDestinations.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <button onClick={() => {
                const lines = stopDestinations.map((s, i) =>
                  `${i + 1}. ${s.dest.name} — ${s.days} day${s.days > 1 ? "s" : ""} ($${(s.dest.budget?.min || 0) * s.days}–$${(s.dest.budget?.max || 0) * s.days})`
                );
                const text = [
                  "🗓️ Adventure Atlas — Trip Itinerary",
                  "─".repeat(40),
                  ...lines,
                  "─".repeat(40),
                  `Total: ${stopDestinations.length} stops · ${totalDays} days · $${totalBudgetMin.toLocaleString()}–$${totalBudgetMax.toLocaleString()}`,
                  "",
                  "Plan your own at adventure-atlas.app",
                ].join("\n");
                navigator.clipboard.writeText(text).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer border-0">
                📤 Export Trip
              </button>
              {copied && (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium animate-pulse">Copied! ✓</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Destination Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add to Itinerary</h2>
              <button onClick={() => setShowAdd(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer bg-transparent border-0">✕</button>
            </div>
            <div className="px-6 py-3">
              <input type="text" placeholder="Search destinations..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex-1 overflow-auto px-6 pb-4 space-y-1">
              {available.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">
                  {search ? "No destinations match your search" : "All destinations already in your itinerary"}
                </p>
              ) : (
                available.map((d) => (
                  <button key={d.id} onClick={() => { addStop(d.id); setShowAdd(false); }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left cursor-pointer border-0 bg-transparent">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <SafeImage src={d.image} alt={d.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{d.name}</p>
                      <p className="text-xs text-gray-400">{d.region} · {d.budget ? `$${d.budget.min}–$${d.budget.max}/day` : ""}</p>
                    </div>
                    <span className="text-primary font-bold text-lg">+</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
