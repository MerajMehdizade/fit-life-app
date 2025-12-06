"use client";

import { useEffect, useState } from "react";

export default function CoachStatusPage() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // دریافت لیست مربیان از API
  const loadCoaches = async () => {
    try {
      const res = await fetch("/api/admin/coaches/status", {
        credentials: "include",
      });

      const data = await res.json();
      setCoaches(data.coaches || []);
    } catch (err) {
      console.error("Error loading coaches:", err);
    }
    setLoading(false);
  };

  // تغییر وضعیت مربی
  const toggleStatus = async (coachId: string) => {
    try {
      const res = await fetch(`/api/admin/coaches/status/${coachId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        // آپدیت در سمت UI
        setCoaches((prev) =>
          prev.map((c) =>
            c._id === coachId
              ? { ...c, status: c.status === "active" ? "suspended" : "active" }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    loadCoaches();
  }, []);

  if (loading) return <p className="p-5">در حال بارگذاری...</p>;

  return (
    <div dir="rtl" className="text-white">

      <h1 className="text-3xl mb-6 font-bold">وضعیت مربیان</h1>

      <div className="bg-gray-600 p-5 rounded-xl shadow">

        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-gray-400 text-pink-300">
              <th className="p-3">نام</th>
              <th className="p-3">ایمیل</th>
              <th className="p-3">شاگردان</th>
              <th className="p-3">وضعیت</th>
              <th className="p-3">اقدامات</th>
            </tr>
          </thead>

          <tbody>
            {coaches.map((coach) => (
              <tr key={coach._id} className="border-b border-gray-700">
                <td className="p-3">{coach.name}</td>
                <td className="p-3">{coach.email}</td>
                <td className="p-3">{coach.studentsCount} نفر</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      coach.status === "active"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {coach.status === "active" ? "فعال" : "تعلیق"}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(coach._id)}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition
                      ${
                        coach.status === "active"
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-green-500 hover:bg-green-700"
                      }`}
                  >
                    {coach.status === "active" ? "تعلیق" : "فعال‌سازی"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}
