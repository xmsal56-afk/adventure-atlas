import { useState } from "react";
import { Link } from "react-router-dom";
import destinations from "../data/destinations";
import SafeImage from "../components/SafeImage";

const steps = ["Vibe", "Budget", "Region"];

const vibeOptions = [
  { key: "any", label: "🤷 Any Vibe", emoji: "" },
  { key: "beach", label: "🏖️ Beach" },
  { key: "adventure", label: "🏔️ Adventure" },
  { key: "romance", label: "💑 Romance" },
  { key: "culture", label: "🏛️ Culture" },
  { key: "foodie", label: "🍜 Foodie" },
  { key: "nature", label: "🌿 Nature" },
  { key: "nightlife", label: "🌙 Nightlife" },
  { key: "luxury", label: "💎 Luxury" },
  { key: "family", label: "👨‍👩‍👧‍👦 Family" },
  { key: "backpacker", label: "🎒 Backpacker" },
];

const budgetOptions = [
  { key: "any", label: "🤷 Any Budget" },
  { key: "budget", label: "🟢 Budget (≤$50/day)", max: 50 },
  { key: "moderate", label: "🔵 Moderate ($50–120/day)", min: 50, max: 120 },
  { key: "premium", label: "🟣 Premium ($120+/day)", min: 120 },
];

const regionOptions = [
  { key: "any", label: "🌍 Any Region" },
  { key: "Europe", label: "Europe" },
  { key: "Asia", label: "Asia" },
  { key: "North America", label: "North America" },
  { key: "South America", label: "South America" },
  { key: "Africa", label: "Africa" },
  { key: "Oceania", label: "Oceania" },
  { key: "Middle East", label: "Middle East" },
  { key: "Caribbean", label: "Caribbean" },
];

function scoreDestination(d, answers) {
  let score = 0;
  if (answers.vibe !== "any" && d.vibes?.includes(answers.vibe)) score += 3;
  if (answers.budget !== "any" && d.budget) {
    const opt = budgetOptions.find((b) => b.key === answers.budget);
    if (opt) {
      const { min = 0, max = Infinity } = opt;
      if (d.budget.min >= min && d.budget.max <= max) score += 2;
      else if (d.budget.min <= max && d.budget.max >= min) score += 1;
    }
  }
  if (answers.region !== "any" && d.region === answers.region) score += 2;
  return score;
}

export default function DestinationQuiz({ onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ vibe: "any", budget: "any", region: "any" });
  const [results, setResults] = useState(null);

  const setAnswer = (key, value) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Calculate results
      const scored = destinations
        .map((d) => ({ ...d, score: scoreDestination(d, newAnswers) }))
        .filter((d) => d.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      setResults(scored.length ? scored : destinations.sort(() => 0.5 - Math.random()).slice(0, 3));
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({ vibe: "any", budget: "any", region: "any" });
    setResults(null);
  };

  const currentOptions = step === 0 ? vibeOptions : step === 1 ? budgetOptions : regionOptions;
  const currentAnswer = step === 0 ? answers.vibe : step === 1 ? answers.budget : answers.region;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">🎯 Find Your Match</h2>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer bg-transparent border-0">
            ✕
          </button>
        </div>

        <div className="p-6">
          {!results ? (
            <>
              {/* Progress */}
              <div className="flex items-center gap-2 mb-6">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i <= step ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`text-sm font-medium ${i <= step ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}>
                      {s}
                    </span>
                    {i < 2 && <span className="text-gray-300 dark:text-gray-600 mx-1">→</span>}
                  </div>
                ))}
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {step === 0 && "What kind of traveler are you?"}
                {step === 1 && "What's your travel budget?"}
                {step === 2 && "Any region in mind?"}
              </p>

              <div className="space-y-2">
                {currentOptions.map((opt) => (
                  <button key={opt.key} onClick={() => setAnswer(step === 0 ? "vibe" : step === 1 ? "budget" : "region", opt.key)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                      currentAnswer === opt.key
                        ? "border-primary bg-primary/5 text-primary dark:text-primary"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>

              <button onClick={() => setAnswer(step === 0 ? "vibe" : step === 1 ? "budget" : "region", "any")}
                className="mt-3 w-full text-center text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 py-2 cursor-pointer bg-transparent border-0">
                Skip →
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <span className="text-4xl">✨</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2">Your Top Matches</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Based on your preferences
                </p>
              </div>

              <div className="space-y-3">
                {results.map((d, i) => (
                  <Link key={d.id} to={`/destination/${d.id}`} onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors no-underline group">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <SafeImage src={d.image} alt={d.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">{i + 1}.</span>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-primary transition-colors">
                          {d.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-400">{d.region}</span>
                        <span className="text-xs font-bold text-accent">★ {d.rating}</span>
                        {d.budget && (
                          <span className="text-xs text-gray-400">${d.budget.min}–${d.budget.max}/day</span>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors">→</span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button onClick={reset}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer border-0">
                  🔄 Start Over
                </button>
                <button onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors cursor-pointer border-0">
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
