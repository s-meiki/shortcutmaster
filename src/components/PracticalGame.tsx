import React, { useState, useEffect, useRef, useCallback } from "react";
import { GameSettings, GameResult } from "../App";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  SkipForward,
  MousePointer2,
} from "lucide-react";

interface GameProps {
  settings: GameSettings;
  onFinish: (result: GameResult) => void;
}

export interface PracticalTask {
  id: string;
  title: string;
  instruction: string;
  type: "copy-paste" | "cut-paste" | "select-all-delete" | "tab-navigation";
  initialText?: string;
}

const practicalTasks: PracticalTask[] = [
  {
    id: "p1",
    title: "コピー ＆ ペースト",
    instruction:
      "左のテキストをコピー（{ctrl}+C）し、Tabキーで右の枠に移動して貼り付け（{ctrl}+V）てください。",
    type: "copy-paste",
    initialText: "Shortcut Master",
  },
  {
    id: "p2",
    title: "切り取り ＆ ペースト",
    instruction:
      "左のテキストを切り取り（{ctrl}+X）し、Tabキーで右の枠に移動して貼り付け（{ctrl}+V）てください。",
    type: "cut-paste",
    initialText: "Move this text",
  },
  {
    id: "p3",
    title: "すべて選択 ＆ 削除",
    instruction:
      "下のテキストをすべて選択（{ctrl}+A）し、削除（Backspace または Delete）してください。",
    type: "select-all-delete",
    initialText: "Delete all of this",
  },
  {
    id: "p4",
    title: "Tabキーで移動",
    instruction:
      "マウスを使わずに、Tabキーを使って3つ目の入力欄まで移動してください。",
    type: "tab-navigation",
  },
];

export default function PracticalGame({ settings, onFinish }: GameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<"success" | null>(null);
  const [mouseWarning, setMouseWarning] = useState(false);

  const [leftValue, setLeftValue] = useState("");
  const [rightValue, setRightValue] = useState("");
  const [singleValue, setSingleValue] = useState("");

  const leftInputRef = useRef<HTMLInputElement>(null);
  const singleInputRef = useRef<HTMLInputElement>(null);
  const tabInput1Ref = useRef<HTMLInputElement>(null);
  const tabInput3Ref = useRef<HTMLInputElement>(null);

  const tasks = practicalTasks;

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // Timer
  useEffect(() => {
    if (currentIndex >= tasks.length) return;
    const interval = setInterval(() => setCurrentTime(Date.now()), 50);
    return () => clearInterval(interval);
  }, [currentIndex, tasks.length]);

  // Initialize Task
  useEffect(() => {
    if (currentIndex >= tasks.length) return;
    const task = tasks[currentIndex];
    setFeedback(null);

    if (task.type === "copy-paste" || task.type === "cut-paste") {
      setLeftValue(task.initialText || "");
      setRightValue("");
      setTimeout(() => {
        leftInputRef.current?.focus();
      }, 100);
    } else if (task.type === "select-all-delete") {
      setSingleValue(task.initialText || "");
      setTimeout(() => singleInputRef.current?.focus(), 100);
    } else if (task.type === "tab-navigation") {
      setTimeout(() => tabInput1Ref.current?.focus(), 100);
    }
  }, [currentIndex, tasks]);

  const handleNext = useCallback(
    (isSkip = false) => {
      if (isSkip) setMistakes((m) => m + 1);

      if (currentIndex + 1 >= tasks.length) {
        onFinish({
          timeMs: Date.now() - startTime,
          correctCount: tasks.length,
          mistakeCount: mistakes + (isSkip ? 1 : 0),
          totalQuestions: tasks.length,
        });
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentIndex, tasks.length, mistakes, startTime, onFinish],
  );

  // Check completion
  useEffect(() => {
    if (currentIndex >= tasks.length || feedback === "success") return;
    const task = tasks[currentIndex];
    let isComplete = false;

    if (task.type === "copy-paste") {
      if (rightValue === task.initialText) isComplete = true;
    } else if (task.type === "cut-paste") {
      if (leftValue === "" && rightValue === task.initialText)
        isComplete = true;
    } else if (task.type === "select-all-delete") {
      if (singleValue === "") isComplete = true;
    }

    if (isComplete) {
      setFeedback("success");
      setTimeout(() => handleNext(false), 600);
    }
  }, [
    leftValue,
    rightValue,
    singleValue,
    currentIndex,
    feedback,
    handleNext,
    tasks,
  ]);

  const handleTabFocus = () => {
    const task = tasks[currentIndex];
    if (task.type === "tab-navigation" && feedback !== "success") {
      setFeedback("success");
      setTimeout(() => handleNext(false), 600);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent focus change via mouse
    setMistakes((m) => m + 1);
    setMouseWarning(true);
    setTimeout(() => setMouseWarning(false), 2000);
  };

  if (currentIndex >= tasks.length) return null;

  const task = tasks[currentIndex];
  const ctrlKey = settings.os === "mac" ? "Cmd" : "Ctrl";
  const instruction = task.instruction.replace(/{ctrl}/g, ctrlKey);

  const elapsedMs = currentTime > 0 ? currentTime - startTime : 0;
  const seconds = Math.floor(elapsedMs / 1000);
  const ms = Math.floor((elapsedMs % 1000) / 10);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      {/* Header Stats */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 px-4 py-2 rounded-lg font-mono text-lg font-semibold text-slate-700">
            {currentIndex + 1} / {tasks.length}
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
      <div
        className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center"
        onMouseDownCapture={handleMouseDown}
      >
        {/* Mouse Warning */}
        <AnimatePresence>
          {mouseWarning && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 z-20"
            >
              <MousePointer2 className="w-5 h-5" />
              マウス操作は禁止です！キーボードを使いましょう。
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8 w-full max-w-xl mx-auto"
          >
            <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-wider uppercase mb-4">
              実践トレーニング
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {task.title}
            </h2>
            <p className="text-slate-600 font-medium text-lg">{instruction}</p>

            <div className="pt-8">
              {task.type === "copy-paste" || task.type === "cut-paste" ? (
                <div className="flex items-center gap-4">
                  <input
                    ref={leftInputRef}
                    type="text"
                    value={leftValue}
                    onChange={(e) => setLeftValue(e.target.value)}
                    className="flex-1 p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="左の枠"
                  />
                  <div className="text-slate-400 font-bold">→</div>
                  <input
                    type="text"
                    value={rightValue}
                    onChange={(e) => setRightValue(e.target.value)}
                    className="flex-1 p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="右の枠"
                  />
                </div>
              ) : task.type === "select-all-delete" ? (
                <input
                  ref={singleInputRef}
                  type="text"
                  value={singleValue}
                  onChange={(e) => setSingleValue(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all text-center"
                />
              ) : task.type === "tab-navigation" ? (
                <div className="flex flex-col gap-4">
                  <input
                    ref={tabInput1Ref}
                    type="text"
                    className="w-full p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="1つ目 (ここからスタート)"
                  />
                  <input
                    type="text"
                    className="w-full p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="2つ目 (Tabキーで通過)"
                  />
                  <input
                    ref={tabInput3Ref}
                    type="text"
                    onFocus={handleTabFocus}
                    className="w-full p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="3つ目 (ここに到達でクリア)"
                  />
                </div>
              ) : null}
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
              className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-[2px] z-10"
            >
              <CheckCircle2 className="w-32 h-32 text-emerald-500 drop-shadow-lg" />
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
