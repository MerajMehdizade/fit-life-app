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
                                    className="p-2 text-sm font-medium tracking-wide  capitalize transition-colors duration-300 transform text-green-600 rounded hover:text-green-700 focus:outline-none  flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-hexagon-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
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
                                                    className="hover:scale-110 transition mx-2"
                                                    title={u.status === "active" ? "فعال است" : "برای فعال سازی ضربه بزنید"}
                                                >
                                                    {loadingIds.has(u._id) ? (
                                                        <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    ) : u.status !== "active" ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={28}
                                                            height={28}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="text-green-600 icon icon-tabler icon-tabler-user-check"
                                                        >
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
                                                            <path d="M15 19l2 2l4 -4" />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={28}
                                                            height={28}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="text-red-600 icon icon-tabler icon-tabler-user-cancel"
                                                        >
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
                                                            <path d="M19 19m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                                            <path d="M17 21l4 -4" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                            <a
                                                href={`/dashboard/admin/edit/${u._id}`}
                                                className="text-blue-400 hover:text-blue-400 transition"
                                                title="Edit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="  icon icon-tabler icons-tabler-outline icon-tabler-user-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" /><path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" /></svg>
                                            </a>

                                            <button
                                                onClick={() => setDeleteId(u._id)}
                                                className="hover:scale-110 transition"
                                                title="Remove"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-red-600   icon icon-tabler icons-tabler-outline icon-tabler-user-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.009 .128" /><path d="M16 19h6" /></svg>
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
                                                {role !== "admin" && <button
                                                    onClick={() => toggleStatus(u._id)}
                                                    disabled={loadingIds.has(u._id)}
                                                    className="hover:scale-110 transition mx-2"
                                                    title={u.status === "active" ? "فعال است" : "برای فعال سازی ضربه بزنید"}
                                                >
                                                    {loadingIds.has(u._id) ? (
                                                        <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    ) : u.status !== "active" ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={28}
                                                            height={28}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="text-green-600 icon icon-tabler icon-tabler-user-check"
                                                        >
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
                                                            <path d="M15 19l2 2l4 -4" />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={28}
                                                            height={28}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="text-red-600 icon icon-tabler icon-tabler-user-cancel"
                                                        >
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
                                                            <path d="M19 19m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                                            <path d="M17 21l4 -4" />
                                                        </svg>
                                                    )}
                                                </button>}

                                                <a
                                                    href={`/dashboard/admin/edit/${u._id}`}
                                                    className="hover:text-blue-400 text-blue-400  transition"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className=" icon icon-tabler icons-tabler-outline icon-tabler-user-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" /><path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" /></svg>
                                                </a>

                                                <button
                                                    onClick={() => setDeleteId(u._id)}
                                                    className="hover:scale-110 transition"
                                                    title="Remove"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-red-600  icon icon-tabler icons-tabler-outline icon-tabler-user-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.009 .128" /><path d="M16 19h6" /></svg>
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
                        const idToDelete = deleteId;

                        try {
                            const url = `/api/admin/users/${idToDelete}`
                            const res = await fetch(url, { method: "DELETE", credentials: "include" });
                            const json = await res.json();

                            if (json.msg === "Deleted") {
                                setData((prev) => prev.filter((u) => u._id !== idToDelete));
                            } else {
                                console.error("Delete failed:", json);
                            }
                        } catch (err) {
                            console.error(err);
                        } finally {
                            setDeleteId(null);
                        }
                    }}
                />
            )}

        </div>
    );
}
