import { useState, useEffect } from "react";
import usePriceAlerts from "../hooks/usePriceAlerts";

// Product search DB — common products with prices from major retailers
// These are reference prices that get updated by the cron checker
const SAMPLE_PRODUCTS = [
  { id: "airpods-pro", name: "Apple AirPods Pro 2", category: "Electronics", image: "🎧", currentPrice: 249, url: "https://www.apple.com/airpods-pro/" },
  { id: "macbook-air", name: "Apple MacBook Air M3", category: "Electronics", image: "💻", currentPrice: 1099, url: "https://www.apple.com/macbook-air/" },
  { id: "ipad-air", name: "Apple iPad Air M2", category: "Electronics", image: "📱", currentPrice: 599, url: "https://www.apple.com/ipad-air/" },
  { id: "ps5", name: "Sony PlayStation 5 Slim", category: "Gaming", image: "🎮", currentPrice: 499, url: "https://www.playstation.com/" },
  { id: "xbox-x", name: "Microsoft Xbox Series X", category: "Gaming", image: "🎮", currentPrice: 499, url: "https://www.xbox.com/" },
  { id: "switch-oled", name: "Nintendo Switch OLED", category: "Gaming", image: "🎮", currentPrice: 349, url: "https://www.nintendo.com/" },
  { id: "sony-wh", name: "Sony WH-1000XM5 Headphones", category: "Electronics", image: "🎧", currentPrice: 399, url: "https://www.sony.com/" },
  { id: "samsung-s25", name: "Samsung Galaxy S25 Ultra", category: "Phones", image: "📱", currentPrice: 1299, url: "https://www.samsung.com/" },
  { id: "pixel-9", name: "Google Pixel 9 Pro", category: "Phones", image: "📱", currentPrice: 999, url: "https://store.google.com/" },
  { id: "ipad-pro", name: "Apple iPad Pro M4 11\"", category: "Electronics", image: "📱", currentPrice: 999, url: "https://www.apple.com/ipad-pro/" },
  { id: "airpods-4", name: "Apple AirPods 4", category: "Electronics", image: "🎧", currentPrice: 179, url: "https://www.apple.com/airpods/" },
  { id: "apple-watch", name: "Apple Watch Series 10", category: "Wearables", image: "⌚", currentPrice: 399, url: "https://www.apple.com/watch/" },
  { id: "dyson-v15", name: "Dyson V15 Detect Vacuum", category: "Home", image: "🧹", currentPrice: 749, url: "https://www.dyson.com/" },
  { id: "ninja-creami", name: "Ninja CREAMi Ice Cream Maker", category: "Kitchen", image: "🍦", currentPrice: 199, url: "https://www.ninjaaccessories.com/" },
  { id: "instant-pot", name: "Instant Pot Duo Plus 6-Qt", category: "Kitchen", image: "🍲", currentPrice: 99, url: "https://www.instantpot.com/" },
  { id: "kindle-pw", name: "Amazon Kindle Paperwhite", category: "Electronics", image: "📚", currentPrice: 159, url: "https://www.amazon.com/kindle" },
  { id: "echo-dot", name: "Amazon Echo Dot 5th Gen", category: "Smart Home", image: "🔊", currentPrice: 49, url: "https://www.amazon.com/echo-dot" },
  { id: "roomba-j9", name: "iRobot Roomba j9+", category: "Home", image: "🤖", currentPrice: 899, url: "https://www.irobot.com/" },
  { id: "lg-c4", name: "LG C4 65\" OLED TV", category: "TV", image: "📺", currentPrice: 1799, url: "https://www.lg.com/" },
  { id: "sony-bravia", name: "Sony Bravia XR A95L 65\"", category: "TV", image: "📺", currentPrice: 2799, url: "https://www.sony.com/" },
  { id: "bose-qc", name: "Bose QuietComfort Ultra", category: "Electronics", image: "🎧", currentPrice: 429, url: "https://www.bose.com/" },
  { id: "nintendo-games", name: "Nintendo Switch Game Voucher", category: "Gaming", image: "🎮", currentPrice: 99, url: "https://www.nintendo.com/" },
  { id: "airtag-4", name: "Apple AirTag 4-Pack", category: "Electronics", image: "🔑", currentPrice: 99, url: "https://www.apple.com/airtag/" },
  { id: "meta-quest", name: "Meta Quest 3S 128GB", category: "Gaming", image: "🥽", currentPrice: 299, url: "https://www.meta.com/quest/" },
  { id: "ring-doorbell", name: "Ring Video Doorbell Pro 2", category: "Smart Home", image: "🔔", currentPrice: 229, url: "https://ring.com/" },
];

const CATEGORIES = ["All", "Electronics", "Phones", "Gaming", "TV", "Home", "Kitchen", "Smart Home", "Wearables"];

