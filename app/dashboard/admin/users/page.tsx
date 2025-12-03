"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users", { credentials: "include" });
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const delUser = async (id: string) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    load();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-5">لیست کاربران</h1>

      {loading && <p>Loading...</p>}

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2">نام</th>
            <th className="p-2">ایمیل</th>
            <th className="p-2">نقش</th>
            <th className="p-2">اکشن</th>
          </tr>
        </thead>

        <tbody>
          {data.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2 flex gap-3">
                <button
                  onClick={() => delUser(u._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  حذف
                </button>
                <a
                  href={`/dashboard/admin/users/edit/${u._id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  ویرایش
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
