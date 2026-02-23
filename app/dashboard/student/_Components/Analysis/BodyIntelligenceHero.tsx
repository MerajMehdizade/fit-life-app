"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { useEffect, useState } from "react";

interface Props {
  score: number; // 0-100
  goalLabel?: string;
}

export default function BodyIntelligenceHero({
  score,
  goalLabel,
}: Props) {
  const safeScore = Math.min(Math.max(score ?? 0, 0), 100);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const stepTime = 15;
    const increment = safeScore / (duration / stepTime);

    const counter = setInterval(() => {
      start += increment;
      if (start >= safeScore) {
        start = safeScore;
        clearInterval(counter);
      }
      setAnimatedScore(Math.round(start));
    }, stepTime);

    return () => clearInterval(counter);
  }, [safeScore]);

  // تعیین رنگ پیام و status
  const getStatus = () => {
    if (safeScore >= 80) return "عالی";
    if (safeScore >= 50) return "متوسط";
    return "نیاز به بهبود";
  };

  const getColor = () => {
    if (safeScore >= 80) return "#22c55e"; // سبز
    if (safeScore >= 50) return "#facc15"; // زرد
    return "#ef4444"; // قرمز
  };

  const getMessage = () => {
    if (safeScore >= 85)
      return { text: "بدنت در بهترین وضعیت خودشه، همین روند رو ادامه بده 🔥", color: "text-green-400" };
    if (safeScore >= 70)
      return { text: "در مسیر خوبی هستی، کمی روی خواب تمرکز کن", color: "text-green-300" };
    if (safeScore >= 50)
      return { text: "با افزایش تمرین یا بهبود خواب میتونی سریع‌تر پیشرفت کنی", color: "text-yellow-400" };
    return { text: "بهتره برنامه تمرین و استراحتت رو بازبینی کنیم", color: "text-red-400" };
  };

  const message = getMessage();

  // Segmented ring: برای ظاهر حرفه‌ای
  const segments = 6;
  const segmentAngle = 360 / segments;
  const filledAngle = (safeScore / 100) * 360;

  return (
    <div className="relative w-full rounded-3xl border border-gray-700 
      bg-gray-800/40 backdrop-blur px-6 py-6 shadow-lg">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-300">
          هوش وضعیت بدن
        </h2>
        <span className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-300">
          {getStatus()}
        </span>
      </div>

      {/* Chart */}
      <div className="relative w-full h-64">
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="75%"
            outerRadius="100%"
            data={[{ value: safeScore }]}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={40}
              fill={getColor()}
              background={{ fill: "#374151" }}
              isAnimationActive
              animationDuration={800}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Segmented overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-40 h-40 rounded-full bg-gray-900/60 shadow-inner flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-gray-200">{animatedScore}</span>
            <span className="text-sm text-gray-400">از 100</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      {goalLabel && (
        <div className="text-center mt-4">
          <div className="text-sm font-medium text-gray-200">{`هدف: ${goalLabel}`}</div>
          <p className={`text-xs mt-2 leading-relaxed ${message.color}`}>
            {message.text}
          </p>
        </div>
      )}
    </div>
  );
}