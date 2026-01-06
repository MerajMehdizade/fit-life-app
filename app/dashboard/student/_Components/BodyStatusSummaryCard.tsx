"use client";

interface BodyStatusSummaryCardProps {
  bmi?: number;
  workOutDays?: number;
  primaryGoal?: "slim" | "average" | "fit" | "muscular";
}

export default function BodyStatusSummaryCard({
  bmi,
  workOutDays = 0,
  primaryGoal = "average",
}: BodyStatusSummaryCardProps) {
  let status: "good" | "warning" | "attention" = "good";

  if (bmi && bmi >= 30) status = "attention";
  else if (workOutDays < 3) status = "warning";

  const statusMeta = {
    good: {
      color: "text-green-400 bg-green-400/15",
      message: "بدن شما در مسیر مناسبی قرار دارد ",
    },
    warning: {
      color: "text-amber-400 bg-amber-400/15",
      message: "با افزایش تحرک می‌توانید سریع‌تر به هدفتان برسید",
    },
    attention: {
      color: "text-red-400 bg-red-400/15",
      message: "نیاز به توجه بیشتر به تمرین و تغذیه دارید",
    },
  };

  const meta = statusMeta[status];

  return (
    <div className="w-full md:w-1/3 h-52 rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur px-4 py-5 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-300">وضعیت کلی بدن</span>
        <span className={`text-xs px-2 py-1 rounded-full ${meta.color}`}>
          جمع‌بندی
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full text-center -mt-4">
        <div className="text-2xl font-bold text-white mb-2">
          {primaryGoal === "muscular"
            ? "عضله‌سازی"
            : primaryGoal === "slim"
            ? "چربی‌سوزی"
            : "متعادل"}
        </div>

        <p className="text-sm text-gray-300 leading-relaxed max-w-[220px]">
          {meta.message}
        </p>

        {bmi && (
          <div className="text-[11px] text-gray-400 mt-3">
            BMI فعلی: {bmi}
          </div>
        )}
      </div>
    </div>
  );
}
