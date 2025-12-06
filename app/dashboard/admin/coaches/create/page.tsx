"use client";

import { useState } from "react";

export default function CreateCoachPage() {
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
    setMsg(res.ok ? "مربی با موفقیت ساخته شد" : data.message);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto">

      <h1 className="text-xl font-bold mb-4 text-center">ایجاد مربی جدید</h1>

      <form onSubmit={submit} className="space-y-4">

        <input
          className="border p-2 rounded w-full"
          placeholder="نام مربی"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="ایمیل"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="رمز عبور"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded w-full"
        >
          {loading ? "در حال ساخت..." : "ثبت مربی"}
        </button>

        {msg && <p className="text-center ">{msg}</p>}
      </form>

    </div>
  );
}
