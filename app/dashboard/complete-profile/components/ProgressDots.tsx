export default function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={`w-4 h-4 rounded-full ${idx <= step ? "bg-green-400" : "bg-gray-700"}`}
        />
      ))}
    </div>
  );
}
