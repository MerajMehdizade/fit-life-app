"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);

  const load = async () => {
    const res = await fetch(
      `/api/admin/users?page=${page}&limit=10&search=${search}&role=${role}`,
      { credentials: "include" }
    );

    const json = await res.json();

    setData(json.data);
    setPagination(json.pagination);
  };

  useEffect(() => {
    load();
  }, [page, role]);

  const handleSearch = () => {
    setPage(1);
    load();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-5">لیست کاربران</h1>

      {/* --- Search + Filter --- */}
      <div className="flex gap-4 mb-5">

        <input
          placeholder="جستجو..."
          className="border p-2 text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 text-black"
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
        >
          <option value="all">همه نقش‌ها</option>
          <option value="student">student</option>
          <option value="coach">coach</option>
          <option value="admin">admin</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          جستجو
        </button>

      </div>

      {/* --- Table --- */}
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
                <a
                  href={`/dashboard/admin/users/edit/${u._id}`}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  ویرایش
                </a>
                <button
                  onClick={async () => {
                    await fetch(`/api/admin/users/${u._id}`, {
                      method: "DELETE",
                      credentials: "include",
                    });
                    load();
                  }}
                  className="bg-red-600 text-white p-2 rounded"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Pagination --- */}
      {pagination && (
        <div className="flex gap-3 mt-5">
          <button
            disabled={page === 1}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            onClick={() => setPage((p) => p - 1)}
          >
            قبلی
          </button>

          <span className="text-white">
            صفحه {pagination.page} از {pagination.pages}
          </span>

          <button
            disabled={page === pagination.pages}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
          >
            بعدی
          </button>
        </div>
      )}

    </div>
  );
}
