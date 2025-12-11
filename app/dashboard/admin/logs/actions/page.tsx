"use client";
import { useEffect, useState } from "react";

/** تاریخ فارسی */
function formatDateFa(iso?: string) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

/** CSV helper */
function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      let q = `?page=${p}`;
      if (action) q += `&action=${encodeURIComponent(action)}`;
      const res = await fetch(`/api/admin/logs/actions${q}`);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Network error");
      }
      const json = await res.json();
      if (json.success) {
        setLogs(json.data || []);
        setPages(json.pagination?.pages || 1);
      } else {
        setLogs([]);
        setPages(1);
        setError(json.error || "خطا");
      }
    } catch (e: any) {
      console.error("audit load err:", e);
      setError(e.message || "خطا");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); /* eslint-disable-line */ }, [page]);
  useEffect(() => { setPage(1); load(1); /* eslint-disable-line */ }, [action]);

  const handleExport = () => {
    const header = ["Admin", "TargetUser", "Action", "Description", "Date"];
    const rows = [header];
    for (const log of logs) {
      rows.push([
        log.adminId?.name || "",
        log.targetUserId?.name || "",
        log.action || "",
        (log.description || "").replace(/\n/g, " "),
        formatDateFa(log.createdAt) || "",
      ]);
    }
    downloadCSV(`audit-logs-page-${page}.csv`, rows);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">لاگ تغییرات ادمین</h1>
        <div>
          <button onClick={handleExport} className="px-3 py-1 bg-blue-600 text-white rounded">Export CSV</button>
        </div>
      </div>

      <div className="flex gap-3">
        <input className="border p-2 rounded flex-1" placeholder="فیلتر براساس action" value={action} onChange={(e) => setAction(e.target.value)} />
        <button onClick={() => { setPage(1); load(1); }} className="px-3 py-2 bg-black text-white rounded">اعمال</button>
      </div>

      {loading ? (
        <div className="p-4 text-center text-gray-600">در حال بارگذاری...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-600">خطا: {error}</div>
      ) : (
        <>
          <div className="overflow-auto border rounded">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">ادمین</th>
                  <th className="p-2">کاربر هدف</th>
                  <th className="p-2">عمل</th>
                  <th className="p-2">توضیحات</th>
                  <th className="p-2">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center text-gray-500">موردی پیدا نشد</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="border-t">
                      <td className="p-2">{log.adminId?.name || "—"}</td>
                      <td className="p-2">{log.targetUserId?.name || "—"}</td>
                      <td className="p-2">{log.action}</td>
                      <td className="p-2">{log.description}</td>
                      <td className="p-2">{formatDateFa(log.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 items-center">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50">قبلی</button>
            <span>صفحه {page} از {pages}</span>
            <button disabled={page === pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50">بعدی</button>
          </div>
        </>
      )}
    </div>
  );
}
