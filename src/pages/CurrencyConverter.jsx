import { useState, useEffect } from "react";
import destinations from "../data/destinations";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(r => r.json())
      .then(d => { setRates(d.rates); setLoading(false); })
      .catch(() => { setRates({ EUR: 0.85, GBP: 0.73, JPY: 110, KRW: 1300 }); setLoading(false); });
  }, []);

  const inUSD = from === "USD" ? amount : amount / (rates?.[from] || 1);
  const converted = to === "USD" ? inUSD : inUSD * (rates?.[to] || 1);

  // Map destinations by currency
  const matchingDests = destinations.filter(d => {
    if (!d.currency) return false;
    return d.currency.toLowerCase().includes(to.toLowerCase()) || 
           d.currency.includes(currencies.find(c => c.code === to)?.name || "");
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">💱 Currency Converter</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Live rates from ExchangeRate-API</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        {loading ? (
          <div className="flex items-center gap-3 text-gray-500"><span className="animate-spin">💱</span> Loading rates...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-lg font-bold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
              <select value={from} onChange={e => setFrom(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base">
                {currencies.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
              <select value={to} onChange={e => setTo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base">
                {currencies.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>)}
              </select>
            </div>
          </div>
        )}

        {!loading && (
          <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{amount} {from} =</p>
            <p className="text-3xl font-extrabold text-primary">{converted.toLocaleString(undefined, {maximumFractionDigits: 2})} {to}</p>
            <p className="text-xs text-gray-400 mt-1">1 {from} = {((rates?.[to] || 1) / (rates?.[from] || 1)).toFixed(4)} {to}</p>
          </div>
        )}
      </div>

      {matchingDests.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📍 Destinations using {to}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {matchingDests.map(d => (
              <a key={d.id} href={`/destination/${d.id}`}
                className="block px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors no-underline">
                {d.name} <span className="text-gray-400 text-[10px]">({d.currency?.split("(")[0]?.trim()})</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
