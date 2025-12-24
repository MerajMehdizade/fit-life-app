"use client";

import { useState, useEffect } from "react";

const timeZones = Intl.supportedValuesOf ? Intl.supportedValuesOf("timeZone") : [
  "Asia/Tehran",
  "Europe/London",
  "America/New_York",
];

const languages = [
  { label: "فارسی", value: "fa" },
  { label: "English", value: "en" },
];

export default function GeneralSettings() {
  const [appName, setAppName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#3b82f6"); // default blue
  const [textColor, setTextColor] = useState("#111827"); // default dark
  const [language, setLanguage] = useState("fa");
  const [timeZone, setTimeZone] = useState("Asia/Tehran");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // بارگذاری تنظیمات فعلی از سرور
    fetch("/api/admin/settings/general")
      .then(res => res.json())
      .then(data => {
        setAppName(data.appName || "");
        setPrimaryColor(data.primaryColor || "#3b82f6");
        setTextColor(data.textColor || "#111827");
        setLanguage(data.language || "fa");
        setTimeZone(data.timeZone || "Asia/Tehran");
      })
      .catch(err => console.error("Load settings error:", err));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("appName", appName);
      if (logo) formData.append("logo", logo);
      if (favicon) formData.append("favicon", favicon);
      formData.append("primaryColor", primaryColor);
      formData.append("textColor", textColor);
      formData.append("language", language);
      formData.append("timeZone", timeZone);

      const res = await fetch("/api/admin/settings/general", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok) {
        setMessage("تنظیمات با موفقیت ذخیره شد ✅");
      } else {
        setMessage(json.error || "خطا در ذخیره تنظیمات ❌");
      }
    } catch (err) {
      console.error(err);
      setMessage("خطا در ذخیره تنظیمات ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">تنظیمات عمومی اپلیکیشن</h1>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <label className="w-32 font-medium">نام اپلیکیشن:</label>
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            value={appName}
            onChange={e => setAppName(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <label className="w-32 font-medium">لوگو:</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setLogo(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <label className="w-32 font-medium">فاویکن:</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFavicon(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <label className="w-32 font-medium">رنگ اصلی:</label>
          <input
            type="color"
            value={primaryColor}
            onChange={e => setPrimaryColor(e.target.value)}
            className="w-12 h-12 p-0 border-none"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <label className="w-32 font-medium">رنگ متن:</label>
          <input
            type="color"
            value={textColor}
            onChange={e => setTextColor(e.target.value)}
            className="w-12 h-12 p-0 border-none"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <label className="w-32 font-medium">زبان پیش‌فرض:</label>
          <select
            className="border rounded px-3 py-2"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            {languages.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <label className="w-32 font-medium">تایم‌زون:</label>
          <select
            className="border rounded px-3 py-2"
            value={timeZone}
            onChange={e => setTimeZone(e.target.value)}
          >
            {timeZones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

      {message && <p className="text-sm text-gray-700">{message}</p>}

      <button
        className={`px-6 py-2 rounded font-medium text-white transition-colors ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </div>
  );
}
