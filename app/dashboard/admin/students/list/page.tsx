"use client";

import { useEffect, useState } from "react";
import SearchBox from "../../_components/SearchBox";
import StudentsTable from "../../_components/StudentsTable";
import Pagination from "../../_components/Pagination";
import ConfirmModal from "../../_components/ConfirmModal";
import TableSkeleton from "../../_components/TableSkeleton";

type SortType = "asc" | "desc" | null;

export default function AdminStudentsPage() {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortType>(null);

  const [filter, setFilter] = useState({
    noPlans: false,
    noCoach: false,
    suspended: false,
  });

  // بارگذاری داده‌ها
  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (search) params.append("search", search);
      if (sort) params.append("sort", sort);

      const res = await fetch(`/api/admin/students/status?${params.toString()}`, { credentials: "include" });
      const json = await res.json();
      setData(json.students || []);
      setPagination(json.pagination);
    } catch (err) {
      console.error("Error loading students:", err);
    }
    setLoading(false);
  };

  // تغییر وضعیت دانشجو
  const toggleStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/students/status/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        setData(prev =>
          prev.map(u =>
            u._id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
          )
        );
      }
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  // تغییر مرتب‌سازی
  const handleSort = () => {
    setSort(prev => (prev === "asc" ? "desc" : "asc"));
  };

  // بارگذاری اولیه و تغییر صفحه / مرتب‌سازی
  useEffect(() => { load(); }, [page, sort]);

  // جستجوی real-time
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  // اعمال فیلترها به صورت درست
  const filteredData = data.filter(u => {
    const hasPlans = u.plansCount > 0;
    const isSuspended = u.status === "suspended";

    if (filter.noPlans && hasPlans) return false;
    if (filter.noCoach && u.hasCoach) return false; // 👈 این خط
    if (filter.suspended && !isSuspended) return false;

    return true;
  });

  return (
    <div className="space-y-6 p-3 bg-gray-900  text-gray-100" dir="rtl">
      <h1 className="text-xl md:text-2xl font-bold mb-4">لیست دانشجوها</h1>

      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-5">
        <SearchBox value={search} onChange={setSearch} placehold="جستجوی دانشجو...." />
        <div className="flex flex-wrap w-100 justify-start md:justify-end items-center gap-3">
          <a href="/dashboard/admin/students/create" className=" px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-400 focus:ring-opacity-50">دانشجو جدید</a>
          <a href="/dashboard/admin/students/assign" className=" px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-400 focus:ring-opacity-50">انتساب دانشجو به مربی</a>
        </div>
        {/* جستجو */}
      </div>

      {/* فیلترها */}
      <div className="flex flex-wrap gap-4 mb-5">
        {[
          { label: "بدون برنامه", key: "noPlans", color: "blue" },
          { label: "بدون مربی", key: "noCoach", color: "blue" },
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

      {/* جدول */}
      {loading ? (
        <TableSkeleton />
      ) : filteredData.length === 0 ? (
        <p className="mt-5 text-gray-400">دانشجویی پیدا نشد</p>
      ) : (
        <StudentsTable
          data={filteredData}
          sort={sort}
          onSort={handleSort}
          onDelete={id => setDeleteId(id)}
          onToggleStatus={toggleStatus}
        />
      )}

      {/* Pagination */}
      {pagination && (
        <Pagination page={pagination.page} pages={pagination.pages} setPage={setPage} />
      )}

      {/* Modal حذف */}
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
