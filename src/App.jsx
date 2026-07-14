import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import useBookmarks from "./hooks/useBookmarks";
import useRecentlyViewed from "./hooks/useRecentlyViewed";
import useItinerary from "./hooks/useItinerary";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import AuthModal from "./components/AuthModal";
import ErrorBoundary from "./components/ErrorBoundary";
import { SkeletonGrid } from "./components/SkeletonCard";
import Home from "./pages/Home";

const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const DestinationDetail = lazy(() => import("./pages/DestinationDetail"));
const Itinerary = lazy(() => import("./pages/Itinerary"));
const CostIndex = lazy(() => import("./pages/CostIndex"));
const SharedTrip = lazy(() => import("./pages/SharedTrip"));
const PriceTracker = lazy(() => import("./pages/PriceTracker"));
const BudgetCalculator = lazy(() => import("./pages/BudgetCalculator"));
const CurrencyConverter = lazy(() => import("./pages/CurrencyConverter"));

const AIRPORT_KEY = "travel-departure";

export default function App() {
  const { bookmarks, toggleBookmark, isBookmarked, getNote, updateNote } = useBookmarks();
  const { recentIds, addRecent } = useRecentlyViewed();
  const { stops, addStop, removeStop, updateDays, moveStop, clearItinerary, totalDays } = useItinerary();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("travel-dark-mode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [departureAirport, setDepartureAirport] = useState(() => {
    return localStorage.getItem(AIRPORT_KEY) || "NYC";
  });
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("travel-dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(AIRPORT_KEY, departureAirport);
  }, [departureAirport]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <BrowserRouter>
      <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <ScrollToTop />
        <Header
          bookmarkCount={bookmarks.length}
          itineraryCount={stops.length}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          departureAirport={departureAirport}
          onDepartureChange={setDepartureAirport}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
         <Suspense fallback={<div className="px-4"><SkeletonGrid count={8} /></div>}>
         <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  bookmarks={bookmarks}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={toggleBookmark}
                  recentIds={recentIds}
                  departureAirport={departureAirport}
                  onAddToItinerary={addStop}
                />
              }
            />
            <Route
              path="/bookmarks"
              element={
                <Bookmarks
                  bookmarks={bookmarks}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={toggleBookmark}
                  getNote={getNote}
                  updateNote={updateNote}
                />
              }
            />
            <Route
              path="/destination/:id"
              element={
                <DestinationDetail
                  isBookmarked={isBookmarked}
                  onToggleBookmark={toggleBookmark}
                  getNote={getNote}
                  updateNote={updateNote}
                  addRecent={addRecent}
                  departureAirport={departureAirport}
                  onAddToItinerary={addStop}
                />
              }
            />
            <Route
              path="/itinerary"
              element={
                <Itinerary
                  stops={stops}
                  addStop={addStop}
                  removeStop={removeStop}
                  updateDays={updateDays}
                  moveStop={moveStop}
                  clearItinerary={clearItinerary}
                  totalDays={totalDays}
                />
              }
            />
            <Route
              path="/cost-index"
              element={<CostIndex />}
            />
            <Route
              path="/share/:data"
              element={<SharedTrip />}
            />
            <Route
              path="/price-tracker"
              element={<PriceTracker />}
            />
            <Route
              path="/budget-calculator"
              element={<BudgetCalculator />}
            />
            <Route
              path="/currency-converter"
              element={<CurrencyConverter />}
            />
          </Routes>
          </ErrorBoundary>
          </Suspense>
        </main>
        <AuthModal />
        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg md:hidden" style={{paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
          <div className="flex items-center justify-around h-14">
            {[
              { to: "/", label: "Home", icon: "🏠" },
              { to: "/bookmarks", label: "Saved", icon: "❤️" },
              { to: "/itinerary", label: "Plan", icon: "🗓️" },
              { to: "/price-tracker", label: "Prices", icon: "📉" },
            ].map(({ to, label, icon }) => {
              const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
              return (
                <Link key={to} to={to}
                  className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors no-underline ${
                    isActive ? "text-primary" : "text-gray-400 dark:text-gray-500"
                  }`}>
                  <span className="text-lg leading-none">{icon}</span>
                  <span className="text-[10px] font-medium leading-none">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