export default function PriceTracker() {
  const { items, addItem, removeItem, updateTarget, clearAll } = usePriceAlerts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState("discover"); // discover | tracking

  const filtered = SAMPLE_PRODUCTS.filter((p) => {
    const q = search.toLowerCase();
    return (category === "All" || p.category === category) &&
      (search === "" || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  });

  const trackingItems = items.length;
  const alertItems = items.filter((i) => i.targetPrice && i.latestPrice && i.latestPrice <= i.targetPrice);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1">📉 Price Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track prices and get alerts when they drop</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView("discover")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer border-0 ${view === "discover" ? "bg-primary text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
            🔍 Discover
          </button>
          <button onClick={() => setView("tracking")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer border-0 relative ${view === "tracking" ? "bg-primary text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
            📋 Tracking {trackingItems > 0 && <span className="ml-1 bg-accent text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{trackingItems}</span>}
          </button>
        </div>
      </div>

      {alertItems.length > 0 && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-2xl p-4">
          <h3 className="font-bold text-green-800 dark:text-green-300 text-sm">🎯 Price Alert{alertItems.length > 1 ? "s" : ""}</h3>
          <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">{alertItems.length} item{alertItems.length > 1 ? "s" : ""} hit your target price! Check the Tracking tab.</p>
        </div>
      )}

      {view === "discover" ? (
        <>
          {/* Search + Category */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border-0 ${category === c ? "bg-primary text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => {
              const isTracking = items.some((i) => i.id === product.id);
              return (
                <div key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-3xl">{product.image}</span>
                      <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wide">{product.category}</p>
                    </div>
                    {isTracking && <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">Tracking ✓</span>}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-primary">${product.currentPrice}</span>
                    {isTracking ? (
                      <button onClick={() => removeItem(product.id)}
                        className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors cursor-pointer bg-transparent border-0">
                        Remove
                      </button>
                    ) : (
                      <button onClick={() => addItem(product)}
                        className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors cursor-pointer border-0">
                        + Track
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <span className="text-4xl">🔍</span>
              <p className="text-gray-500 dark:text-gray-400 mt-3">No products match your search</p>
            </div>
          )}
        </>
      ) : (
        /* Tracking View */
        <div>
          {items.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl">📋</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Nothing tracked yet</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Search for products and click "Track" to start monitoring prices</p>
              <button onClick={() => setView("discover")}
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors cursor-pointer border-0">
                🔍 Browse Products
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tracking <span className="font-semibold text-gray-700 dark:text-gray-200">{items.length}</span> product{items.length > 1 ? "s" : ""}
                  {alertItems.length > 0 && <span className="ml-2 text-green-500 font-semibold">· {alertItems.length} alert{alertItems.length > 1 ? "s" : ""}!</span>}
                </p>
                <button onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-0">
                  Clear all
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => {
                  const product = SAMPLE_PRODUCTS.find((p) => p.id === item.id);
                  if (!product) return null;
                  const hitTarget = item.targetPrice && item.latestPrice && item.latestPrice <= item.targetPrice;
                  return (
                    <div key={item.id}
                      className={`bg-white dark:bg-gray-800 rounded-2xl border p-4 sm:p-5 shadow-sm transition-all ${hitTarget ? "border-green-300 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10" : "border-gray-100 dark:border-gray-700"}`}>
                      <div className="flex items-start gap-4">
                        <span className="text-3xl flex-shrink-0">{product.image}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{product.name}</h3>
                              <span className="text-[10px] text-gray-400 uppercase tracking-wide">{product.category}</span>
                            </div>
                            <button onClick={() => removeItem(item.id)}
                              className="text-gray-300 hover:text-red-500 text-lg transition-colors cursor-pointer bg-transparent border-0 flex-shrink-0">✕</button>
                          </div>

                          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <span className="text-[10px] text-gray-400 block">Current Price</span>
                              <span className={`font-bold text-sm ${hitTarget ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                                ${item.latestPrice || product.currentPrice}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 block">Target Price</span>
                              <input type="number" value={item.targetPrice || ""}
                                onChange={(e) => updateTarget(item.id, Number(e.target.value))}
                                placeholder="$0"
                                className="w-20 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 block">Possible Savings</span>
                              <span className="font-bold text-sm text-green-600 dark:text-green-400">
                                {item.latestPrice && item.targetPrice ? `$${(item.latestPrice - item.targetPrice).toFixed(0)}` : "—"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 block">Last Checked</span>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {item.lastChecked
                                  ? new Date(item.lastChecked).toLocaleDateString()
                                  : "Not yet"}
                              </span>
                            </div>
                          </div>

                          {hitTarget && (
                            <div className="mt-3 bg-green-100 dark:bg-green-900/30 rounded-xl px-3 py-2 flex items-center gap-2">
                              <span>🎯</span>
                              <span className="text-sm font-semibold text-green-700 dark:text-green-300">Target price reached! Buy now.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
