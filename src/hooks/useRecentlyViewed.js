import { useState, useEffect, useCallback } from "react";

export default function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState(() => {
    try {
      const saved = localStorage.getItem("travel-recent");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("travel-recent", JSON.stringify(recentIds));
  }, [recentIds]);

  const addRecent = useCallback((id) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((i) => i !== id);
      return [id, ...filtered].slice(0, 5);
    });
  }, []);

  return { recentIds, addRecent };
}
