"use client";

import { useEffect, useState } from "react";

export default function AssignPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const json = await res.json();

      const users = json.data ?? [];

      setStudents(users.filter((u: any) => u.role === "student"));
      setCoaches(users.filter((u: any) => u.role === "coach"));

    } catch (e) {
      console.error("Load error:", e);
    }

    setLoading(false);
  };

  const assignNow = async () => {
    if (!selectedStudent || !selectedCoach) {
      setStatus("لطفا دانشجو و مربی را انتخاب کنید");
      return;
    }

    const res = await fetch("/api/admin/assign", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: selectedStudent,
        coachId: selectedCoach,
      }),
    });

    if (res.ok) {
      setStatus("✔ با موفقیت اختصاص داده شد");
    } else {
      setStatus("❌ خطا در عملیات");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <p className="p-10 text-white">در حال بارگذاری...</p>;

  return (
    <div className="p-10">

      <h1 className="text-3xl mb-8 text-center">
        اختصاص دانشجو به مربی
      </h1>

      <div className="max-w-lg flex flex-col gap-5 mx-auto">

        {/* انتخاب دانشجو */}
        <div className="flex flex-col ">
          <label className="mb-2">دانشجو:</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="p-3 text-black"
          >
            <option value="">انتخاب دانشجو</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} — {s.email}
              </option>
            ))}
          </select>
        </div>

        {/* انتخاب مربی */}
        <div className="flex flex-col">
          <label className="mb-2">مربی:</label>
          <select
            value={selectedCoach}
            onChange={(e) => setSelectedCoach(e.target.value)}
            className="p-3 text-black"
          >
            <option value="">انتخاب مربی</option>
            {coaches.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} — {c.email}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={assignNow}
          className="bg-blue-600 text-white p-3 rounded"
        >
          اختصاص
        </button>

        {status && (
          <p className="mt-3 text-black">{status}</p>
        )}
      </div>
    </div>
  );
}
