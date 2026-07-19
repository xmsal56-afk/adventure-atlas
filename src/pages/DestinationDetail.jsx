import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import destinations from "../data/destinations";
import SafeImage from "../components/SafeImage";
import { isInBestTime } from "../utils/bestTime";

const vibeEmoji = {
  beach: "🏖️", adventure: "🏔️", romance: "💑", culture: "🏛️",
  foodie: "🍜", nature: "🌿", nightlife: "🌙", luxury: "💎",
  family: "👨‍👩‍👧‍👦", backpacker: "🎒",
};

export default function DestinationDetail({ isBookmarked, onToggleBookmark, getNote, updateNote, addRecent, departureAirport = "NYC", onAddToItinerary }) {
  const params = useParams();
  const id = Number(params?.id);
  const navigate = useNavigate();
  const destination = destinations?.find?.((d) => d?.id === id);
  const currentIndex = destination ? destinations.indexOf(destination) : -1;

  const [collapsed, setCollapsed] = useState({});
  const [noteText, setNoteText] = useState("");
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    if (!id) return;
    try {
      const views = JSON.parse(localStorage.getItem("travel-views") || "{}");
      views[id] = (views[id] || 0) + 1;
      localStorage.setItem("travel-views", JSON.stringify(views));
    } catch {}
  }, [id]);

  useEffect(() => {
    if (addRecent && destination) addRecent(destination.id);
  }, [id, destination, addRecent]);

  useEffect(() => {
    if (getNote && destination) setNoteText(getNote(destination.id));
  }, [id, getNote, destination]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  // SEO: set page title and meta description per destination
  useEffect(() => {
    if (!destination) return;
    document.title = `${destination.name} — Adventure Atlas`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content",
      `Explore ${destination.name}, ${destination.country}. ${destination.shortDescription || destination.description?.slice(0, 120)}`
    );
  }, [destination]);

  const handleNoteSave = () => {
    if (updateNote && destination) updateNote(destination.id, noteText);
  };

  const goRandom = () => {
    const others = destinations.filter((d) => d.id !== id);
    const pick = others[Math.floor(Math.random() * others.length)];
    if (pick) navigate(`/destination/${pick.id}`);
  };

  const goNext = () => {
    const next = destinations[currentIndex + 1];
    if (next) navigate(`/destination/${next.id}`);
  };

  const goPrev = () => {
    const prev = destinations[currentIndex - 1];
    if (prev) navigate(`/destination/${prev.id}`);
  };

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  const toggleSection = (key) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const { name, description, image, rating, region, country, bestTime, currency, language, famousFor, exchangeRate, budget, vibes, flightTimes, visaInfo, mustEat, topAttractions, localPhrases, gettingAround, familiarChains } = destination || {};

  const flightHours = flightTimes?.[departureAirport];
  const related = destinations.filter((d) => d?.id !== destination?.id && d?.region === region).slice(0, 3);
  const allRelated = related.length >= 3 ? related : [...related, ...destinations.filter((d) => d?.id !== destination?.id && !related.includes(d)).slice(0, 3 - related.length)];
  const valueInfo = exchangeRate && typeof exchangeRate === "number"
    ? exchangeRate === 1 ? { label: "Same as USD", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" }
    : exchangeRate < 1 ? { label: "Premium - USD buys less", color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" }
    : exchangeRate <= 5 ? { label: "Fair - roughly on par", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" }
    : { label: "Bargain - USD goes far", color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" }
    : null;
  const budgetInfo = budget
    ? budget.max <= 50 ? { tier: "Budget", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" }
    : budget.min >= 120 ? { tier: "Premium", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" }
    : { tier: "Moderate", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" }
    : null;
  const isPeak = isInBestTime(destination?.bestTime);

  if (!destination) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-gray-500 text-lg">Destination not found</p>
        <Link to="/" className="text-primary no-underline mt-4 inline-block">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Top nav */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <Link to="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-primary no-underline text-sm sm:text-base">← Back</Link>
        <div className="flex items-center gap-2">
          {currentIndex > 0 && (
            <button onClick={goPrev} className="text-gray-400 hover:text-primary text-sm cursor-pointer bg-transparent border-0 px-2 py-1">‹ Prev</button>
          )}
          <span className="text-xs text-gray-400">{currentIndex + 1} / {destinations.length}</span>
          {currentIndex < destinations.length - 1 && (
            <button onClick={goNext} className="text-gray-400 hover:text-primary text-sm cursor-pointer bg-transparent border-0 px-2 py-1">Next ›</button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative h-48 sm:h-64 md:h-80">
          <SafeImage src={image} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-700">{region}</span>
                <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-700">{country}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{name}</h1>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          {/* Rating + Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-accent text-xl">★</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{rating}</span>
              <span className="text-gray-400 text-sm">/ 5.0</span>
            </div>
            {budgetInfo && <span className={"text-xs font-semibold px-3 py-1 rounded-full " + budgetInfo.bg + " " + budgetInfo.color}>{budgetInfo.tier}</span>}
            {valueInfo && typeof valueInfo.color === "string" && <span className={"text-xs font-semibold px-3 py-1 rounded-full " + valueInfo.color}>{valueInfo.label}</span>}
          </div>

          {/* Vibes */}
          {vibes && vibes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {vibes.map((v) => (
                <span key={v} className="bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 font-medium px-3 py-1.5 rounded-full text-xs flex items-center gap-1">
                  <span>{vibeEmoji[v] || "🏷️"}</span>
                  <span className="capitalize">{v}</span>
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-8">{description}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
            {bestTime && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4">
                <span className="text-xs text-gray-400 block">Best Time</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">{bestTime}</span>
              </div>
            )}
            {currency && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4">
                <span className="text-xs text-gray-400 block">Currency</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">{currency}</span>
                {exchangeRate !== undefined && <span className="block text-[10px] text-gray-400 mt-0.5">1 USD ≈ {exchangeRate}</span>}
              </div>
            )}
            {budget && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4">
                <span className="text-xs text-gray-400 block">Daily Budget</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">${budget.min}–${budget.max}</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">USD</span>
              </div>
            )}
            {language && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4">
                <span className="text-xs text-gray-400 block">Language</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">{language}</span>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4">
              <span className="text-xs text-gray-400 block">Region</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">{region}</span>
            </div>
            {flightHours !== undefined && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4">
                <span className="text-xs text-gray-400 block">Flight</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">{flightHours}h</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">from {departureAirport}</span>
              </div>
            )}
            {visaInfo && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4">
                <span className="text-xs text-gray-400 block">Visa (US)</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">{visaInfo}</span>
              </div>
            )}
          </div>

          {/* Famous For */}
          {famousFor && famousFor.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mb-3">Famous For</h2>
              <div className="flex flex-wrap gap-2">
                {famousFor.map((f) => (
                  <span key={f} className="bg-blue-50 dark:bg-blue-900/30 text-primary font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Collapsible: Familiar Eats */}
          {familiarChains && familiarChains.length > 0 && (
            <div className="mb-4 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
              <button onClick={() => toggleSection("familiar")} className="w-full flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors cursor-pointer border-0 text-left">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">🍟 Familiar Eats <span className="text-xs text-gray-400 font-normal">({familiarChains.length})</span></h3>
                <span className="text-gray-400 text-lg">{collapsed.familiar ? "+" : "−"}</span>
              </button>
              {!collapsed.familiar && (
                <div className="p-4 pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Know you can find these familiar chains if you need a taste of home</p>
                  <div className="flex flex-wrap gap-2">
                    {familiarChains.map((f) => (
                      <span key={f} className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-medium px-3 py-1.5 rounded-full text-xs border border-yellow-200 dark:border-yellow-800/50">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Collapsible: Must Eat & Attractions */}
          {mustEat && mustEat.length > 0 && topAttractions && topAttractions.length > 0 && (
            <div className="mb-4 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
              <button onClick={() => toggleSection("eat")} className="w-full flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors cursor-pointer border-0 text-left">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">🍜 Food & Attractions <span className="text-xs text-gray-400 font-normal">({mustEat.length + topAttractions.length})</span></h3>
                <span className="text-gray-400 text-lg">{collapsed.eat ? "+" : "−"}</span>
              </button>
              {!collapsed.eat && (
                <div className="p-4 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-xs mb-2 uppercase tracking-wide">🍜 Must-Eat Foods</h4>
                    <div className="flex flex-wrap gap-2">
                      {mustEat.map((e) => (
                        <span key={e} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium px-3 py-1.5 rounded-full text-xs shadow-sm">{e}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-xs mb-2 uppercase tracking-wide">📍 Top Attractions</h4>
                    <ol className="space-y-1.5">
                      {topAttractions.map((a, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                          {a}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Collapsible: Getting Around */}
          {gettingAround && (
            <div className="mb-4 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
              <button onClick={() => toggleSection("transport")} className="w-full flex items-center justify-between p-4 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors cursor-pointer border-0 text-left">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">🚕 Getting Around</h3>
                <span className="text-gray-400 text-lg">{collapsed.transport ? "+" : "−"}</span>
              </button>
              {!collapsed.transport && <div className="p-4 pt-2"><p className="text-sm text-gray-700 dark:text-gray-300">{gettingAround}</p></div>}
            </div>
          )}

          {/* Collapsible: Phrases */}
          {localPhrases && localPhrases.length > 0 && (
            <div className="mb-4 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
              <button onClick={() => toggleSection("phrases")} className="w-full flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer border-0 text-left">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">💬 Useful Phrases <span className="text-xs text-gray-400 font-normal">({localPhrases.length})</span></h3>
                <span className="text-gray-400 text-lg">{collapsed.phrases ? "+" : "−"}</span>
              </button>
              {!collapsed.phrases && (
                <div className="p-4 pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {localPhrases.map((p) => (
                      <div key={p} className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-center shadow-sm">
                        <p className="text-xs text-gray-400">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Peak Season Banner */}
          {isPeak && destination && (
            <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-2xl">🌿</span>
              <div>
                <h3 className="font-bold text-green-800 dark:text-green-300 text-sm">Peak Season - Now is a great time to visit!</h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">{bestTime}</p>
              </div>
            </div>
          )}

          {/* Trip Note */}
          {updateNote && (
            <div className="mb-8 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-700/50">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">📝 Your Trip Note</h2>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} onBlur={handleNoteSave}
                placeholder="e.g. Best time to visit is October. Budget around $1500." rows={2}
                className="w-full bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
              <p className="text-xs text-gray-400 mt-1">Saved automatically.</p>
            </div>
          )}

          {/* Related */}
          {allRelated && allRelated.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">{related.length ? "More in " + region : "You Might Also Like"}</h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-4">{related.length ? "Other destinations in " + region : "Handpicked destinations you might enjoy"}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {allRelated.map((dest) => (
                  <Link key={dest.id} to={"/destination/" + dest.id} className="group block bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all no-underline">
                    <div className="h-24 sm:h-32 overflow-hidden">
                      <SafeImage src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-2 sm:p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wide">{dest.region}</span>
                        <span className="text-[10px] sm:text-xs font-bold text-accent">★ {dest.rating}</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{dest.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
            <button onClick={goRandom} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-medium text-sm cursor-pointer bg-transparent border-0">🎲 Show me another</button>
          </div>
        </div>
      </div>
    </div>
  );
}
