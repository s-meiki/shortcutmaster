import { GameResult } from "../App";
import { motion } from "motion/react";
import {
  Trophy,
  Clock,
  XCircle,
  RotateCcw,
  Home as HomeIcon,
} from "lucide-react";

interface ResultProps {
  result: GameResult;
  onRetry: () => void;
  onHome: () => void;
}

export default function Result({ result, onRetry, onHome }: ResultProps) {
  const seconds = Math.floor(result.timeMs / 1000);
  const ms = Math.floor((result.timeMs % 1000) / 10);

  // Calculate score (simple formula: base score - time penalty - mistake penalty)
  const baseScore = result.totalQuestions * 1000;
  const timePenalty = Math.floor(result.timeMs / 10);
  const mistakePenalty = result.mistakeCount * 500;
  const finalScore = Math.max(0, baseScore - timePenalty - mistakePenalty);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto space-y-8 py-8"
    >
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full mb-4">
          <Trophy className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
          リザルト
        </h2>
        <p className="text-lg text-slate-600">
          お疲れ様でした！あなたのスコアはこちらです。
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-8">
        <div className="text-center">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
            総合スコア
          </div>
          <div className="text-6xl font-black text-indigo-600 tracking-tighter">
            {finalScore.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-100">
          <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
            <Clock className="w-8 h-8 text-slate-400" />
            <div className="text-sm font-semibold text-slate-500">
              クリアタイム
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {seconds}.{ms.toString().padStart(2, "0")}秒
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
            <XCircle className="w-8 h-8 text-rose-400" />
            <div className="text-sm font-semibold text-slate-500">ミス回数</div>
            <div className="text-2xl font-bold text-slate-800">
              {result.mistakeCount}回
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onRetry}
          className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-6 h-6" />
          もう一度プレイ
        </button>
        <button
          onClick={onHome}
          className="flex-1 py-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
        >
          <HomeIcon className="w-6 h-6" />
          ホームに戻る
        </button>
      </div>
    </motion.div>
  );
}
