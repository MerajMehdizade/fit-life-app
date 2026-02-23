"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Toast from "../Components/toast/Toast";
import { Button } from "../Components/Form/Button";
import { PasswordInput } from "../Components/Form/PasswordInput";
import { Form } from "../Components/Form/Form";

export default function Reset_Form() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    if (!token) setStatus("error");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
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
        setPassword("");
      } else {
        setStatus("error");
        setToast({
          show: true,
          message: data.error || "خطا در تغییر رمز عبور",
          type: "error",
        });
      }
    } catch (err) {
      setStatus("error");
      setToast({
        show: true,
        message: " لطفا اینترنت خود را بررسی کرده و دوباره تلاش کنید",
        type: "error",
      });
    }
  };

  return (
    <section className="bg-white dark:bg-gray-950">
      <div className="container flex items-center justify-center px-6 mx-auto">
        <Form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center gap-3 mb-6">
            <span className="text-red-400 md:text-xl">این لینک فقط 15 دقیقه فعال است</span>
            <img className="w-auto sm:h-32 h-16" src="/change-password.svg" alt="تغییر رمز عبور" />
          </div>

          <PasswordInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="رمز عبور"
            required
          />

          <div className="mt-6 text-center">
            <Button type="submit" loading={status === "loading"}>
              تغییر رمز عبور
            </Button>
          </div>
        </Form>
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
