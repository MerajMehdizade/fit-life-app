"use client";
interface CalorieNeedsCardProps {
  gender?: "male" | "female";
  age?: number;
  height?: number;
  weight?: number;
  dailyActivityLevel?: string;
  workOutDays?: number;
  primaryGoal?:
  | "fat_loss"
  | "muscle_gain"
  | "health"
  | "strength"
  | "recomposition";
  calorieTarget?: number;
}

export default function CalorieNeedsCard({
  gender,
  age,
  height,
  weight,
  dailyActivityLevel,
  workOutDays = 0,
  primaryGoal = "health",
  calorieTarget,
}: CalorieNeedsCardProps) {
  if (!gender || !age || !height || !weight) return null;

  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMap: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  let multiplier =
    dailyActivityLevel && activityMap[dailyActivityLevel]
      ? activityMap[dailyActivityLevel]
      : workOutDays >= 5
        ? 1.6
        : workOutDays >= 3
          ? 1.45
          : 1.3;

  let calories = bmr * multiplier;

  if (primaryGoal === "fat_loss") calories *= 0.85;
  if (primaryGoal === "muscle_gain") calories *= 1.1;

  calories = Math.round(calories);


  const minCalories = Math.round(calories * 0.9);
  const maxCalories = Math.round(calories * 1.1);

  const clamp = (v: number) => Math.min(100, Math.max(0, v));

  const userRate =
    typeof calorieTarget === "number"
      ? clamp(((calorieTarget - minCalories) / (maxCalories - minCalories)) * 100)
      : null;

  const feedback =
    calorieTarget == null
      ? "این مقدار کالری بر اساس شرایط بدن شما محاسبه شده است"
      : calorieTarget < minCalories
        ? "کالری انتخابی شما کمی پایین‌تر از مقدار پیشنهادی است"
        : calorieTarget > maxCalories
          ? "کالری انتخابی شما بالاتر از محدوده پیشنهادی است"
          : "هدف کالری شما مناسب است ✅";

  const goalLabelMap: Record<string, string> = {
    fat_loss: "چربی‌سوزی",
    cut: "کات",
    muscle_gain: "عضله‌سازی",
    strength: "قدرت",
    recomposition: "ریکامپ",
    health: "سلامتی",
  };

  return (
    <div className="w-full md:w-1/3 md:h-52 rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur px-4 py-5 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-300">کالری مورد نیاز</span>
        <span className="text-xs text-amber-400 bg-amber-400/15 px-2 py-1 rounded-full">
          {goalLabelMap[primaryGoal]}
        </span>
      </div>

      <div className="text-center">
        <div className="text-3xl font-bold text-white">{calories}</div>
        <div className="text-xs text-gray-400 mt-1">کالری در روز</div>

        <div className="relative mt-4 w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
          {userRate !== null && (
            <div
              className="absolute -top-1 w-0.5 h-4 bg-gray-200"
              style={{ left: `calc(${userRate}% - 1px)` }}
            />
          )}
        </div>

        {calorieTarget != null && (
          <div className="text-[10px] text-gray-400 mt-1">
            هدف شما: {calorieTarget} کالری
          </div>
        )}

        <p className="text-[11px] text-amber-300 mt-2">{feedback}</p>
      </div>
    </div>
  );
}
