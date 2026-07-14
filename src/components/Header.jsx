import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import destinations from "../data/destinations";
import LoginButton from "./LoginButton";

const airports = {
  NYC: { label: "New York (JFK)", region: "US Northeast" },
  ATL: { label: "Atlanta (ATL)", region: "US Southeast" },
  MIA: { label: "Miami (MIA)", region: "US Southeast" },
  ORD: { label: "Chicago (ORD)", region: "US Midwest" },
  DFW: { label: "Dallas (DFW)", region: "US South" },
  SEA: { label: "Seattle (SEA)", region: "US Northwest" },
  LAX: { label: "Los Angeles (LAX)", region: "US West" },
  LON: { label: "London (LHR)", region: "Europe" },
  FRA: { label: "Frankfurt (FRA)", region: "Europe" },
  DXB: { label: "Dubai (DXB)", region: "Middle East" },
  TYO: { label: "Tokyo (NRT)", region: "Asia" },
  SYD: { label: "Sydney (SYD)", region: "Oceania" },
};

const airportCoords = {
  NYC: [40.64, -73.78], ATL: [33.64, -84.43], MIA: [25.79, -80.29],
  ORD: [41.98, -87.90], DFW: [32.90, -97.04], SEA: [47.45, -122.31],
  LAX: [33.94, -118.41], LON: [51.47, -0.45], FRA: [50.03, 8.56],
  DXB: [25.25, 55.36], TYO: [35.77, 140.39], SYD: [-33.95, 151.18],
};

export default function Header({ bookmarkCount, itineraryCount, darkMode, onToggleDarkMode, departureAirport, onDepartureChange }) {
  const navigate = useNavigate();
  const [locating, setLocating] = useState(false);
  const [locMsg, setLocMsg] = useState("");

  const goRandom = () => {
    const random = destinations[Math.floor(Math.random() * destinations.length)];
    navigate(`/destination/${random.id}`);
  };

  const findNearest = () => {
    if (!navigator.geolocation) {
      setLocMsg("Geolocation not available");
      setTimeout(() => setLocMsg(""), 2000);
      return;
    }
    setLocating(true);
    setLocMsg("Locating...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const alat = pos.coords.latitude;
        const alon = pos.coords.longitude;
        let nearest = null;
        let minDist = Infinity;
        for (const [code, [clat, clon]] of Object.entries(airportCoords)) {
          // Quick great-circle
          const R = 3959;
          const φ1 = alat * Math.PI / 180, φ2 = clat * Math.PI / 180;
          const Δφ = (clat - alat) * Math.PI / 180;
          const Δλ = (clon - alon) * Math.PI / 180;
          const a = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
          const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          if (d < minDist) { minDist = d; nearest = code; }
        }
        if (nearest) {
          onDepartureChange(nearest);
          setLocMsg(`📍 ${nearest} (${Math.round(minDist)} mi)`);
        }
        setTimeout(() => { setLocMsg(""); setLocating(false); }, 2000);
      },
      () => {
        setLocMsg("Location denied");
        setLocating(false);
        setTimeout(() => setLocMsg(""), 2000);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  const grouped = {};
  for (const [code, info] of Object.entries(airports)) {
    const region = info.region;
    if (!grouped[region]) grouped[region] = [];
    grouped[region].push({ code, ...info });
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
            <span className="text-xl sm:text-2xl">✈️</span>
            <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">Adventure Atlas</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Departure Airport */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/80 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5">
              <select value={departureAirport} onChange={(e) => onDepartureChange(e.target.value)}
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-semibold focus:outline-none cursor-pointer text-[10px] sm:text-xs max-w-[72px] sm:max-w-[100px] border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5"
                style={{ colorScheme: darkMode ? 'dark' : 'light' }}>
                {Object.entries(grouped).map(([region, airports]) => (
                  <optgroup key={region} label={region}>
                    {airports.map((a) => (
                      <option key={a.code} value={a.code}>{a.code} — {a.label.split(" (")[0]}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <button onClick={findNearest} disabled={locating}
                className="bg-transparent border-0 p-0.5 cursor-pointer text-xs hover:scale-110 transition-transform"
                title="Find nearest airport">
                {locating ? "⏳" : "📍"}
              </button>
            </div>
            {locMsg && (
              <span className="text-[10px] text-primary font-medium whitespace-nowrap animate-pulse">{locMsg}</span>
            )}

            <nav className="flex items-center gap-1.5 sm:gap-3">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors no-underline text-[11px] sm:text-sm">
                Explore
              </Link>
              <Link to="/cost-index" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors no-underline text-[11px] sm:text-sm">
                💰 Costs
              </Link>
              <Link to="/budget-calculator" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors no-underline text-[11px] sm:text-sm">
                📊 Budget
              </Link>
              <Link to="/itinerary" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors no-underline text-[11px] sm:text-sm">
                🗓️
                <span className="hidden sm:inline">Plan</span>
                {itineraryCount > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{itineraryCount}</span>
                )}
              </Link>
              <Link to="/price-tracker" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors no-underline text-[11px] sm:text-sm">
                📉 Prices
              </Link>
              <button onClick={goRandom}
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer bg-transparent border-0 text-xs sm:text-sm p-0.5">
                🎲
              </button>
              <Link to="/bookmarks" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors no-underline text-[11px] sm:text-sm">
                ⭐
                <span className="hidden sm:inline">Saved</span>
                {bookmarkCount > 0 && (
                  <span className="bg-accent text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{bookmarkCount}</span>
                )}
              </Link>
              <button onClick={onToggleDarkMode}
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer bg-transparent border-0 text-sm p-1"
                title={darkMode ? "Light mode" : "Dark mode"}>
                {darkMode ? "☀️" : "🌙"}
              </button>
              <LoginButton />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
