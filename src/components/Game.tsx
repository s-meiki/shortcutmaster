import { useState, useEffect, useCallback, useRef } from "react";
import { GameSettings, GameResult } from "../App";
import { shortcuts, Shortcut } from "../data/shortcuts";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Clock, SkipForward } from "lucide-react";

interface GameProps {
  settings: GameSettings;
  onFinish: (result: GameResult) => void;
}

export default function Game({ settings, onFinish }: GameProps) {
  const [questions, setQuestions] = useState<Shortcut[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  // Initialize game
  useEffect(() => {
    let filtered = shortcuts;
    if (settings.category !== "All") {
      filtered = shortcuts.filter((s) => s.category === settings.category);
    }

    // Shuffle and slice
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(
      0,
      Math.min(settings.questionCount, shuffled.length),
    );

    setQuestions(selected);
    setStartTime(Date.now());
  }, [settings]);

  // Timer
  useEffect(() => {
    if (questions.length === 0 || currentIndex >= questions.length) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 50); // 50ms for smooth UI

    return () => clearInterval(interval);
  }, [questions, currentIndex]);

  const handleNext = useCallback(
    (isSkip = false) => {
      if (isSkip) {
        setMistakes((m) => m + 1);
      }

      if (currentIndex + 1 >= questions.length) {
        // Finish game
        onFinish({
          timeMs: Date.now() - startTime,
          correctCount: questions.length,
          mistakeCount: mistakes + (isSkip ? 1 : 0),
          totalQuestions: questions.length,
        });
      } else {
        setCurrentIndex((prev) => prev + 1);
        setFeedback(null);
        setPressedKeys([]);
      }
    },
    [currentIndex, questions.length, mistakes, startTime, onFinish],
  );

  // Key listener
  useEffect(() => {
    if (
      questions.length === 0 ||
      currentIndex >= questions.length ||
      feedback === "success"
    )
      return;

    const currentShortcut = questions[currentIndex];
    const targetKeys =
      settings.os === "mac" ? currentShortcut.macKeys : currentShortcut.winKeys;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default actions for most shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.startsWith("F")) {
        e.preventDefault();
      }

      const currentKeys = new Set<string>();
      if (e.ctrlKey) currentKeys.add("control");
      if (e.metaKey) currentKeys.add("meta");
      if (e.shiftKey) currentKeys.add("shift");
      if (e.altKey) currentKeys.add("alt");

      const key = e.key.toLowerCase();
      const isModifier = ["control", "meta", "shift", "alt"].includes(key);

      if (!isModifier) {
        currentKeys.add(key);
      }

      setPressedKeys(Array.from(currentKeys));

      // Check match
      if (currentKeys.size === targetKeys.length) {
        const isMatch = targetKeys.every((k) => currentKeys.has(k));
        if (isMatch) {
          setFeedback("success");
          setTimeout(() => handleNext(false), 400); // Short delay to show success state
        } else if (!isModifier) {
          setFeedback("error");
          setMistakes((m) => m + 1);
          setTimeout(() => setFeedback(null), 500);
        }
      } else if (currentKeys.size > targetKeys.length && !isModifier) {
        setFeedback("error");
        setMistakes((m) => m + 1);
        setTimeout(() => setFeedback(null), 500);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Clear pressed keys if all modifiers are released
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        setPressedKeys([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [questions, currentIndex, settings.os, feedback, handleNext]);

  if (questions.length === 0) return null;

  const currentShortcut = questions[currentIndex];
  const displayKeys =
    settings.os === "mac"
      ? currentShortcut.macDisplay
      : currentShortcut.winDisplay;
  const elapsedMs = currentTime > 0 ? currentTime - startTime : 0;
  const seconds = Math.floor(elapsedMs / 1000);
  const ms = Math.floor((elapsedMs % 1000) / 10);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      {/* Header Stats */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 px-4 py-2 rounded-lg font-mono text-lg font-semibold text-slate-700">
            {currentIndex + 1} / {questions.length}
          </div>
          <div className="flex items-center gap-2 text-rose-500 font-medium">
            <XCircle className="w-5 h-5" />
            <span>ミス: {mistakes}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-indigo-600 font-mono text-2xl font-bold w-32 justify-end">
          <Clock className="w-6 h-6" />
          <span>
            {seconds}.{ms.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentShortcut.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8 w-full"
          >
            <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-wider uppercase mb-4">
              {currentShortcut.category}
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              {currentShortcut.task}
            </h2>

            {/* Target Keys Display */}
            <div className="flex items-center justify-center gap-3 pt-8">
              {displayKeys.map((key, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i > 0 && (
                    <span className="text-slate-400 font-bold text-xl">+</span>
                  )}
                  <kbd className="px-4 py-3 bg-slate-100 border-2 border-slate-200 border-b-4 rounded-xl text-xl font-mono font-bold text-slate-700 min-w-[3rem] shadow-sm">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-[2px]"
            >
              <CheckCircle2 className="w-32 h-32 text-emerald-500 drop-shadow-lg" />
            </motion.div>
          )}
          {feedback === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-rose-500/10 flex items-center justify-center backdrop-blur-[2px]"
            >
              <XCircle className="w-32 h-32 text-rose-500 drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip Button */}
      <div className="flex justify-center">
        <button
          onClick={() => handleNext(true)}
          className="flex items-center gap-2 px-6 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl font-medium transition-colors"
        >
          <SkipForward className="w-5 h-5" />
          スキップする (ミス扱い)
        </button>
      </div>
    </div>
  );
}
