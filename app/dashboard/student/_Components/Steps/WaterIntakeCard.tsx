"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

interface WaterGlassesCardProps {
  weight?: number; // kg
  workOutDays?: number; // 0-7
}

const GLASS_VOLUME = 0.25; // liter

export default function WaterGlassesCard({
  weight,
  workOutDays = 0,
}: WaterGlassesCardProps) {
  if (!weight) return null;

  // 🎯 محاسبه هدف آب (همون کد خودت)
  let targetWater = weight * 0.035;
  if (workOutDays >= 4) targetWater += 0.3;
  targetWater = +targetWater.toFixed(2);

  const totalGlasses = Math.ceil(targetWater / GLASS_VOLUME);

  const [filledGlasses, setFilledGlasses] = useState(0);

  // 🔹 گرفتن مصرف امروز از دیتابیس
  useEffect(() => {
    fetch("/api/water", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (typeof data.filledGlasses === "number") {
          setFilledGlasses(data.filledGlasses);
        }
      });
  }, []);

  // 🔹 ذخیره در دیتابیس
  const saveGlasses = async (value: number) => {
    setFilledGlasses(value);

    await fetch("/api/water", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filledGlasses: value,
        targetWater,
      }),
    });
  };

  // 🔁 ریست خودکار نیمه‌شب (UX)
  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);

    const timeout = setTimeout(() => {
      setFilledGlasses(0);
    }, nextMidnight.getTime() - now.getTime());

    return () => clearTimeout(timeout);
  }, []);

  const consumedWater = +(filledGlasses * GLASS_VOLUME).toFixed(2);
  const progress = Math.min((consumedWater / targetWater) * 100, 100);

  const status =
    progress < 40
      ? "کم"
      : progress < 80
      ? "خوبه"
      : "عالی";

  return (
    <div className="w-full md:w-1/2 md:h-52 rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur px-4 py-5 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-300">مصرف آب روزانه</span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            progress < 40
              ? "text-amber-300 bg-amber-300/15"
              : progress < 80
              ? "text-cyan-300 bg-cyan-300/15"
              : "text-green-400 bg-green-400/15"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Glasses */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {Array.from({ length: totalGlasses }).map((_, i) => {
          const filled = i < filledGlasses;

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                saveGlasses(filled ? i : i + 1)
              }
              className="relative w-6 h-10 border border-cyan-400/40 rounded-b-md rounded-t-sm overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{ height: filled ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 w-full bg-cyan-400/70"
              />
            </motion.button>
          );
        })}
      </div>

      {/* Info */}
      <div className="text-center">
        <div className="text-lg font-bold text-white">
          {consumedWater} / {targetWater} لیتر
        </div>
        <div className="text-xs text-gray-400 mt-1">
          هر لیوان = 250 میلی‌لیتر
        </div>

        <p className="text-[11px] text-cyan-300/80 mt-2">
          روی لیوان‌ها بزن تا مصرفت ثبت بشه
        </p>
      </div>
    </div>
  );
}
