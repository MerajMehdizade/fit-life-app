"use client";

import { useEffect, useState } from "react";
import Pagination from "../../_components/Pagination";
import ConfirmModal from "../../_components/ConfirmModal";
import TableSkeleton from "../../_components/TableSkeleton";
import SearchBox from "../../_components/SearchBox";

type SortType = "asc" | "desc" | null;

interface Coach {
  _id: string;
  name: string;
  email: string;
  studentsCount: number;
  status: "active" | "suspended";
  permissions: string[];
}

export default function AdminCoachesPage() {
  const [data, setData] = useState<Coach[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortType>(null);
  const [filter, setFilter] = useState({ noStudents: false, suspended: false });
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const load = async (pageParam = page, searchParam = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", pageParam.toString());

      if (searchParam) params.append("search", searchParam);
      if (sort) params.append("sort", sort);

      const res = await fetch(`/api/admin/coaches/status?${params.toString()}`, {
        credentials: "include",
      });

      const json = await res.json();

      setData(json.coaches ?? []);
      setPagination(json.pagination ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  // Toggle coach status
  const toggleStatus = async (id: string) => {
    setLoadingIds(prev => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/admin/coaches/status/${id}`, { method: "PATCH", credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setData(prev => prev.map(c => c._id === id ? { ...c, status: c.status === "active" ? "suspended" : "active" } : c));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };


  const handleSort = () => setSort(prev => (prev === "asc" ? "desc" : "asc"));

  // Load data on mount / page / sort
  useEffect(() => { load(); }, [page, sort]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(1, search);
    }, 500);
    setPagination(null);
    return () => clearTimeout(t);
  }, [search]);


  const filteredData = search
    ? data
    : data.filter(c => {
      if (filter.noStudents && c.studentsCount > 0) return false;
      if (filter.suspended && c.status !== "suspended") return false;
      return true;
    });
  return (
    <div className="space-y-6 p-3 pb-5 bg-gray-900 text-gray-100" dir="rtl">
      <h1 className="text-xl md:text-2xl font-bold mb-4">لیست مربیان</h1>

      {/* Search & actions */}
      <div className="flex justify-between items-center gap-5">
        <SearchBox value={search} onChange={setSearch} placehold="جستجوی مربی..." />
        <div className="flex flex-wrap w-100 justify-end items-center gap-3">
          <a href="/dashboard/admin/coaches/create" className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">مربی جدید</a>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-5">
        {[
          { label: "بدون شاگرد", key: "noStudents", color: "blue" },
          { label: "تعلیق شده", key: "suspended", color: "red" },
        ].map(f => (
          <label key={f.key} className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-700 transition">
            <input
              type="checkbox"
              checked={filter[f.key as keyof typeof filter]}
              onChange={e => setFilter(prev => ({ ...prev, [f.key]: e.target.checked }))}
              className={`w-4 h-4 accent-${f.color}-500`}
            />
            <span className="text-gray-100 text-sm font-medium">{f.label}</span>
          </label>
        ))}
      </div>

      {/* Table */}
      {loading ? <TableSkeleton /> :
        filteredData.length === 0 ? <p className="mt-5 text-gray-400">مربی‌ای پیدا نشد</p> :
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm text-right min-w-[900px]">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 cursor-pointer" onClick={handleSort}>نام {sort === "asc" ? "↑" : sort === "desc" ? "↓" : ""}</th>
                    <th className="px-6 py-3">ایمیل</th>
                    <th className="px-6 py-3">شاگردان</th>
                    <th className="px-6 py-3">اکشن</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(c => (
                    <tr key={c._id} className="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700">
                      <td className="px-6 py-4">{c.name}</td>
                      <td className="px-6 py-4">{c.email}</td>
                      <td className="px-6 py-4">{c.studentsCount} نفر</td>
                      <td className="px-6 py-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleStatus(c._id)}
                          disabled={loadingIds.has(c._id)}
                          className={`px-3 py-1 rounded text-xs font-medium flex items-center justify-center transition
    ${c.status !== "active" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                        >
                          {loadingIds.has(c._id) ? (
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          ) : (
                            c.status !== "active" ? "فعال" : "تعلیق"
                          )}
                        </button>

                        <a href={`/dashboard/admin/edit/${c._id}`} className="hover:text-blue-400 transition" title="ویرایش">
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
                        <button onClick={() => setDeleteId(c._id)} className="hover:scale-110 transition" title="حذف">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-4">
              {filteredData.map(c => {
                const open = mobileOpenId === c._id;

                return (
                  <div
                    key={c._id}
                    className={`rounded-xl border border-gray-700 overflow-hidden transition-colors ${open ? "bg-gray-800" : "bg-gray-900"
                      }`}
                  >
                    {/* Header */}
                    <button
                      onClick={() => setMobileOpenId(open ? null : c._id)}
                      className="w-full p-4 flex justify-between items-center"
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold text-base">{c.name}</span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${c.status === "active"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                            }`}
                        >
                          {c.status === "active" ? "فعال" : "تعلیق شده"}
                        </span>
                      </div>

                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""
                          }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Accordion Content */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                      <div className="px-4 pb-4 space-y-3 text-sm text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-400">ایمیل</span>
                          <span>{c.email}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">شاگردان</span>
                          <span>{c.studentsCount} نفر</span>
                        </div>

                        <div className="pt-3 border-t border-gray-700 flex gap-3">
                          <button
                            onClick={() => toggleStatus(c._id)}
                            disabled={loadingIds.has(c._id)}
                            className={`px-3 py-1 rounded text-xs font-medium flex items-center justify-center transition
    ${c.status !== "active" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                          >
                            {loadingIds.has(c._id) ? (
                              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                              c.status !== "active" ? "فعال" : "تعلیق"
                            )}
                          </button>

                          <a
                            href={`/dashboard/admin/edit/${c._id}`}
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
                            onClick={() => setDeleteId(c._id)}
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </>
      }

      {/* Pagination */}
      {pagination && <Pagination page={pagination.page} pages={pagination.pages} setPage={setPage} />}

      {/* Delete Modal */}
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;

          await fetch(`/api/admin/users/${deleteId}`, {
            method: "DELETE",
            credentials: "include",
          });

          setDeleteId(null);
          load();
        }}
      />

    </div>
  );
}
