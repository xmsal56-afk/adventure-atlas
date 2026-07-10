import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "travel-itinerary";

export default function useItinerary() {
  const [stops, setStops] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stops));
  }, [stops]);

  const addStop = useCallback((destId) => {
    setStops((prev) => {
      if (prev.some((s) => s.destId === destId)) return prev;
      return [...prev, { destId, days: 2, order: prev.length }];
    });
  }, []);

  const removeStop = useCallback((destId) => {
    setStops((prev) => prev.filter((s) => s.destId !== destId));
  }, []);

  const updateDays = useCallback((destId, days) => {
    setStops((prev) =>
      prev.map((s) => (s.destId === destId ? { ...s, days: Math.max(1, Math.min(30, days)) } : s))
    );
  }, []);

  const moveStop = useCallback((destId, direction) => {
    setStops((prev) => {
      const idx = prev.findIndex((s) => s.destId === destId);
      if (idx === -1) return prev;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr.map((s, i) => ({ ...s, order: i }));
    });
  }, []);

  const clearItinerary = useCallback(() => {
    setStops([]);
  }, []);

  const totalDays = stops.reduce((sum, s) => sum + s.days, 0);

  return { stops, addStop, removeStop, updateDays, moveStop, clearItinerary, totalDays };
}
