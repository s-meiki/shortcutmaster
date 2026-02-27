import { useState, useEffect } from "react";
import Home from "./components/Home";
import Game from "./components/Game";
import PracticalGame from "./components/PracticalGame";
import Result from "./components/Result";
import { OS, Category } from "./data/shortcuts";

export type GameState = "home" | "playing" | "result";
export type GameMode = "quiz" | "practical";

export interface GameSettings {
  mode: GameMode;
  os: OS;
  category: Category | "All";
  questionCount: number;
}

export interface GameResult {
  timeMs: number;
  correctCount: number;
  mistakeCount: number;
  totalQuestions: number;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>("home");
  const [settings, setSettings] = useState<GameSettings>({
    mode: "quiz",
    os: "windows",
    category: "All",
    questionCount: 10,
  });
  const [result, setResult] = useState<GameResult | null>(null);

  useEffect(() => {
    // Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) {
      setSettings((prev) => ({ ...prev, os: "mac" }));
    }
  }, []);

  const startGame = (newSettings: GameSettings) => {
    setSettings(newSettings);
    setGameState("playing");
  };

  const finishGame = (gameResult: GameResult) => {
    setResult(gameResult);
    setGameState("result");
  };

  const goHome = () => {
    setGameState("home");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Shortcut Master
          </h1>
        </div>
        {gameState !== "home" && (
          <button
            onClick={goHome}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            ホームに戻る
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {gameState === "home" && (
          <Home settings={settings} onStart={startGame} />
        )}
        {gameState === "playing" && settings.mode === "quiz" && (
          <Game settings={settings} onFinish={finishGame} />
        )}
        {gameState === "playing" && settings.mode === "practical" && (
          <PracticalGame settings={settings} onFinish={finishGame} />
        )}
        {gameState === "result" && result && (
          <Result
            result={result}
            onRetry={() => setGameState("playing")}
            onHome={goHome}
          />
        )}
      </main>
    </div>
  );
}
