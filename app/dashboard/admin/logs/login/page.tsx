"use client";
import { useEffect, useState } from "react";

/** ===== Helpers ===== */
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

function parseUserAgent(ua?: string) {
  if (!ua) return { browser: "Unknown", version: "", os: "Unknown", device: "Desktop" };
  const s = ua.toLowerCase();

  const browserRules: Array<{ name: string; reg: RegExp }> = [
    { name: "Edge", reg: /edg\/([\d\.]+)/ },
    { name: "Opera", reg: /opr\/([\d\.]+)/ },
    { name: "Chrome", reg: /chrome\/([\d\.]+)/ },
    { name: "Firefox", reg: /firefox\/([\d\.]+)/ },
    { name: "Safari", reg: /version\/([\d\.]+).*safari/ },
    { name: "IE", reg: /msie\s([\d\.]+)/ },
    { name: "IE", reg: /trident\/.*rv:([\d\.]+)/ },
  ];

  const osRules: Array<{ name: string; reg: RegExp }> = [
    { name: "Windows", reg: /windows nt/ },
    { name: "macOS", reg: /mac os x/ },
    { name: "iOS", reg: /iphone|ipad/ },
    { name: "Android", reg: /android/ },
    { name: "Linux", reg: /linux/ },
  ];

  let browser = "Unknown";
  let version = "";
  for (const b of browserRules) {
    const m = s.match(b.reg);
    if (m) {
      browser = b.name;
      version = m[1] || "";
      break;
    }
  }

  let os = "Unknown";
  for (const o of osRules) {
    if (s.match(o.reg)) {
      os = o.name;
      break;
    }
  }

  const device = /iphone|ipad|android/.test(s) ? "Mobile" : "Desktop";

  return { browser, version, os, device };
}

/** CSV export helper */
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

/** ===== Page Component ===== */
export default function LoginLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [ip, setIp] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      let q = `?page=${p}`;
      if (role) q += `&role=${encodeURIComponent(role)}`;
      if (ip) q += `&ip=${encodeURIComponent(ip)}`;
      const res = await fetch(`/api/admin/logs/login${q}`);
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
        setError(json.error || "خطا در دریافت داده‌ها");
      }
    } catch (e: any) {
      console.error("login load err:", e);
      setError(e.message || "خطا");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); /* eslint-disable-line */ }, [page]);
  useEffect(() => { setPage(1); load(1); /* eslint-disable-line */ }, [role, ip]);

  const handleExport = () => {
    const header = ["User", "Role", "IP", "Browser", "Version", "OS", "Device", "Date", "UserAgent"];
    const rows = [header];
    for (const log of logs) {
      const uaInfo = parseUserAgent(log.userAgent || "");
      rows.push([
        log.userId?.name || "",
        log.role || "",
        log.ip || "",
        uaInfo.browser,
        uaInfo.version,
        uaInfo.os,
        uaInfo.device,
        formatDateFa(log.createdAt) || "",
        log.userAgent || "",
      ]);
    }
    downloadCSV(`login-logs-page-${page}.csv`, rows);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">گزارش ورودها</h1>
        <div className="flex gap-2">
          <button onClick={handleExport} className="px-3 py-1 bg-blue-600 text-white rounded">Export CSV</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 rounded">
          <option value="">همه نقش‌ها</option>
          <option value="student">دانشجو</option>
          <option value="coach">مربی</option>
          <option value="admin">ادمین</option>
        </select>

        <input placeholder="فیلتر براساس IP" value={ip} onChange={(e) => setIp(e.target.value)} className="border p-2 rounded flex-1" />

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
                  <th className="p-2">کاربر</th>
                  <th className="p-2">نقش</th>
                  <th className="p-2">IP</th>
                  <th className="p-2">مرورگر</th>
                  <th className="p-2">OS / Device</th>
                  <th className="p-2">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={6} className="p-4 text-center text-gray-500">موردی پیدا نشد</td></tr>
                ) : (
                  logs.map((log) => {
                    const info = parseUserAgent(log.userAgent || "");
                    return (
                      <tr key={log._id} className="border-t">
                        <td className="p-2">{log.userId?.name || "—"}</td>
                        <td className="p-2">{log.role || "—"}</td>
                        <td className="p-2">{log.ip || "—"}</td>
                        <td className="p-2" title={log.userAgent || ""}>{info.browser}{info.version ? ` ${info.version}` : ""}</td>
                        <td className="p-2">{info.os} / {info.device}</td>
                        <td className="p-2">{formatDateFa(log.createdAt)}</td>
                      </tr>
                    );
                  })
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
