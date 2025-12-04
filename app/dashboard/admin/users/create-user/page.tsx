"use client";

import { useState } from "react";

export default function CreateUserPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "coach",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.message);
    } else {
      setMsg("کاربر با موفقیت ساخته شد");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="font-bold text-xl mb-4 text-center">ایجاد کاربر جدید</h1>

      <form onSubmit={submit} className="space-y-4 max-w-md mx-auto">
        <input
          className="border p-2 w-full rounded"
          placeholder="نام"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="ایمیل"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="پسورد"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="border p-2 w-full rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">دانش‌آموز</option>
          <option value="coach">مربی</option>
          <option value="admin">ادمین</option>
        </select>

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "در حال ساخت..." : "ثبت کاربر"}
        </button>

        {msg && <p className="text-red-500">{msg}</p>}
      </form>
    </div>
  );
}
