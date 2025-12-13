"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Toast from "../Components/toast/Toast";

export default function Reset_Form() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    if (!token) setStatus("error");
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setToast({
        show: true,
        message: "لینک نامعتبر است یا منقضی شده.",
        type: "error",
      });
      return;
    }

    setStatus("loading");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (data.success) {
      setStatus("success");
      setToast({
        show: true,
        message: "رمز عبور با موفقیت تغییر کرد!",
        type: "success",
      });
    } else {
      setStatus("error");
      setToast({
        show: true,
        message: data.error || "خطا در تغییر رمز عبور",
        type: "error",
      });
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
          <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
            <form onSubmit={handleReset} className="w-full max-w-md">
    
              <div className="flex justify-center mx-auto flex-col items-center gap-3">
                <span className="text-red-400 md:text-xl">این لینک فقط 15 دقیقه فعال است</span>
                <img className="w-auto sm:h-32 h-16" src="/change-password.svg" alt="" />
              </div>
    
              <div className="relative flex items-center mt-6">
                <span className="absolute">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
    
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="رمز عبور جدید"
                  required
                  className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
    
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  {status === "loading" ? "در حال تغییر..." : "تغییر رمز"}
                </button>
              </div>
    
            </form>
          </div>
    
          <Toast
            show={toast.show}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        </section>
  );
}
