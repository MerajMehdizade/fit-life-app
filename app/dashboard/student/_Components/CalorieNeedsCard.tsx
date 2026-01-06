"use client";

interface CalorieNeedsCardProps {
  gender?: "male" | "female";
  age?: number;
  height?: number; // cm
  weight?: number; // kg
  workOutDays?: number;
  primaryGoal?: "slim" | "average" | "fit" | "muscular";
  calorieTarget?: number;
}

export default function CalorieNeedsCard({
  gender,
  age,
  height,
  weight,
  workOutDays = 0,
  primaryGoal = "average",
  calorieTarget,
}: CalorieNeedsCardProps) {
  if (!gender || !age || !height || !weight) return null;

  // ─────────────────────────────────────
  // 🔥 BMR (Mifflin-St Jeor)
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // 🏃 Activity multiplier
  let activityMultiplier = 1.3;
  if (workOutDays >= 3) activityMultiplier = 1.45;
  if (workOutDays >= 5) activityMultiplier = 1.6;

  let calories = bmr * activityMultiplier;

  // 🎯 Goal adjustment
  if (primaryGoal === "slim") calories *= 0.85;
  if (primaryGoal === "muscular") calories *= 1.1;

  calories = Math.round(calories);

  // ─────────────────────────────────────
  // 📊 Range logic
  const minCalories = Math.round(calories * 0.9);
  const maxCalories = Math.round(calories * 1.1);

  const clamp = (v: number) => Math.min(100, Math.max(0, v));

  // سیستم همیشه وسط بازه
  const systemRate = 50;

  const userRate =
    typeof calorieTarget === "number"
      ? clamp(
          ((calorieTarget - minCalories) /
            (maxCalories - minCalories)) *
            100
        )
      : null;

  // 🧠 Feedback
  const feedback =
    calorieTarget == null
      ? "این مقدار کالری بر اساس شرایط فعلی بدن شما محاسبه شده است"
      : calorieTarget < minCalories
      ? "هدف کالری شما کمی پایین‌تر از مقدار پیشنهادی است"
      : calorieTarget > maxCalories
      ? "هدف کالری شما بالاتر از محدوده پیشنهادی است"
      : "هدف کالری شما در محدوده مناسبی قرار دارد ✅";

  return (
    <div className="w-full md:w-1/3 md:h-52 rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur px-4 py-5 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-300">کالری مورد نیاز</span>
        <span className="text-xs text-amber-400 bg-amber-400/15 px-2 py-1 rounded-full">
          {primaryGoal === "slim"
            ? "چربی‌سوزی"
            : primaryGoal === "muscular"
            ? "عضله‌سازی"
            : "متعادل"}
        </span>
      </div>

      {/* Calories */}
      <div className="text-center">
        <div className="text-3xl font-bold text-white">{calories}</div>
        <div className="text-xs text-gray-400 mt-1">کالری در روز</div>

        {/* Rate bar */}
        <div className="relative mt-4 w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
          {/* system marker (center) */}
          <div
            className="absolute top-0 h-full bg-amber-400/70"
            style={{ width: `${systemRate}%` }}
          />

          {/* user marker */}
          {userRate !== null && (
            <div
              className="absolute -top-1 w-0.5 h-4 bg-gray-200"
              style={{ left: `calc(${userRate}% - 1px)` }}
              title="هدف شما"
            />
          )}
        </div>

        {/* Target value */}
        {calorieTarget != null && (
          <div className="text-[10px] text-gray-400 mt-1">
            هدف شما: {calorieTarget} کالری
          </div>
        )}

        <p className="text-[11px] text-amber-300 mt-2 leading-relaxed">
          {feedback}
        </p>
      </div>
    </div>
  );
}
