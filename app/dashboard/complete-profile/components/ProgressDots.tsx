interface ProgressDotsProps {
  step: number;
  total: number;
}

export default function ProgressDots({ step, total }: ProgressDotsProps) {

  return (
    <div className="flex justify-center items-center gap-3 mb-6">
      {Array.from({ length: total }).map((_, idx) => {
        const isActive = idx === step;
        const isCompleted = idx < step;

        return (
          <div
            key={idx}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${isActive ? "bg-green-400 scale-125" : ""}
              ${isCompleted ? "bg-green-500" : ""}
              ${idx > step ? "bg-gray-700" : ""}
            `}
          />
        );
      })}
    </div>
  );
}
