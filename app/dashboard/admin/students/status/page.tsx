"use client";

import { useEffect, useState } from "react";

export default function StudentStatusPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    try {
      const res = await fetch("/api/admin/students/status", {
        credentials: "include",
      });

      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error("Error loading students:", err);
    }
    setLoading(false);
  };

  const toggleStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/students/status/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setStudents((prev) =>
          prev.map((student) =>
            student._id === id
              ? {
                  ...student,
                  status:
                    student.status === "active" ? "suspended" : "active",
                }
              : student
          )
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  if (loading) return <p className="p-5">در حال بارگذاری...</p>;

  return (
    <div dir="rtl" className="text-white">
      <h1 className="text-3xl mb-6 font-bold">وضعیت دانشجوها</h1>

      <div className="bg-gray-600 p-5 rounded-xl shadow">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-gray-400 text-pink-300">
              <th className="p-3">نام</th>
              <th className="p-3">ایمیل</th>
              <th className="p-3">مربی</th>
              <th className="p-3">برنامه‌ها</th>
              <th className="p-3">وضعیت</th>
              <th className="p-3">اقدامات</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-b border-gray-700">
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.email}</td>

                <td className="p-3">
                  {student.coachName || (
                    <span className="text-gray-300">بدون مربی</span>
                  )}
                </td>

                <td className="p-3">
                  {student.plansCount} برنامه
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      student.status === "active"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {student.status === "active" ? "فعال" : "تعلیق"}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(student._id)}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition
                      ${
                        student.status === "active"
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-green-500 hover:bg-green-700"
                      }`}
                  >
                    {student.status === "active" ? "تعلیق" : "فعال‌سازی"}
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
