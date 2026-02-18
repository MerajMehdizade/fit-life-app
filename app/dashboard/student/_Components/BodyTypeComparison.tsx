"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AnalysisJourneyPath from "./AnalysisJourneyPath";
import { useUser } from "@/app/context/UserContext";

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
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const ringColor = isFinished ? "#22c55e" : "#facc15";

  return (
    <>
      {open && (
        <BodyEditModal
          gender={gender}
          currentVisual={currentVisual}
          targetVisual={targetVisual}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      )}
      <div className="relative w-full max-w-4xl 
                p-6 rounded-3xl border border-gray-700 
                bg-gray-800/25 shadow-lg">
          <div className="flex justify-center mb-5">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 
                 text-sm text-gray-300 
                 hover:text-white transition
                 px-4 py-2 rounded-2xl
                 bg-gray-700/40 hover:bg-gray-700
                 backdrop-blur-md"
            >
              تنظیم مجدد
            </button>
          </div>
        <div className="flex items-center justify-center gap-6">
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
            ${isFinished
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
      </div>
    </>
  );
}
function BodyEditModal({
  gender,
  currentVisual,
  targetVisual,
  onClose,
  onSaved,
}: {
  gender: "male" | "female";
  currentVisual?: BodyVisualKey;
  targetVisual?: BodyVisualKey;
  onClose: () => void;
  onSaved: () => void;
}) {
  const visuals: BodyVisualKey[] = [
    "body_1",
    "body_2",
    "body_3",
    "body_4",
  ];

  const [step, setStep] = useState<1 | 2>(1);
  const [current, setCurrent] = useState<BodyVisualKey | undefined>(currentVisual);
  const [target, setTarget] = useState<BodyVisualKey | undefined>(targetVisual);
  const [loading, setLoading] = useState(false);

  const { setUser } = useUser();

  const resolve = (visual: BodyVisualKey) =>
    `/body/${gender}/${bodyVisualMap[visual]}.PNG`;

  const handleSave = async () => {
    if (!current || !target) return;

    try {
      setLoading(true);

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          uiPreferences: {
            bodyVisuals: { current, target },
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Update failed");
        return;
      }

      setUser(data.user);
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center">

      <div
        className="w-full md:max-w-lg bg-gray-900 
                   rounded-t-3xl md:rounded-3xl 
                   p-6 md:p-8 border border-gray-700 
                   transform transition-all duration-300 
                   translate-y-0 opacity-100"
      >
        {/* Mobile Handle */}
        <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-6 md:hidden" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mb-6">
          <div className={`w-3 h-3 rounded-full ${step === 1 ? "bg-cyan-400" : "bg-gray-600"}`} />
          <div className={`w-3 h-3 rounded-full ${step === 2 ? "bg-green-400" : "bg-gray-600"}`} />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-center text-lg font-semibold mb-6">
              بدن فعلی رو انتخاب کن
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {visuals.map((v) => (
                <div
                  key={v}
                  onClick={() => setCurrent(v)}
                  className={`rounded-2xl p-2 cursor-pointer transition 
                    ${current === v
                      ? "bg-cyan-500/20 ring-2 ring-cyan-400"
                      : "bg-gray-800 hover:bg-gray-700"
                    }`}
                >
                  <img
                    src={resolve(v)}
                    className="w-full h-44 object-contain rounded-xl"
                  />
                </div>
              ))}
            </div>

            <button
              disabled={!current}
              onClick={() => setStep(2)}
              className="w-full bg-cyan-500 hover:bg-cyan-600 
                         py-3 rounded-2xl disabled:opacity-40"
            >
              ادامه
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-center text-lg font-semibold mb-6">
              بدن هدفت رو انتخاب کن
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {visuals.map((v) => (
                <div
                  key={v}
                  onClick={() => setTarget(v)}
                  className={`rounded-2xl p-2 cursor-pointer transition 
                    ${target === v
                      ? "bg-green-500/20 ring-2 ring-green-400"
                      : "bg-gray-800 hover:bg-gray-700"
                    }`}
                >
                  <img
                    src={resolve(v)}
                    className="w-full h-44 object-contain rounded-xl"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-700 py-3 rounded-2xl"
              >
                برگشت
              </button>

              <button
                disabled={!target || loading}
                onClick={handleSave}
                className="flex-1 bg-green-500 hover:bg-green-600 
                           py-3 rounded-2xl disabled:opacity-40"
              >
                {loading ? "در حال ذخیره..." : "ذخیره"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


