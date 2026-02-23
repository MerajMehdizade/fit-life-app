"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface BMICardProps {
  height?: number; // cm
  weight?: number; // kg
  targetBMI?: number; // optional (default 22)
}

export default function BMICard({
  height,
  weight,
  targetBMI = 22,
}: BMICardProps) {
  if (!height || !weight) return null;

  const heightM = height / 100;
  const bmi = +(weight / (heightM * heightM)).toFixed(1);
  const position = Math.min(
    Math.max(((bmi - 15) / (35 - 15)) * 100, 0),
    100
  );

  let status = "نرمال";
  let message = "وضعیت بدنت خوبه، با همین روند ادامه بده 💪";
  let indicatorColor = "bg-green-400";
  let badgeColor = "text-green-400 bg-green-400/15";
  let showWarning = false;

  if (bmi < 18.5) {
    status = "کمبود وزن";
    message = "کمی پایین‌تر از نرمالی، بهتره تغذیه‌ت رو تقویت کنی 🍽";
    indicatorColor = "bg-blue-400";
    badgeColor = "text-blue-400 bg-blue-400/15";
    showWarning = true;
  } else if (bmi >= 25 && bmi < 30) {
    status = "اضافه وزن";
    message = "یه مقدار بالاتر از نرمالی، قابل اصلاحه 👌";
    indicatorColor = "bg-yellow-400";
    badgeColor = "text-yellow-400 bg-yellow-400/15";
  } else if (bmi >= 30) {
    status = "چاقی";
    message = "بهتره جدی‌تر به سلامتی‌ت توجه کنی، ما کنارتیم ❤️";
    indicatorColor = "bg-red-400";
    badgeColor = "text-red-400 bg-red-400/15";
    showWarning = true;
  }

  // Target BMI position (22 ≈ وسط نرمال)
  const targetPosition = Math.min(
    Math.max(((targetBMI - 15) / (35 - 15)) * 100, 0),
    100
  );

  // اتصال به Journey Path (soft)
  useEffect(() => {
    document.body.setAttribute("data-bmi-visible", "true");
    return () => {
      document.body.removeAttribute("data-bmi-visible");
    };
  }, []);

  return (
    <div
      className="w-full rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur px-4 py-5 shadow-md"
      data-bmi-card
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-300">شاخص توده بدنی (BMI)</span>
        <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
          {status}
        </span>
      </div>

      {/* BMI Value */}
      <div className="text-center mb-5">
        <div className="text-4xl font-bold text-white">{bmi}</div>
        <div className="text-xs text-gray-400 mt-1">BMI شما</div>
      </div>

      {/* Rate Bar */}
      <div className="relative mb-4">
        {/* Bar */}
        <div className="h-2 rounded-full bg-linear-to-r from-blue-400 via-green-400 to-red-400 opacity-80" />

        {/* Target BMI */}
        <div
          className="absolute -top-1.5 h-5 w-px bg-white/70"
          style={{ left: `${targetPosition}%`, transform: "translateX(-50%)" }}
        />

        {/* Indicator */}
        <motion.div
          initial={{ left: 0 }}
          animate={{ left: `${position}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute -top-3"
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${indicatorColor}`} />
            <div className="w-px h-4 bg-gray-300/70" />
          </div>
        </motion.div>
      </div>

      {/* Message */}
      <p className="text-xs text-gray-300 text-center leading-relaxed mb-2">
        {message}
      </p>

      {/* Soft Warning */}
      {showWarning && (
        <p className="text-[11px] text-amber-300/80 text-center leading-relaxed">
          اگر این وضعیت ادامه پیدا کنه، بهتره برنامه‌ت رو بازبینی کنیم.
        </p>
      )}
    </div>
  );
}
