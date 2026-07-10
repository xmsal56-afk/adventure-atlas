import { Link } from "react-router-dom";
import SafeImage from "../components/SafeImage";

const fields = [
  { key: "rating", label: "Rating", render: (v) => `${v} ★` },
  { key: "region", label: "Region" },
  { key: "country", label: "Country" },
  { key: "bestTime", label: "Best Time" },
  {
    key: "budget",
    label: "Daily Budget",
    render: (v) => (v ? `$${v.min}–$${v.max}` : "—"),
  },
  {
    key: "exchangeRate",
    label: "Exchange Rate",
    render: (v) => (v === 1 ? "At par" : v ? `1 USD ≈ ${v.toLocaleString()}` : "—"),
  },
  { key: "language", label: "Language" },
];

export default function CompareView({ destinations, onClose }) {
  if (destinations.length < 2) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            ⚖️ Comparing {destinations.length} Destinations
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer bg-transparent border-0"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left pb-3 pr-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider w-36">
                  &nbsp;
                </th>
                {destinations.map((d) => (
                  <th key={d.id} className="pb-3 px-3 text-center min-w-[180px]">
                    <Link
                      to={`/destination/${d.id}`}
                      className="no-underline"
                    >
                      <div className="h-24 rounded-lg overflow-hidden mb-2">
                        <SafeImage
                          src={d.image}
                          alt={d.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm hover:text-primary transition-colors">
                        {d.name}
                      </p>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => {
                let best = null;
                if (field.key === "rating") {
                  best = Math.max(...destinations.map((d) => d[field.key]));
                } else if (field.key === "budget") {
                  best = Math.min(...destinations.map((d) => d.budget?.min ?? Infinity));
                } else if (field.key === "exchangeRate") {
                  const rates = destinations.map((d) => d.exchangeRate ?? 0);
                  best = Math.max(...rates);
                }

                return (
                  <tr key={field.key} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                      {field.label}
                    </td>
                    {destinations.map((d) => {
                      const val = field.key === "budget" ? d.budget : d[field.key];
                      const rendered = field.render ? field.render(val) : val ?? "—";
                      const isWinner =
                        field.key === "rating" && val === best ||
                        field.key === "budget" && d.budget?.min === best ||
                        field.key === "exchangeRate" && d.exchangeRate === best;

                      return (
                        <td
                          key={d.id}
                          className={`py-3 px-3 text-center ${
                            isWinner ? "bg-green-50 dark:bg-green-900/20" : ""
                          }`}
                        >
                          <span className={isWinner ? "font-bold text-green-700 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}>
                            {rendered}
                          </span>
                          {isWinner && (
                            <span className="block text-[10px] font-bold text-green-500 mt-0.5">
                              BEST
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
