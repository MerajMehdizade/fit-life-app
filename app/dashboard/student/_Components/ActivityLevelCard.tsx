"use client";

interface ActivityLevelCardProps {
  workOutDays?: number;
  primaryGoal?: "slim" | "average" | "fit" | "muscular";
  height?: number;
  weight?: number;
}

export default function ActivityLevelCard({
  workOutDays = 0,
  primaryGoal = "average",
}: ActivityLevelCardProps) {
  const recommendedDaysMap = {
    slim: 3,
    average: 3,
    fit: 4,
    muscular: 5,
  };

  const recommendedDays = recommendedDaysMap[primaryGoal];
  const diff = recommendedDays - workOutDays;

  const statusMessage =
    diff > 0
      ? `برای رسیدن به هدف، ${diff} روز تمرین بیشتر در هفته پیشنهاد می‌شود`
      : "تعداد روزهای تمرین شما ایده‌آل است 👌";

  return (
    <div className="w-full md:w-1/3 h-52 rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur px-4 py-5 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-300">وضعیت تمرین</span>
        <span className="text-xs text-purple-400 bg-purple-400/15 px-2 py-1 rounded-full">
          {primaryGoal === "muscular"
            ? "عضله‌سازی"
            : primaryGoal === "slim"
            ? "چربی‌سوزی"
            : "متعادل"}
        </span>
      </div>

      {/* Main */}
      <div className="text-center">
        <div className="text-3xl font-bold text-white">
          {workOutDays} روز
        </div>
        <div className="text-xs text-gray-400 mt-1">
          تمرین فعلی در هفته
        </div>

        <div className="mt-3 text-xs text-gray-300">
          هدف شما نیازمند{" "}
          <span className="text-purple-400 font-semibold">
            {recommendedDays} روز تمرین
          </span>{" "}
          در هفته است
        </div>

        <p className="text-[11px] text-purple-300 mt-2 leading-relaxed">
          {statusMessage}
        </p>
      </div>
    </div>
  );
}
