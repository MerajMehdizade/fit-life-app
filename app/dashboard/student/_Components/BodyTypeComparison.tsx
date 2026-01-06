"use client";

import { useMemo } from "react";

interface BodyTypeComparisonProps {
  gender?: "male" | "female";
  currentType?: "slim" | "average" | "fit" | "muscular";
  targetType?: "slim" | "average" | "fit" | "muscular";
  weight?: number;
  currentWeight?: number;
  currentWeek?: number;
}

const TOTAL_WEEKS = 10;

const week10Messages = [
  "10 هفته تا جهش",
  "10 هفته تا تغییر",
  "10 هفته تا بهترینت",
  "10 هفته تا عبور",
  "10 هفته تا جایزه",
  "10 هفته تا نقطه عطف",
  "10 هفته تا پیروزی",
  "10 هفته تا قدرت",
  "10 هفته تا پیشرفت",
  "10 هفته تا تفاوت",
  "10 هفته تا اوج",
  "10 هفته تا برگشت",
  "10 هفته تا نتیجه",
];

const finishedMessages = [
  "🏆 کارت عالی بود، آماده مرحله بعدی؟",
  "💪 این فقط شروع راهه، نه پایانش",
  "🎯 به هدفت خیلی نزدیک شدی",
];

export default function BodyTypeComparison({
  gender,
  currentType,
  targetType,
  weight,
  currentWeight,
  currentWeek = 1,
}: BodyTypeComparisonProps) {
  const effectiveWeek = Math.min(currentWeek, TOTAL_WEEKS);
  const isFinished = effectiveWeek >= TOTAL_WEEKS;

  const g = gender ?? "male";

  const currentImg = currentType
    ? `/body/${g}/${currentType}.PNG`
    : `/body/${g}/average.PNG`;

  const targetImg = targetType
    ? `/body/${g}/${targetType}.PNG`
    : `/body/${g}/average.PNG`;

  const message = useMemo(() => {
    if (isFinished) {
      return finishedMessages[
        Math.floor(Math.random() * finishedMessages.length)
      ];
    }
    return week10Messages[
      Math.floor(Math.random() * week10Messages.length)
    ];
  }, [isFinished]);

  const progressPercent = Math.min(
    (effectiveWeek / TOTAL_WEEKS) * 100,
    100
  );

  const ringColor = isFinished ? "#22c55e" : "#facc15";

  return (
    <div className="flex items-center justify-center gap-6 p-6 rounded-3xl border border-gray-700 bg-gray-800/25 shadow-lg w-full max-w-4xl">

      {/* TARGET BODY */}
      <div className="flex flex-col items-center drop-shadow-[0_0_15px_rgba(34,197,94,0.25)] whitespace-nowrap">
        <span className="text-green-500 font-semibold mb-2 text-sm md:text-base">
          بدن هدف
        </span>
        <span className="text-green-400  px-3 py-1.5 border border-green-400 rounded-2xl mb-2 text-xs md:text-sm">
          (kg) {currentWeight ?? "-"}
        </span>
        <img
          src={targetImg}
          alt="Target Body"
          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg"
        />
      </div>

      {/* CENTER */}
      <div className="flex flex-col items-center justify-center relative text-center min-w-40 mt-4 md:mt-0">

        {/* Progress Ring */}
        <svg className="absolute -top-4" width="110" height="110">
          <circle
            cx="55"
            cy="55"
            r="50"
            stroke="#1f2933"
            strokeWidth="6"
            fill="none"
          />
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

        {/* Capsule */}
        <div
          className={`relative z-10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border max-w-[150px] animate-pulse
            ${isFinished
              ? "bg-green-500/10 border-green-400/40"
              : "bg-yellow-400/20 border-yellow-400/30"
            }`}
        >
          <span className="text-yellow-300 font-bold text-[13px] leading-tight">
            {message}
          </span>
          <span className="block text-[11px] text-yellow-200 mt-1 opacity-70">
            {isFinished
              ? "دوره با موفقیت تکمیل شد 🎉"
              : `${effectiveWeek} / ${TOTAL_WEEKS} هفته • ${Math.round(
                progressPercent
              )}%`}
          </span>
        </div>
      </div>

      {/* CURRENT BODY */}
      <div className="flex flex-col items-center opacity-80 mt-4 md:mt-0 whitespace-nowrap">
        <span className="text-cyan-500 font-semibold mb-2 text-sm md:text-base">
          بدن فعلی
        </span>
        <span className="text-cyan-500 px-3 py-1.5 border border-cyan-400 rounded-2xl mb-2 text-xs md:text-sm">
          (kg) {weight ?? "-"}
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
