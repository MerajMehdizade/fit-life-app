"use client";

import { useState } from "react";

type SortType = "asc" | "desc" | null;

export default function StudentsTable({
  data,
  onDelete,
  onSort,
  sort,
  onToggleStatus,
}: {
  data: any[];
  onDelete: (id: string) => void;
  onSort: () => void;
  sort: SortType;
  onToggleStatus: (id: string) => Promise<void>;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const handleToggleStatus = async (id: string) => {
    setLoadingIds(prev => new Set(prev).add(id));
    try {
      await onToggleStatus(id);
    } finally {
      setLoadingIds(prev => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }
  };

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block relative overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-sm text-right min-w-[900px]">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={onSort}
              >
                نام {sort === "asc" ? "↑" : sort === "desc" ? "↓" : ""}
              </th>
              <th className="px-6 py-3">ایمیل</th>
              <th className="px-6 py-3">مربی</th>
              <th className="px-6 py-3">برنامه‌ها</th>
              <th className="px-6 py-3">اکشن</th>
            </tr>
          </thead>

          <tbody>
            {data.map((u) => (
              <tr
                key={u._id}
                className="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700"
              >
                <td className="px-6 py-4">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">
                  {u.coachName || (
                    <span className="text-gray-400">بدون مربی</span>
                  )}
                </td>
                <td className="px-6 py-4">{u.plansCount} برنامه</td>
                <td className="px-6 py-4">
                  <Actions
                    u={u}
                    onDelete={onDelete}
                    onToggleStatus={handleToggleStatus}
                    loading={loadingIds.has(u._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden space-y-4">
        {data.map((u) => {
          const open = openId === u._id;

          return (
            <div
              key={u._id}
              className={`rounded-xl border border-gray-700 overflow-hidden transition-colors
          ${open ? "bg-gray-800" : "bg-gray-900"}`}
            >
              {/* HEADER */}
              <button
                onClick={() => setOpenId(open ? null : u._id)}
                className="w-full p-4 flex justify-between items-center"
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="font-semibold text-base mx-auto">{u.name}</span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full
                      ${u.status === "active" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                  >
                    {u.status === "active" ? "فعال" : "تعلیق"}
                  </span>
                </div>

                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300
              ${open ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* BODY */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out
            ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="px-4 pb-4 space-y-3 text-sm text-gray-300">
                  <InfoRow label="ایمیل" value={u.email} />
                  <InfoRow label="مربی" value={u.coachName || "بدون مربی"} />
                  <InfoRow label="برنامه‌ها" value={`${u.plansCount} برنامه`} />

                  <div className="pt-3 border-t border-gray-700">
                    <Actions
                      u={u}
                      onDelete={onDelete}
                      onToggleStatus={handleToggleStatus}
                      loading={loadingIds.has(u._id)}
                      mobile
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ================= INFO ROW ================= */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* ================= ACTIONS ================= */
function Actions({
  u,
  onDelete,
  onToggleStatus,
  mobile = false,
  loading = false,
}: {
  u: any;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  mobile?: boolean;
  loading?: boolean;
}) {
  return (
    <div className={`flex items-center ${mobile ? "gap-5" : "gap-3"}`}>
      {/* وضعیت */}
      <button
        onClick={() => onToggleStatus(u._id)}
        disabled={loading}
        className={`px-3 py-1 rounded text-xs font-medium flex items-center justify-center transition
          ${u.status !== "active"
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-red-600 hover:bg-red-700 text-white"
          }`}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          u.status !== "active" ? "فعال" : "تعلیق"
        )}
      </button>

      <a
        href={`/dashboard/admin/edit/${u._id}`}
        className="hover:text-blue-400 transition"
        title="ویرایش"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="text-gray-400 size-5 md:size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
          />
        </svg>
      </a>

      <button
        onClick={() => onDelete(u._id)}
        className="hover:scale-110 transition"
        title="حذف"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="text-red-600 size-5 md:size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
}
