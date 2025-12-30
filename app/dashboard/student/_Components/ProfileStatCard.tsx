"use client";

export default function ProfileStatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-gray-800/70 backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-gray-700 flex flex-col">
      <span className="text-gray-400 text-sm capitalize">{label.replace(/([A-Z])/g, " $1")}</span>
      <span className="text-white font-semibold text-lg truncate">{value ?? "-"}</span>
    </div>
  );
}
