"use client";

interface BodyTypeComparisonProps {
  gender?: "male" | "female";
  currentType?: "slim" | "average" | "fit" | "muscular";
  targetType?: "slim" | "average" | "fit" | "muscular";
}

export default function BodyTypeComparison({ gender, currentType, targetType }: BodyTypeComparisonProps) {
  const g = gender ?? "male";
  const currentImg = currentType ? `/body/${g}/${currentType}.PNG` : `/body/${g}/average.PNG`;
  const targetImg = targetType ? `/body/${g}/${targetType}.PNG` : `/body/${g}/average.PNG`;

  return (
    <div className="flex  items-center justify-center gap-6 bg-gray-800/70 p-6 rounded-3xl border border-gray-700 shadow-lg w-full max-w-4xl">
      <div className="flex flex-col items-center">
        <span className="text-gray-400 mb-2">هدف</span>
        <img
          src={targetImg}
          alt={targetType ?? "target"}
          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border-2 border-green-600"
        />
      </div>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right-dashed"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12h.5m3 0h1.5m3 0h6" />
          <path d="M15 16l4 -4" />
          <path d="M15 8l4 4" />
        </svg>
      </span>
      <div className="flex flex-col items-center">
        <span className="text-gray-400 mb-2">وضعیت فعلی</span>
        <img
          src={currentImg}
          alt={currentType ?? "current"}
          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border-2 border-cyan-600"
        />
      </div>
    </div>
  );
}
