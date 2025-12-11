"use client";
import { useEffect, useState } from "react";

export default function StudentsWithoutProgram() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/students/no-plan")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">در حال بارگذاری...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">دانشجویان بدون برنامه</h1>

      {students.length === 0 ? (
        <p className="text-gray-500">همه دانشجویان دارای برنامه هستند.</p>
      ) : (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-right">نام</th>
              <th className="p-3 text-right">ایمیل</th>
              <th className="p-3 text-right">مربی</th>
              <th className="p-3 text-right">وضعیت برنامه</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.coach ? s.coach.name : "بدون مربی"}</td>
                <td className="p-3 text-red-700 font-semibold">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
