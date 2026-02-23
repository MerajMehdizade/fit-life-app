"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

interface Props {
  workoutDays?: number;
  mainObjective?: "fat_loss" | "muscle_gain" | "strength" | "health" | "recomposition";
}

export default function ActivityRing({
  workoutDays = 0,
  mainObjective = "health",
}: Props) {
  const recommendedDaysMap: Record<string, number> = {
    fat_loss: 4,
    muscle_gain: 5,
    strength: 4,
    recomposition: 4,
    health: 3,
  };
  const recommendedDays = recommendedDaysMap[mainObjective] ?? 3;

  // درصد واقعی
  const percent = Math.min(Math.max((workoutDays / recommendedDays) * 100, 0), 100);

  const data = [{ name: "activity", value: percent }];

  const getGradientColor = () => {
    if (percent >= 100) return "url(#greenGradient)";
    if (percent >= 50) return "url(#yellowGradient)";
    return "url(#redGradient)";
  };

  const message =
    percent >= 100
      ? "تعداد تمرین ایده‌آل است 👌"
      : percent >= 50
      ? "تقریباً به هدف رسیدی ⚡"
      : "تعداد تمرین کمتر از حد ⚠️";

  return (
    <div className="w-full relative rounded-3xl border border-gray-700 bg-gray-800/30 backdrop-blur px-4 py-5 shadow-md">

      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        وضعیت تمرین
      </h3>

      {/* Chart */}
      <div className="relative w-full h-40">
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="65%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <linearGradient id="yellowGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>

            {/* حذف background تا فقط مقدار واقعی پر بشه */}
            <RadialBar
              dataKey="value"
              cornerRadius={20}
              fill={getGradientColor()}

            />

            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-gray-200">
            {workoutDays} / {recommendedDays}
          </span>
          <span className="text-xs text-gray-400">روز در هفته</span>
        </div>
      </div>

      {/* Footer Message */}
      <div className="mt-6 text-center">
        <span
          className={`text-xs leading-relaxed ${
            percent >= 100
              ? "text-green-400"
              : percent >= 50
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {message}
        </span>
      </div>
    </div>
  );
}