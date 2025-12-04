"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function StudentProfilePage() {
  const params = useParams();
  const id = params.id;

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadStudent = async () => {
    try {
      const res = await fetch(`/api/coach/students/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setStudent(data);
    } catch (e) {
      console.error("Error loading student:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStudent();
  }, []);

  if (loading) return <p className="p-10">در حال بارگذاری...</p>;
  if (!student) return <p className="p-10 text-red-500">دانشجو یافت نشد.</p>;

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl mb-6">
        پروفایل {student.name}
      </h1>

      {/* اطلاعات پایه */}
      <div className="bg-gray-900 p-5 rounded">
        <p>📧 {student.email}</p>
        <p>📱 {student.phone || "شماره ثبت نشده"}</p>
        <p>🎯 هدف اصلی: {student.profile?.primaryGoal || "-"}</p>
      </div>

      {/* برنامه تمرینی */}
      <TrainingProgram student={student} />

      {/* برنامه غذایی */}
      <DietProgram student={student} />

      {/* تاریخچه پیشرفت */}
      <ProgressHistory student={student} />
    </div>
  );
}
function TrainingProgram({ student }: any) {
  const [program, setProgram] = useState(student.profile?.trainingProgram || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/coach/students/${student._id}/training`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program }),
    });
    setSaving(false);
    alert("برنامه تمرینی ذخیره شد");
  };

  return (
    <div className="bg-gray-800 p-5 rounded space-y-3">
      <h2 className="text-2xl">🏋️ برنامه تمرینی</h2>

      <textarea
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        className="w-full p-3 bg-gray-700 rounded"
        rows={6}
      ></textarea>

      <button
        onClick={save}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {saving ? "در حال ذخیره..." : "ذخیره"}
      </button>
    </div>
  );
}
function DietProgram({ student }: any) {
  const [diet, setDiet] = useState(student.profile?.dietPlan || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/coach/students/${student._id}/diet`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diet }),
    });
    setSaving(false);
    alert("برنامه غذایی ذخیره شد");
  };

  return (
    <div className="bg-gray-800 p-5 rounded space-y-3">
      <h2 className="text-2xl">🍽 برنامه غذایی</h2>

      <textarea
        value={diet}
        onChange={(e) => setDiet(e.target.value)}
        className="w-full p-3 bg-gray-700 rounded"
        rows={6}
      ></textarea>

      <button
        onClick={save}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {saving ? "در حال ذخیره..." : "ذخیره"}
      </button>
    </div>
  );
}
type ProgressRecord = {
  date: string | Date;
  weight: number;
  bodyFat?: number;
};

function ProgressHistory({ student }: any) {
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<ProgressRecord[]>(student.profile?.progressHistory || []);

  const add = async () => {
    if (!weight) return alert("وزن را وارد کنید");

    setSaving(true);

    await fetch(`/api/coach/students/${student._id}/progress`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight, bodyFat }),
    });

    setSaving(false);

    setHistory([
      ...history,
      {
        date: new Date(),
        weight: Number(weight),
        bodyFat: Number(bodyFat),
      },
    ]);

    setWeight("");
    setBodyFat("");
  };

  return (
    <div>
      {history.map((p: ProgressRecord, i: number) => (
        <div key={i}>
          <span>{new Date(p.date).toLocaleDateString("fa-IR")}</span>
          <span>{p.weight}</span>
          <span>{p.bodyFat}</span>
        </div>
      ))}
    </div>
  );
}

