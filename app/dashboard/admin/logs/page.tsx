"use client";
import { useEffect, useState } from "react";
import { formatDateFa, parseUserAgent, downloadCSV } from "@/lib/logHelpers";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"login"|"audit"|"coachActivity">("login");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState("");

  const ITEMS_PER_PAGE = 5;

  const load = async (p = page) => {
    setLoading(true); setError(null);
    try {
      const q = new URLSearchParams();
      q.set("type", type);
      q.set("page", String(p));
      q.set("role", role);
      q.set("limit", String(ITEMS_PER_PAGE));
      if (filter) {
        if (type === "login") q.set("ip", filter);
        if (type === "audit") q.set("action", filter);
      }

      const res = await fetch(`/api/admin/logs?${q.toString()}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "خطا");

      setLogs(json.data || []);
      setPages(Math.ceil((json.pagination?.total || 0) / ITEMS_PER_PAGE) || 1);
    } catch (e: any) {
      console.error("log load err:", e);
      setError(e.message || "خطا");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(1); setPage(1); }, [type, role, filter]);
  useEffect(() => { load(page); }, [page]);

  const handleExport = () => {
    let header: string[] = [];
    const rows: string[][] = [];

    if (type === "login") {
      header = ["کاربر","نقش","IP","مرورگر","نسخه","سیستم","دستگاه","تاریخ","UserAgent"];
      rows.push(header);
      logs.forEach((log) => {
        const ua = parseUserAgent(log.userAgent);
        rows.push([
          log.userId?.name || "",
          log.role || "",
          log.ip || "",
          ua.browser,
          ua.version,
          ua.os,
          ua.device,
          formatDateFa(log.createdAt),
          log.userAgent || "",
        ]);
      });
    } else if (type === "audit") {
      header = ["ادمین","کاربر هدف","عمل","توضیحات","تاریخ"];
      rows.push(header);
      logs.forEach((log) => {
        rows.push([
          log.adminId?.name || "",
          log.targetUserId?.name || "",
          log.action || "",
          (log.description || "").replace(/\n/g, " "),
          formatDateFa(log.createdAt),
        ]);
      });
    } else if (type === "coachActivity") {
      header = ["نام","ایمیل","تعداد شاگرد","تعداد ورود","تعداد عملیات","آخرین ورود"];
      rows.push(header);
      logs.forEach((c) => {
        rows.push([
          c.name,
          c.email,
          String(c.studentCount || 0),
          String(c.loginCount || 0),
          String(c.actionCount || 0),
          c.lastLogin ? formatDateFa(c.lastLogin) : "-",
        ]);
      });
    }

    downloadCSV(`${type}-logs-page-${page}.csv`, rows);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100" dir="rtl">

      {/* هدر و Export */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <h1 className="text-xl md:text-2xl font-bold">گزارش‌ها</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm text-sm md:text-base"
        >
          خروجی CSV
        </button>
      </div>

      {/* فیلترها */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-stretch md:items-center">
        <select
          value={type}
          onChange={e => { setType(e.target.value as any); setPage(1); }}
          className="border rounded-md p-2 flex-1 md:flex-none min-w-[140px] bg-gray-900 text-white"
        >
          <option value="login">لاگ ورود</option>
          <option value="audit">لاگ تغییرات</option>
          <option value="coachActivity">فعالیت مربیان</option>
        </select>

        <select
          value={role}
          onChange={e => { setRole(e.target.value); setPage(1); }}
          className="border rounded-md p-2 flex-1 md:flex-none min-w-[140px] bg-gray-900 text-white"
        >
          <option value="">همه نقش‌ها</option>
          <option value="student">دانشجو</option>
          <option value="coach">مربی</option>
          <option value="admin">ادمین</option>
        </select>

        {(type === "login" || type === "audit") && (
          <input
            placeholder={type === "login" ? "فیلتر براساس IP" : "فیلتر براساس عمل"}
            value={filter}
            onChange={e => { setFilter(e.target.value); setPage(1); }}
            className="border rounded-md p-2 flex-1"
          />
        )}
      </div>

      {/* جدول دسکتاپ */}
      <div className="hidden md:block overflow-auto border rounded-md bg-white dark:bg-gray-800">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {type==="login" && ["کاربر","نقش","IP","مرورگر","سیستم / دستگاه","تاریخ"].map(h => <th key={h} className="p-2 text-right">{h}</th>)}
              {type==="audit" && ["ادمین","کاربر هدف","عمل","توضیحات","تاریخ"].map(h => <th key={h} className="p-2 text-right">{h}</th>)}
              {type==="coachActivity" && ["نام","ایمیل","شاگردان","ورودها","عملیات","آخرین ورود"].map(h => <th key={h} className="p-2 text-right">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">موردی پیدا نشد</td></tr>
            ) : logs.map((log:any) => (
              <tr key={log._id || log.coachId} className="border-t">
                {type==="login" && (() => {
                  const ua = parseUserAgent(log.userAgent);
                  return (
                    <>
                      <td className="p-2">{log.userId?.name||"—"}</td>
                      <td className="p-2">{log.role||"—"}</td>
                      <td className="p-2">{log.ip||"—"}</td>
                      <td className="p-2">{ua.browser} {ua.version}</td>
                      <td className="p-2">{ua.os} / {ua.device}</td>
                      <td className="p-2">{formatDateFa(log.createdAt)}</td>
                    </>
                  )
                })()}
                {type==="audit" && (
                  <>
                    <td className="p-2">{log.adminId?.name||"—"}</td>
                    <td className="p-2">{log.targetUserId?.name||"—"}</td>
                    <td className="p-2">{log.action}</td>
                    <td className="p-2">{log.description}</td>
                    <td className="p-2">{formatDateFa(log.createdAt)}</td>
                  </>
                )}
                {type==="coachActivity" && (
                  <>
                    <td className="p-2">{log.name}</td>
                    <td className="p-2">{log.email}</td>
                    <td className="p-2">{log.studentCount}</td>
                    <td className="p-2">{log.loginCount}</td>
                    <td className="p-2">{log.actionCount}</td>
                    <td className="p-2">{log.lastLogin ? formatDateFa(log.lastLogin) : "-"}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* کارت موبایل */}
      <div className="flex flex-col gap-3 md:hidden">
        {logs.map((log:any) => (
          <div key={log._id || log.coachId} className="border rounded-md p-3 bg-white dark:bg-gray-800 shadow-sm">
            {type==="login" && (() => {
              const ua = parseUserAgent(log.userAgent);
              return (
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="font-semibold">کاربر:</div><div>{log.userId?.name||"—"}</div>
                  <div className="font-semibold">نقش:</div><div>{log.role||"—"}</div>
                  <div className="font-semibold">IP:</div><div>{log.ip||"—"}</div>
                  <div className="font-semibold">مرورگر:</div><div>{ua.browser} {ua.version}</div>
                  <div className="font-semibold">سیستم / دستگاه:</div><div>{ua.os} / {ua.device}</div>
                  <div className="font-semibold">تاریخ:</div><div>{formatDateFa(log.createdAt)}</div>
                </div>
              )
            })()}
            {type==="audit" && (
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className="font-semibold">ادمین:</div><div>{log.adminId?.name||"—"}</div>
                <div className="font-semibold">کاربر هدف:</div><div>{log.targetUserId?.name||"—"}</div>
                <div className="font-semibold">عمل:</div><div>{log.action}</div>
                <div className="font-semibold">توضیحات:</div><div>{log.description}</div>
                <div className="font-semibold">تاریخ:</div><div>{formatDateFa(log.createdAt)}</div>
              </div>
            )}
            {type==="coachActivity" && (
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className="font-semibold">نام:</div><div>{log.name}</div>
                <div className="font-semibold">ایمیل:</div><div>{log.email}</div>
                <div className="font-semibold">شاگردان:</div><div>{log.studentCount}</div>
                <div className="font-semibold">ورودها:</div><div>{log.loginCount}</div>
                <div className="font-semibold">عملیات:</div><div>{log.actionCount}</div>
                <div className="font-semibold">آخرین ورود:</div><div>{log.lastLogin?formatDateFa(log.lastLogin):"-"}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {type!=="coachActivity" && logs.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-3 text-sm">
          <button
            disabled={page===1}
            onClick={()=>setPage(p=>Math.max(1,p-1))}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >قبلی</button>
          <span>{page}/{pages}</span>
          <button
            disabled={page===pages}
            onClick={()=>setPage(p=>Math.min(pages,p+1))}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >بعدی</button>
        </div>
      )}

    </div>
  );
}
