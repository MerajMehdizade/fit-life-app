"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/Components/Form/Button";
import { Form } from "@/app/Components/Form/Form";
import { Select } from "@/app/Components/Form/Select";
import Toast from "@/app/Components/toast/Toast";
import Loading from "@/app/Components/LoadingSpin/Loading";

export default function AssignPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const json = await res.json();

      const users = json.data ?? [];

      setStudents(users.filter((u: any) => u.role === "student"));
      setCoaches(users.filter((u: any) => u.role === "coach"));
    } catch (e) {
      setToast({
        show: true,
        message: "خطا در دریافت کاربران",
        type: "error",
      });
    }
    setLoading(false);
  };

  const assignNow = async () => {
    if (!selectedStudent || !selectedCoach) {
      setToast({
        show: true,
        message: "لطفا دانشجو و مربی را انتخاب کنید",
        type: "error",
      });
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/students/assign", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: selectedStudent,
        coachId: selectedCoach,
      }),
    });

    setLoading(false);

    setToast({
      show: true,
      message: res.ok ? "✔ با موفقیت اختصاص داده شد" : "❌ خطا در عملیات",
      type: res.ok ? "success" : "error",
    });
  };

  useEffect(() => {
    loadData();
  }, []);
  if (loading) return <Loading />
  return (
    <>

      <section className="bg-white dark:bg-gray-900 flex items-center justify-center">
        <Form onSubmit={(e) => { e.preventDefault(); assignNow(); }}>

          <h1 className="text-white text-2xl text-center mb-10">
            اختصاص دانشجو به مربی
          </h1>

          {/* دانشجو */}
          <div className="mb-5">
            <label className="block mb-2 text-sm text-gray-300">دانشجو</label>
            <Select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">انتخاب دانشجو</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} — {s.email}
                </option>
              ))}
            </Select>
          </div>

          {/* مربی */}
          <div className="mb-8">
            <label className="block mb-2 text-sm text-gray-300">مربی</label>
            <Select
              value={selectedCoach}
              onChange={(e) => setSelectedCoach(e.target.value)}
            >
              <option value="">انتخاب مربی</option>
              {coaches.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} — {c.email}
                </option>
              ))}
            </Select>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "در حال ثبت..." : "اختصاص"}
          </Button>
        </Form>

        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </section>
    </>
  );
}
