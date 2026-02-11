"use client";

import { useMemo } from "react";
import AnalysisJourneyPath from "./AnalysisJourneyPath";

type Gender = "male" | "female";
type BodyVisualKey = "body_1" | "body_2" | "body_3" | "body_4";

interface BodyTypeComparisonProps {
  gender?: Gender;

  /** از uiPreferences.bodyVisuals */
  currentVisual?: BodyVisualKey;
  targetVisual?: BodyVisualKey;

  currentWeight?: number;
  targetWeight?: number;

  currentWeek?: number;
}

const TOTAL_WEEKS = 10;

/* ================= MESSAGES ================= */

const week10Messages = [
  "10 هفته تا جهش",
  "10 هفته تا تغییر",
  "10 هفته تا بهترینت",
  "10 هفته تا عبور",
  "10 هفته تا نتیجه",
];

const finishedMessages = [
  "🏆 کارت عالی بود، آماده مرحله بعدی؟",
  "💪 این فقط شروع راهه، نه پایانش",
  "🎯 به هدفت خیلی نزدیک شدی",
];

/* ================= VISUAL MAP ================= */

const bodyVisualMap: Record<BodyVisualKey, string> = {
  body_1: "slim",
  body_2: "average",
  body_3: "fit",
  body_4: "muscular",
};

const resolveBodyImage = (
  gender: Gender,
  visual?: BodyVisualKey
) => {
  if (!visual) return `/body/${gender}/average.PNG`;

  const type = bodyVisualMap[visual];
  return `/body/${gender}/${type}.PNG`;
};

/* ================= COMPONENT ================= */

export default function BodyTypeComparison({
  gender = "male",
  currentVisual,
  targetVisual,
  currentWeight,
  targetWeight,
  currentWeek = 1,
}: BodyTypeComparisonProps) {
  const effectiveWeek = Math.min(currentWeek, TOTAL_WEEKS);
  const isFinished = effectiveWeek >= TOTAL_WEEKS;

  const progressPercent = Math.min(
    (effectiveWeek / TOTAL_WEEKS) * 100,
    100
  );

  const message = useMemo(() => {
    const list = isFinished ? finishedMessages : week10Messages;
    return list[Math.floor(Math.random() * list.length)];
  }, [isFinished]);

  const currentImg = resolveBodyImage(gender, currentVisual);
  const targetImg = resolveBodyImage(gender, targetVisual);

  const ringColor = isFinished ? "#22c55e" : "#facc15";

  return (
    <div className="flex items-center justify-center gap-6 p-6 rounded-3xl border border-gray-700 bg-gray-800/25 shadow-lg w-full max-w-4xl">

      {/* TARGET BODY */}
      <div className="flex flex-col items-center drop-shadow-[0_0_15px_rgba(34,197,94,0.25)] whitespace-nowrap">
        <span className="text-green-500 font-semibold mb-2">
          بدن هدف
        </span>
        <span className="text-green-400 px-3 py-1.5 border border-green-400 rounded-2xl mb-2 text-xs">
          (kg) {targetWeight ?? "-"}
        </span>
        <img
          src={targetImg}
          alt="Target Body"
          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg"
        />
      </div>

      {/* CENTER */}
      <div className="flex flex-col items-center relative min-w-40">

        <svg className="absolute -top-4" width="110" height="110">
          <circle cx="55" cy="55" r="50" stroke="#1f2933" strokeWidth="6" fill="none" />
          <circle
            cx="55"
            cy="55"
            r="50"
            stroke={ringColor}
            strokeWidth="6"
            fill="none"
            strokeDasharray={314}
            strokeDashoffset={314 - (314 * progressPercent) / 100}
            strokeLinecap="round"
          />
        </svg>

        <div
          className={`z-10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border max-w-[150px] animate-pulse
            ${
              isFinished
                ? "bg-green-500/10 border-green-400/40"
                : "bg-yellow-400/20 border-yellow-400/30"
            }`}
        >
          <span className="text-yellow-300 font-bold text-[13px]">
            {message}
          </span>
          <span className="block text-[11px] text-yellow-200 mt-1 opacity-70">
            {isFinished
              ? "دوره با موفقیت تکمیل شد 🎉"
              : `${effectiveWeek} / ${TOTAL_WEEKS} هفته • ${Math.round(progressPercent)}%`}
          </span>
        </div>

        <AnalysisJourneyPath />
      </div>

      {/* CURRENT BODY */}
      <div className="flex flex-col items-center opacity-80 whitespace-nowrap">
        <span className="text-cyan-500 font-semibold mb-2">
          بدن فعلی
        </span>
        <span className="text-cyan-500 px-3 py-1.5 border border-cyan-400 rounded-2xl mb-2 text-xs">
          (kg) {currentWeight ?? "-"}
        </span>
        <img
          src={currentImg}
          alt="Current Body"
          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
