"use client";

import { useEffect, useState } from "react";
import Pagination from "../../_components/Pagination";
import ConfirmModal from "../../_components/ConfirmModal";
import TableSkeleton from "../../_components/TableSkeleton";
import SearchBox from "../../_components/SearchBox";

interface Admin {
  _id: string;
  name: string;
  email: string;
}

export default function AdminAdminsPage() {
  const [data, setData] = useState<Admin[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);

  const load = async (pageParam = page, searchParam = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", pageParam.toString());
      params.append("limit", "10");
      params.append("role", "admin");
      if (searchParam) params.append("search", searchParam);

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        credentials: "include",
      });

      const json = await res.json();
      setData(json.data ?? []);
      setPagination(json.pagination ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* load on page */
  useEffect(() => {
    load();
  }, [page]);

  /* debounce search */
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(1, search);
    }, 500);

    setPagination(null);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="space-y-6 p-3 pb-5 bg-gray-900 text-gray-100" dir="rtl">
      <h1 className="text-xl md:text-2xl font-bold">لیست ادمین‌ها</h1>

      {/* Search */}
      <div className="flex justify-between items-center gap-5">
        <SearchBox
          value={search}
          onChange={setSearch}
          placehold="جستجوی ادمین..."
        />
        <div className="flex flex-wrap w-100 justify-end items-center gap-3">
          <a href="/dashboard/admin/admins/create" className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">ادمین جدید</a>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : data.length === 0 ? (
        <p className="text-gray-400 mt-5">ادمینی پیدا نشد</p>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full text-sm text-right min-w-[700px]">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3">نام</th>
                  <th className="px-6 py-3">ایمیل</th>
                  <th className="px-6 py-3">اکشن</th>
                </tr>
              </thead>
              <tbody>
                {data.map((a) => (
                  <tr
                    key={a._id}
                    className="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700"
                  >
                    <td className="px-6 py-4">{a.name}</td>
                    <td className="px-6 py-4">{a.email}</td>
                    <td className="px-6 py-4 flex gap-3">
                      <a
                        href={`/dashboard/admin/edit/${a._id}`}
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
                        onClick={() => setDeleteId(a._id)}
                        className="hover:scale-110 transition"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-4">
            {data.map((a) => {
              const open = mobileOpenId === a._id;

              return (
                <div
                  key={a._id}
                  className={`rounded-xl border border-gray-700 overflow-hidden
                  ${open ? "bg-gray-800" : "bg-gray-900"}`}
                >
                  <button
                    onClick={() =>
                      setMobileOpenId(open ? null : a._id)
                    }
                    className="w-full p-4 flex justify-between items-center"
                  >
                    <span className="font-semibold">{a.name}</span>
                    
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

                  <div
                    className={`transition-all duration-300 overflow-hidden
                    ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="px-4 pb-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">ایمیل</span>
                        <span>{a.email}</span>
                      </div>

                      <div className="pt-3 border-t border-gray-700 flex gap-4">
                        <a
                          href={`/dashboard/admin/edit/${a._id}`}
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
                          onClick={() => setDeleteId(a._id)}
                          className="hover:scale-110 transition"
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
      )}

      {/* Pagination */}
      {pagination && (
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          setPage={setPage}
        />
      )}

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
