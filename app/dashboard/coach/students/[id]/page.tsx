"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TrainingProgram from "../TrainingProgram/TrainingProgram";
import DietProgram from "../DietProgram/DietProgram";
import ProgressHistory from "../ProgressHistory/ProgressHistory";
import Loading from "@/app/Components/LoadingSpin/Loading";

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

  if (loading) return <Loading />
  if (!student) return <p className="p-10 text-red-500">دانشجو یافت نشد.</p>;

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl mb-6">
        پروفایل {student.name}
      </h1>

      {/* اطلاعات پایه */}
      <div className="bg-gray-950 p-5 rounded">
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