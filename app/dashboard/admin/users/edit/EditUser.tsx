"use client";

import { useEffect, useState, useCallback } from "react";

export default function EditUser({ id }: { id: string }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/users`, { credentials: "include" });
      const list = await res.json();

      const user = list.find((u: any) => u._id === id);
      if (user) setForm(user);

    } catch (err) {
      console.error("Failed to load user:", err);
    }
    setLoading(false);
  }, [id]);

  const submit = async () => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    window.location.href = "/dashboard/admin/users";
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading) return <p className="p-10">در حال بارگذاری...</p>;

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl mb-5">ویرایش کاربر</h1>

      <div className="flex flex-col gap-4 max-w-md">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 text-black"
          placeholder="نام"
        />

        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 text-black"
          placeholder="ایمیل"
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 text-black"
        >
          <option value="user">user</option>
          <option value="coach">coach</option>
          <option value="admin">admin</option>
        </select>

        <button
          onClick={submit}
          className="bg-blue-600 text-white p-3 rounded"
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
}
