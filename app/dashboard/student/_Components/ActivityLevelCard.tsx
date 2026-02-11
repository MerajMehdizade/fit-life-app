"use client";

interface ActivityLevelCardProps {
  workOutDays?: number;
  primaryGoal?: 
    | "fat_loss"
    | "muscle_gain"
    | "cut"
    | "health"
    | "strength"
    | "recomposition";
}

export default function ActivityLevelCard({
  workOutDays = 0,
  primaryGoal = "health",
}: ActivityLevelCardProps) {

  const recommendedDaysMap: Record<string, number> = {
    fat_loss: 4,
    cut: 5,
    muscle_gain: 5,
    strength: 4,
    recomposition: 4,
    health: 3,
  };

  const recommendedDays = recommendedDaysMap[primaryGoal] ?? 3;
  const diff = recommendedDays - workOutDays;

  const statusMessage =
    diff > 0
      ? `برای رسیدن به هدفت، ${diff} روز تمرین بیشتر در هفته پیشنهاد می‌شود`
      : "تعداد روزهای تمرین شما ایده‌آل است 👌";

  const goalLabelMap: Record<string, string> = {
    fat_loss: "چربی‌سوزی",
    cut: "کات",
    muscle_gain: "عضله‌سازی",
    strength: "افزایش قدرت",
    recomposition: "ریکامپ",
    health: "سلامتی",
  };

  return (
    <div className="w-full md:w-1/3 h-52 rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur px-4 py-5 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-300">وضعیت تمرین</span>
        <span className="text-xs text-purple-400 bg-purple-400/15 px-2 py-1 rounded-full">
          {goalLabelMap[primaryGoal]}
        </span>
      </div>

      <div className="text-center">
        <div className="text-3xl font-bold text-white">{workOutDays} روز</div>
        <div className="text-xs text-gray-400 mt-1">تمرین فعلی در هفته</div>

        <div className="mt-3 text-xs text-gray-300">
          پیشنهاد:{" "}
          <span className="text-purple-400 font-semibold">
            {recommendedDays} روز تمرین
          </span>
        </div>

        <p className="text-[11px] text-purple-300 mt-2">{statusMessage}</p>
      </div>
    </div>
  );
}
