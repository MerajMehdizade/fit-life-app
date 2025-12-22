/** lib/logHelpers.ts */
export function formatDateFa(iso?: string) {
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

export function parseUserAgent(ua?: string) {
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

export function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
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
