import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useBookmarks from "./hooks/useBookmarks";
import useRecentlyViewed from "./hooks/useRecentlyViewed";
import useItinerary from "./hooks/useItinerary";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Bookmarks from "./pages/Bookmarks";
import DestinationDetail from "./pages/DestinationDetail";
import Itinerary from "./pages/Itinerary";
import CostIndex from "./pages/CostIndex";

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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
