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

export default function CoachActivityPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/logs/coach-activity");
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Network error");
      }
      const json = await res.json();
      if (json.success) {
        setData(json.data || []);
      } else {
        setData([]);
        setError(json.error || "خطا");
      }
    } catch (e: any) {
      console.error("coach activity err:", e);
      setError(e.message || "خطا");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleExport = () => {
    const header = ["Name", "Email", "StudentCount", "LoginCount", "ActionCount", "LastLogin"];
    const rows = [header];
    for (const r of data) {
      rows.push([
        r.name || "",
        r.email || "",
        String(r.studentCount || 0),
        String(r.loginCount || 0),
        String(r.actionCount || 0),
        r.lastLogin ? formatDateFa(r.lastLogin) : "",
      ]);
    }
    downloadCSV(`coach-activity.csv`, rows);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">فعالیت مربیان</h1>
        <div>
          <button onClick={handleExport} className="px-3 py-1 bg-blue-600 text-white rounded">Export CSV</button>
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-center text-gray-600">در حال بارگذاری...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-600">خطا: {error}</div>
      ) : (
        <div className="overflow-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">نام</th>
                <th className="p-2">ایمیل</th>
                <th className="p-2">تعداد شاگردان</th>
                <th className="p-2">لاگ‌های ورود</th>
                <th className="p-2">عملیات ثبت‌شده</th>
                <th className="p-2">آخرین ورود</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center text-gray-500">موردی پیدا نشد</td></tr>
              ) : (
                data.map((c) => (
                  <tr key={c.coachId} className="border-t">
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.email}</td>
                    <td className="p-2">{c.studentCount}</td>
                    <td className="p-2">{c.loginCount}</td>
                    <td className="p-2">{c.actionCount}</td>
                    <td className="p-2">{c.lastLogin ? formatDateFa(c.lastLogin) : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
