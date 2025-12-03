"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import DropdownMenu from "@/app/Components/DropdownMenu/DropdownMenu";
import { useUser } from "@/app/context/UserContext";

export default function AdminDashboard() {
  const { logout } = useUser();
  const [users, setUsers] = useState<any[] | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const json = await res.json();
      setUsers(json);
    } catch (err) {
      console.error("Load users failed:", err);
      setUsers([]);
    }
  }, []);

  const delUser = useCallback(
    async (id: string) => {
      await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      load();
    },
    [load]
  );

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="bg-gray-900 min-h-screen text-white">

      <DropdownMenu
        role="Admin"
        items={[
          { label: "برنامه تمرینی", href: "/program" },
          { label: "ترجیحات", href: "/preferences" },
          { label: "خروج", onClick: logout, danger: true },
        ]}
      />

      <div className="mt-5 text-center space-y-5">
        <h1 className="text-2xl">Admin Dashboard</h1>
        <p>مدیریت مربی‌ها و کاربران</p>
        <Link
          href="/dashboard/admin/create-user"
          className="p-2 bg-green-500 rounded-xl inline-block"
        >
          اضافه کردن نقش 
        </Link>
      </div>

      <div className="p-10">
        <h2 className="text-xl mb-4">لیست کاربران</h2>

        {!users && <p>در حال بارگذاری...</p>}

        {users && users.length === 0 && (
          <p className="text-gray-400">هیچ کاربری پیدا نشد</p>
        )}

        {users && users.length > 0 && (
          <table className="w-full border text-white">
            <thead>
              <tr className="border-b text-gray-300">
                <th className="p-2">نام</th>
                <th className="p-2">ایمیل</th>
                <th className="p-2">نقش</th>
                <th className="p-2">اکشن</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
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

                    <Link
                      href={`/dashboard/admin/users/edit/${u._id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      ویرایش
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
