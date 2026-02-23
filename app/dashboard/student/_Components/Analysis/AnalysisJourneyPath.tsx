"use client";

import { motion } from "framer-motion";

export default function AnalysisJourneyPath() {
  return (
    <div className="relative  flex justify-center">
      <div className="relative w-[220px] h-[60]">
        {/* مسیر */}
        <svg
          width="220"
          height="300"
          viewBox="0 0 220 300"
          fill="none"
          className="absolute inset-0"
        >
          <motion.path
            d="
              M110 0
              C110 60, 70 80, 80 140
              C90 200, 140 210, 110 300
            "
            stroke="url(#grad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          <defs>
            <linearGradient
              id="grad"
              x1="0"
              y1="0"
              x2="0"
              y2="300"
              gradientUnits="userSpaceOnUse"
            >
              {/* بالا کم‌رنگ */}
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.01" />

              {/* وسط پررنگ */}
              <stop offset="20%" stopColor="#facc15" stopOpacity="1" />
              <stop offset="80%" stopColor="#22c55e" stopOpacity="1" />

              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.01" />
              {/* پایین کم‌رنگ */}
            </linearGradient>
          </defs>


          {/* نود شروع */}
          <circle cx="100" cy="50" r="6" fill="#facc15" />

          {/* نود وضعیت فعلی */}
          <motion.circle
            cx="100"
            cy="190"
            r="8"
            fill="#22c55e"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          />
        </svg>

        {/* لیبل شروع */}
        <div className="absolute left-2.5 top-10 text-sm text-amber-300">
          شروع مسیر
        </div>

        {/* لیبل وضعیت */}
        <div className="absolute -right-3 top-[180px] text-sm font-bold text-green-300">
          خلاصه شخصی شما
        </div>
      </div>
    </div>
  );
}
