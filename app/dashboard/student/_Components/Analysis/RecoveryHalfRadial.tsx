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
}

export default function RecoveryHalfRadial({ score }: Props) {
  const safeScore = Math.min(Math.max(score ?? 0, 0), 100);
  const [animatedScore, setAnimatedScore] = useState(0);

  // انیمیشن عدد وسط
  useEffect(() => {
    let start = 0;
    const duration = 800;
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

  const getColor = () => {
    if (safeScore >= 75) return "#22c55e"; // سبز
    if (safeScore >= 50) return "#facc15"; // زرد
    return "#ef4444"; // قرمز
  };

  const getMessage = () => {
    if (safeScore >= 85)
      return { text: "ریکاوری عالی، ادامه بده! 💪", color: "text-green-400" };
    if (safeScore >= 70)
      return { text: "وضعیت ریکاوری خوبه، مراقب خواب باش", color: "text-green-300" };
    if (safeScore >= 50)
      return { text: "ریکاوری متوسط، کمی استراحت بیشتر کن", color: "text-yellow-400" };
    return { text: "ریسک خستگی بالاست، استراحت بیشتر نیاز داری", color: "text-red-400" };
  };

  const message = getMessage();

  const data = [{ value: safeScore }];

  return (
    <div className="w-full relative rounded-3xl border border-gray-700 
      bg-gray-800/40 backdrop-blur px-5 py-5 shadow-md">

      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        وضعیت ریکاوری
      </h3>

      {/* Half Radial Chart */}
      <div className="relative w-full h-44">
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="65%"
            outerRadius="100%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            {/* PolarAxis برای جلوگیری از پر شدن اشتباه */}
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={20}
              fill={getColor()}
              background={{ fill: "#374151" }}
              isAnimationActive
              animationDuration={800}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 pointer-events-none">
          <span className="text-2xl md:text-3xl font-bold text-gray-200">
            {animatedScore}
          </span>
          <span className="text-xs text-gray-400">از 100</span>
        </div>
      </div>

      {/* Message */}
      <p className={`text-xs mt-3 text-center leading-relaxed ${message.color}`}>
        {message.text}
      </p>
    </div>
  );
}