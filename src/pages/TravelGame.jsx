import { useState, useEffect, useCallback, useMemo } from "react";
import destinations from "../data/destinations";
import SafeImage from "../components/SafeImage";

const TOTAL_ROUNDS = 10;
const HINT_DELAYS = [0, 3000, 6000, 9000];

function getClues(dest, hintLevel) {
  const clues = [];
  clues.push(`📍 Region: ${dest.region}`);
  if (hintLevel >= 1) clues.push(`🏷️ Famous for: ${dest.famousFor.slice(0, 2).join(", ")}`);
  if (hintLevel >= 2) clues.push(`🍜 Eat: ${(dest.mustEat || []).slice(0, 2).join(", ")}`);
  if (hintLevel >= 3) clues.push(`💰 Budget: $${dest.budget?.min}–$${dest.budget?.max}/day · ⭐ ${dest.rating}`);
  return clues;
}

export default function TravelGame() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("start"); // start | playing | guess | result | done
  const [current, setCurrent] = useState(null);
  const [guessed, setGuessed] = useState("");
  const [feedback, setFeedback] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [history, setHistory] = useState([]);
  const [usedIds, setUsedIds] = useState([]);

  const pool = useMemo(() => {
    // Only use destinations with images
    return destinations.filter((d) => d.image && d.famousFor?.length > 0);
  }, []);

  const startGame = useCallback(() => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, TOTAL_ROUNDS);
    setUsedIds(selected.map((d) => d.id));
    setCurrent(selected[0]);
    setRound(1);
    setScore(0);
    setGameState("playing");
    setHintLevel(0);
    setHistory([]);
    setGuessed("");
    setFeedback("");
  }, [pool]);

  // Auto-reveal hints over time
  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setTimeout(() => {
      setHintLevel((h) => Math.min(h + 1, 3));
    }, 3000);
    return () => clearTimeout(timer);
  }, [gameState, hintLevel, round]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = guessed.trim().toLowerCase();
    const dest = current;
    const name = dest.name.toLowerCase();
    const short = name.split(",")[0].trim();

    let correct = input === name || input === short;
    // Also check if input is contained in name for partial matches
    if (!correct && input.length >= 3) {
      correct = name.includes(input) || short.includes(input);
    }

    let points = 0;
    if (correct) {
      points = Math.max(1, 4 - hintLevel);
    }

    const newHistory = [...history, {
      dest: current,
      guessed: guessed.trim(),
      correct,
      points,
      hintLevel,
    }];
    setHistory(newHistory);
    setFeedback(correct ? `✅ +${points} pts!` : `❌ It was "${dest.name}"`);

    setGameState("result");
  };

  const nextRound = () => {
    if (round >= TOTAL_ROUNDS) {
      setGameState("done");
      return;
    }
    const nextId = usedIds[round];
    const next = pool.find((d) => d.id === nextId);
    setCurrent(next);
    setRound((r) => r + 1);
    setGameState("playing");
    setHintLevel(0);
    setGuessed("");
    setFeedback("");
  };

  if (gameState === "start") {
    return (
      <div className="text-center py-16">
        <span className="text-7xl">🌍</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-4 mb-2">Name That Destination</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-2">
          I'll show you a destination. You guess the name. {TOTAL_ROUNDS} rounds. Hints appear over time — the faster you guess, the more points you earn.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-8">
          <span>🏆 {TOTAL_ROUNDS} rounds</span>
          <span>⏱️ 4 hints max</span>
          <span>🎯 4 pts fastest</span>
        </div>
        <button onClick={startGame}
          className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-md hover:shadow-lg cursor-pointer border-0">
          🎮 Start Game
        </button>
      </div>
    );
  }

  if (gameState === "done") {
    const maxScore = TOTAL_ROUNDS * 4;
    const pct = Math.round((score / maxScore) * 100);
    let grade, emoji;
    if (pct >= 80) { grade = "World Traveler"; emoji = "🏆"; }
    else if (pct >= 60) { grade = "Explorer"; emoji = "🧭"; }
    else if (pct >= 40) { grade = "Tourist"; emoji = "🧳"; }
    else { grade = "Need a Map?"; emoji = "🗺️"; }

    return (
      <div className="max-w-lg mx-auto text-center py-10">
        <span className="text-6xl">{emoji}</span>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-3 mb-1">Game Over!</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">{grade}</p>
        <div className="text-5xl font-extrabold text-primary my-4">{score} / {maxScore}</div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{pct}% correct · {history.filter((h) => h.correct).length} of {TOTAL_ROUNDS} correct</p>

        <div className="space-y-2 mb-8 text-left">
          {history.map((h, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${h.correct ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              <span className="text-lg">{h.correct ? "✅" : "❌"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{h.dest.name}</p>
                <p className="text-xs text-gray-400">
                  {h.correct ? `+${h.points} pts (${4 - h.hintLevel}s)` : `You said: "${h.guessed}"`}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={startGame}
          className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors cursor-pointer border-0">
          🔄 Play Again
        </button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {round} / {TOTAL_ROUNDS}
        </span>
        <span className="text-sm font-bold text-primary">🏆 {score}</span>
      </div>

      {gameState === "result" ? (
        <div className="text-center py-8">
          <span className="text-5xl">{feedback.includes("✅") ? "🎉" : "😅"}</span>
          <p className={`text-xl font-bold mt-3 mb-1 ${feedback.includes("✅") ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
            {feedback}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{current.shortDescription}</p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-2 mb-6">
            <span>📍 {current.region}</span>
            <span>⭐ {current.rating}</span>
            <span>{current.country}</span>
          </div>
          <button onClick={nextRound}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors cursor-pointer border-0">
            {round >= TOTAL_ROUNDS ? "🏁 See Results" : "➡️ Next"}
          </button>
        </div>
      ) : (
        <>
          {/* Image */}
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 shadow-lg">
            <SafeImage src={current.image} alt={current.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= hintLevel ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
              <p className="text-white/60 text-xs mt-1">Hints appear every 3s</p>
            </div>
          </div>

          {/* Hints */}
          <div className="mb-6 space-y-1.5">
            {getClues(current, hintLevel).map((clue, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-xl animate-pulse" style={{ animationDuration: "0.5s" }}>
                <span className="text-base">{clue.split(":")[0]}</span>
                <span className="text-gray-500 dark:text-gray-400">:</span>
                <span className="font-medium">{clue.split(":").slice(1).join(":")}</span>
              </div>
            ))}
            {hintLevel < 3 && (
              <p className="text-xs text-gray-400 text-center pt-1">More hints in {3 - Math.floor((Date.now() % 3000) / 1000)}s...</p>
            )}
          </div>

          {/* Guess input */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input type="text" value={guessed} onChange={(e) => setGuessed(e.target.value)}
              placeholder="Type destination name..."
              autoFocus
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button type="submit" disabled={!guessed.trim()}
              className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-40 cursor-pointer border-0">
              Guess
            </button>
          </form>
        </>
      )}
    </div>
  );
}
