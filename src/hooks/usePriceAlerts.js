import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "price-tracker-items";

export default function usePriceAlerts() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === product.id)) return prev;
      return [{ ...product, addedAt: new Date().toISOString(), lastChecked: null, latestPrice: product.currentPrice }, ...prev];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updatePrice = useCallback((id, price) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, latestPrice: price, lastChecked: new Date().toISOString() } : i
      )
    );
  }, []);

  const updateTarget = useCallback((id, targetPrice) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, targetPrice } : i
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Check which items have hit their target
  const alerts = items.filter(
    (i) => i.targetPrice && i.latestPrice && i.latestPrice <= i.targetPrice
  );

  return { items, addItem, removeItem, updatePrice, updateTarget, clearAll, alerts };
}
