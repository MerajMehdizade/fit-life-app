"use client";

import { motion } from "framer-motion";

interface SleepCardProps {
  averageHours?: number;
  quality?: "poor" | "average" | "good";
}

export default function SleepCard({
  averageHours,
  quality,
}: SleepCardProps) {
  if (!averageHours) return null;

  let status = "متوسط";
  let message = "";
  let badgeColor = "text-gray-300 bg-gray-400/15";
  let progress = 50;

  // تحلیل ساعت خواب
  if (averageHours < 6) {
    status = "کم";
    message = "خوابت کمه، ریکاوری و عضله‌سازی تحت تاثیر قرار می‌گیره 😴";
    badgeColor = "text-red-400 bg-red-400/15";
    progress = 30;
  } else if (averageHours >= 6 && averageHours < 7.5) {
    status = "نسبتاً خوب";
    message = "خوبه ولی می‌تونه بهتر هم باشه 👌";
    badgeColor = "text-yellow-400 bg-yellow-400/15";
    progress = 60;
  } else if (averageHours >= 7.5 && averageHours <= 9) {
    status = "عالی";
    message = "ریکاوری بدنت عالیه، ادامه بده 💪";
    badgeColor = "text-green-400 bg-green-400/15";
    progress = 85;
  } else {
    status = "زیاد";
    message = "خوابت زیاده، مطمئنی کیفیتش هم خوبه؟ 🤔";
    badgeColor = "text-blue-400 bg-blue-400/15";
    progress = 75;
  }

  // تاثیر کیفیت خواب
  if (quality === "poor") {
    badgeColor = "text-red-400 bg-red-400/15";
  } else if (quality === "good") {
    badgeColor = "text-green-400 bg-green-400/15";
  }

  return (
    <div className="w-full md:w-1/3 md:h-52 rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur px-4 py-5 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-300">وضعیت خواب</span>
        <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
          {status}
        </span>
      </div>

      {/* Hours */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-white">
          {averageHours}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          ساعت میانگین خواب
        </div>
      </div>

      {/* Visual bar */}
      <div className="relative h-2 rounded-full bg-gray-700 mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8 }}
          className="h-full bg-linear-to-r from-indigo-400 to-green-400"
        />
      </div>

      {/* Message */}
      <p className="text-xs text-gray-300 text-center leading-relaxed">
        {message}
      </p>
    </div>
  );
}
