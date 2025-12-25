"use client";

import { useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import Pagination from "./Pagination";
import ConfirmModal from "./ConfirmModal";
import TableSkeleton from "./TableSkeleton";

type SortType = "asc" | "desc" | null;

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: "active" | "suspended";
    plansCount?: number;
    coachName?: string;
    studentsCount?: number;
    role: "student" | "coach" | "admin";
    hasCoach?: boolean;
}

interface Props {
    role: "student" | "coach" | "admin";
}

export default function UnifiedUserList({ role }: Props) {
    const [data, setData] = useState<User[]>([]);
    const [pagination, setPagination] = useState<{ pages: number } | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [sort, setSort] = useState<SortType>(null);
    const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<Record<string, boolean>>({});
    const [open, setOpen] = useState(false);
    let urlRole = "";
    
    useEffect(() => {
        if (role === "student") setFilter({ noPlans: false, noCoach: false, suspended: false });
        if (role === "coach") setFilter({ noStudents: false, suspended: false });
        if (role === "admin") setFilter({});
    }, [role]);
    let roleTitle = ""
    if (role === "student") {
        roleTitle = "دانشجو"
    } else if (role === "coach") {
        roleTitle = "مربی"
    } else {
        roleTitle = "ادمین"
    }
    const load = async (pageParam = page, searchParam = search) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", pageParam.toString());
            if (searchParam) params.append("search", searchParam);
            if (sort) params.append("sort", sort);

            let url = "";
            if (role === "student") url = `/api/admin/students/status?${params.toString()}`;
            if (role === "coach") url = `/api/admin/coaches/status?${params.toString()}`;
            if (role === "admin") url = `/api/admin/users?role=admin&${params.toString()}`;

            const res = await fetch(url, { credentials: "include" });
            const json = await res.json();

            if (role === "student") {
                setData(json.students || []);
                setPagination(json.pagination || null);
            }
            if (role === "coach") {
                setData(json.coaches || []);
                setPagination(json.pagination || null);
            }
            if (role === "admin") {
                setData(json.data || []);
                setPagination(json.pagination || null);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const toggleStatus = async (id: string) => {
        setLoadingIds((prev) => new Set(prev).add(id));
        try {
            let url = "";
            if (role === "student") url = `/api/admin/students/status/${id}`;
            if (role === "coach") url = `/api/admin/coaches/status/${id}`;
            if (role === "admin") return;

            const res = await fetch(url, { method: "PATCH", credentials: "include" });
            const json = await res.json();
            if (json.success) {
                setData((prev) =>
                    prev.map((u) =>
                        u._id === id
                            ? { ...u, status: u.status === "active" ? "suspended" : "active" }
                            : u
                    )
                );
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const handleSort = () => setSort((prev) => (prev === "asc" ? "desc" : "asc"));

    useEffect(() => {
        load();
    }, [page, sort, role]);

    useEffect(() => {
        const t = setTimeout(() => {
            setPage(1);
            load(1, search);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const filteredData = data.filter((u) => {
        if (role === "student") {
            if (filter.noPlans && u.plansCount! > 0) return false;
            if (filter.noCoach && u.hasCoach) return false;
            if (filter.suspended && u.status !== "suspended") return false;
        }
        if (role === "coach") {
            if (filter.noStudents && u.studentsCount! > 0) return false;
            if (filter.suspended && u.status !== "suspended") return false;
        }
        return true;
    });

    if (role === 'student') {
        urlRole = 'students'
    } else if (role === 'coach') {
        urlRole = 'coaches'
    } else if (role === 'admin') {
        urlRole = 'admins'
    }
    return (
        <div className="space-y-6 p-3 pb-5 bg-gray-900 text-gray-100" dir="rtl">
            <h1 className="text-xl md:text-2xl font-bold mb-4">
                {role === "student" ? "لیست دانشجوها" : role === "coach" ? "لیست مربیان" : "لیست ادمین‌ها"}
            </h1>

            <div className="flex justify-between items-center gap-5">
                <SearchBox value={search} onChange={setSearch} placehold={`جستجوی ${roleTitle}...`} />
                <div className="flex flex-wrap w-100 justify-end items-center gap-3">
                    {/* Admin */}
                    {role === "admin" && (
                        <a
                            href={`/dashboard/admin/${urlRole}/create`}
                            className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                            ادمین جدید
                        </a>
                    )}

                    {/* Coach */}
                    {role === "coach" && (
                        <a
                            href={`/dashboard/admin/${urlRole}/create`}
                            className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                            مربی جدید
                        </a>
                    )}

                    {/* Student */}
                    {role === "student" && (
                        <>
                            <a
                                href={`/dashboard/admin/${urlRole}/create`}
                                className="hidden md:block px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                            >
                                دانشجو جدید
                            </a>
                            <a
                                href={`/dashboard/admin/${urlRole}/assign`}
                                className="hidden md:block px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                            >
                                انتساب دانشجو به مربی
                            </a>

                            {/* موبایل */}
                            <div className="md:hidden relative w-full flex justify-end">
                                <button
                                    onClick={() => setOpen(!open)}
                                    onBlur={() => setOpen(false)}
                                    className="p-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-400 focus:ring-opacity-50 flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>

                                {open && (
                                    <div className="absolute left-0 top-full mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden z-20 text-white">
                                        <a
                                            href="/dashboard/admin/students/create"
                                            className="block px-4 py-3 text-sm hover:bg-gray-900 transition-colors"
                                            onClick={() => setOpen(false)}
                                        >
                                            دانشجو جدید
                                        </a>

                                        <a
                                            href="/dashboard/admin/students/assign"
                                            className="block px-4 py-3 text-sm hover:bg-gray-900 transition-colors"
                                            onClick={() => setOpen(false)}
                                        >
                                            انتساب دانشجو به مربی
                                        </a>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

            </div>

            {role !== "admin" && (
                <div className="flex flex-wrap gap-4 mb-5">
                    {role === "student" &&
                        [
                            { label: "بدون برنامه", key: "noPlans", color: "blue" },
                            { label: "بدون مربی", key: "noCoach", color: "blue" },
                            { label: "تعلیق شده", key: "suspended", color: "red" },
                        ].map((f) => (
                            <label key={f.key} className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                                <input
                                    type="checkbox"
                                    checked={filter[f.key] || false}
                                    onChange={(e) => setFilter((prev) => ({ ...prev, [f.key]: e.target.checked }))}
                                    className={`w-4 h-4 accent-${f.color}-500`}
                                />
                                <span className="text-gray-100 text-sm font-medium">{f.label}</span>
                            </label>
                        ))}
                    {role === "coach" &&
                        [
                            { label: "بدون شاگرد", key: "noStudents", color: "blue" },
                            { label: "تعلیق شده", key: "suspended", color: "red" },
                        ].map((f) => (
                            <label key={f.key} className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                                <input
                                    type="checkbox"
                                    checked={filter[f.key] || false}
                                    onChange={(e) => setFilter((prev) => ({ ...prev, [f.key]: e.target.checked }))}
                                    className={`w-4 h-4 accent-${f.color}-500`}
                                />
                                <span className="text-gray-100 text-sm font-medium">{f.label}</span>
                            </label>
                        ))}
                </div>
            )}

            {loading ? (
                <TableSkeleton />
            ) : filteredData.length === 0 ? (
                <p className="mt-5 text-gray-400">{role === "student" ? "دانشجویی پیدا نشد" : role === "coach" ? "مربی‌ای پیدا نشد" : "ادمینی پیدا نشد"}</p>
            ) : (
                <>
                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
                        <table className="w-full text-sm text-right min-w-[700px]">
                            <thead className="bg-gray-800 border-b border-gray-700">
                                <tr>
                                    {role !== "admin" && <th className="px-6 py-3">آواتار</th>}
                                    <th className={`px-6 py-3 cursor-pointer ${role !== "admin" ? "select-none" : ""}`} onClick={role !== "admin" ? handleSort : undefined}>
                                        نام {sort === "asc" ? "↑" : sort === "desc" ? "↓" : ""}
                                    </th>
                                    <th className="px-6 py-3">ایمیل</th>
                                    {role === "student" && <th className="px-6 py-3">مربی</th>}
                                    {role === "student" && <th className="px-6 py-3">برنامه‌ها</th>}
                                    {role === "coach" && <th className="px-6 py-3">شاگردان</th>}
                                    <th className="px-6 py-3">اکشن</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((u) => (
                                    <tr key={u._id} className="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700">
                                        {role !== "admin" && (
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                                            </td>
                                        )}
                                        <td className="px-6 py-4">{u.name}</td>
                                        <td className="px-6 py-4">{u.email}</td>
                                        {role === "student" && <td className="px-6 py-4">{u.coachName || <span className="text-gray-400">بدون مربی</span>}</td>}
                                        {role === "student" && <td className="px-6 py-4">{u.plansCount} برنامه</td>}
                                        {role === "coach" && <td className="px-6 py-4">{u.studentsCount} نفر</td>}
                                        <td className="px-6 py-4 flex flex-wrap gap-2">
                                            {role !== "admin" && (
                                                <button
                                                    onClick={() => toggleStatus(u._id)}
                                                    disabled={loadingIds.has(u._id)}
                                                    className={`px-3 py-1 rounded text-xs font-medium flex items-center justify-center transition
                            ${u.status !== "active" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                                                >
                                                    {loadingIds.has(u._id) ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : u.status !== "active" ? "فعال" : "تعلیق"}
                                                </button>
                                            )}
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
                                                onClick={() => setDeleteId(u._id)}
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
                        {filteredData.map((u) => {
                            const open = mobileOpenId === u._id;
                            return (
                                <div key={u._id} className={`rounded-xl border border-gray-700 overflow-hidden transition-colors ${open ? "bg-gray-800" : "bg-gray-900"}`}>
                                    <button onClick={() => setMobileOpenId(open ? null : u._id)} className="w-full p-4 flex justify-between items-center">
                                        {role !== "admin" && <div className="flex items-center gap-3">
                                            <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-base">{u.name}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${u.status === "active" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                                                    {u.status === "active" ? "فعال" : "تعلیق شده"}
                                                </span>
                                            </div>
                                        </div>}
                                        {role === "admin" && <span className="font-semibold">{u.name}</span>}
                                        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                        <div className="px-4 pb-4 space-y-3 text-sm text-gray-300">
                                            <div className="flex justify-between"><span className="text-gray-400">ایمیل</span><span>{u.email}</span></div>
                                            {role === "student" && <div className="flex justify-between"><span className="text-gray-400">مربی</span><span>{u.coachName || "بدون مربی"}</span></div>}
                                            {role === "student" && <div className="flex justify-between"><span className="text-gray-400">برنامه‌ها</span><span>{u.plansCount} برنامه</span></div>}
                                            {role === "coach" && <div className="flex justify-between"><span className="text-gray-400">شاگردان</span><span>{u.studentsCount} نفر</span></div>}

                                            <div className="pt-3 border-t border-gray-700 flex flex-wrap gap-3">
                                                {role !== "admin" && <button onClick={() => toggleStatus(u._id)} disabled={loadingIds.has(u._id)} className={`px-3 py-1 rounded text-xs font-medium flex items-center justify-center transition ${u.status !== "active" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}>
                                                    {loadingIds.has(u._id) ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : u.status !== "active" ? "فعال" : "تعلیق"}
                                                </button>}

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
                                                    onClick={() => setDeleteId(u._id)}
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

            {pagination && <Pagination page={page} pages={pagination.pages} setPage={setPage} />}

            {deleteId && (
                <ConfirmModal
                    open={!!deleteId}
                    onClose={() => setDeleteId(null)}
                    onConfirm={async () => {
                        if (!deleteId) return;
                        try {
                            const url =
                                role === "student"
                                    ? `/api/admin/students/delete/${deleteId}`
                                    : role === "coach"
                                        ? `/api/admin/coaches/delete/${deleteId}`
                                        : `/api/admin/users/delete/${deleteId}`;
                            const res = await fetch(url, { method: "DELETE", credentials: "include" });
                            const json = await res.json();
                            if (json.success) {
                                setData((prev) => prev.filter((u) => u._id !== deleteId));
                            }
                        } catch (err) { console.error(err); }
                        setDeleteId(null);
                    }}
                />
            )}
        </div>
    );
}
