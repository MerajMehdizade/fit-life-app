"use client";

import { useEffect, useState } from "react";

export default function CoachStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch("/api/coach/students", {
        credentials: "include",
      });
      const json = await res.json();
      setStudents(json);
    } catch (e) {
      console.error("Error loading students:", e);
    }
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="p-10 ">در حال بارگذاری...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-8">دانشجوهای من</h1>

      {students.length === 0 && (
        <p className="text-gray-300">هیچ دانشجویی برای شما ثبت نشده.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {students.map((s) => (
          <div key={s._id} className="border p-5 rounded bg-gray-800">
            <p className="text-xl">{s.name}</p>
            <p className="text-gray-300">{s.email}</p>

            <a
              href={`/dashboard/coach/students/${s._id}`}
              className="mt-4 inline-block bg-blue-600 text-white px-3 py-2 rounded"
            >
              مشاهده پروفایل دانشجو
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
