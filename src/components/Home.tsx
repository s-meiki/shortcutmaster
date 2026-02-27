import { useState, ReactNode } from "react";
import { GameSettings } from "../App";
import { Category, OS } from "../data/shortcuts";
import {
  Monitor,
  Apple,
  LayoutGrid,
  FileSpreadsheet,
  FileText,
  Globe,
  Play,
  Keyboard,
  MousePointer2,
} from "lucide-react";
import { motion } from "motion/react";

interface HomeProps {
  settings: GameSettings;
  onStart: (settings: GameSettings) => void;
}

export default function Home({
  settings: initialSettings,
  onStart,
}: HomeProps) {
  const [settings, setSettings] = useState<GameSettings>(initialSettings);

  const categories: { id: Category | "All"; label: string; icon: ReactNode }[] =
    [
      { id: "All", label: "すべて", icon: <LayoutGrid className="w-5 h-5" /> },
      {
        id: "General",
        label: "基本操作",
        icon: <Monitor className="w-5 h-5" />,
      },
      {
        id: "Excel",
        label: "Excel",
        icon: <FileSpreadsheet className="w-5 h-5" />,
      },
      { id: "Word", label: "Word", icon: <FileText className="w-5 h-5" /> },
      { id: "Browser", label: "ブラウザ", icon: <Globe className="w-5 h-5" /> },
    ];

  const handleStart = () => {
    onStart(settings);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto space-y-8 py-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
          ショートカットを極める
        </h2>
        <p className="text-lg text-slate-600">
          業務効率化のためのキーボード操作タイムアタック
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
        {/* Mode Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            ゲームモード
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSettings({ ...settings, mode: "quiz" })}
              className={`flex flex-col items-start gap-2 p-5 rounded-2xl border-2 transition-all ${
                settings.mode === "quiz"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-lg">
                <Keyboard className="w-6 h-6" />
                ショートカットクイズ
              </div>
              <p className="text-sm text-left opacity-80">
                表示された操作のショートカットキーを素早く入力するモードです。
              </p>
            </button>
            <button
              onClick={() => setSettings({ ...settings, mode: "practical" })}
              className={`flex flex-col items-start gap-2 p-5 rounded-2xl border-2 transition-all ${
                settings.mode === "practical"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-lg">
                <MousePointer2 className="w-6 h-6" />
                実践トレーニング
              </div>
              <p className="text-sm text-left opacity-80">
                マウスを使わずに、コピー＆ペーストなどの実際の操作を行うモードです。
              </p>
            </button>
          </div>
        </div>

        {/* OS Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            使用しているOS
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSettings({ ...settings, os: "windows" })}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                settings.os === "windows"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <Monitor className="w-6 h-6" />
              <span className="font-medium">Windows</span>
            </button>
            <button
              onClick={() => setSettings({ ...settings, os: "mac" })}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                settings.os === "mac"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <Apple className="w-6 h-6" />
              <span className="font-medium">Mac</span>
            </button>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            練習するカテゴリ
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSettings({ ...settings, category: cat.id })}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  settings.category === cat.id
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                {cat.icon}
                <span className="font-medium text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            問題数
          </h3>
          <div className="flex gap-4">
            {[5, 10, 20].map((count) => (
              <button
                key={count}
                onClick={() =>
                  setSettings({ ...settings, questionCount: count })
                }
                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                  settings.questionCount === count
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                {count}問
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <Play className="w-6 h-6 fill-current" />
        スタート
      </button>
    </motion.div>
  );
}
