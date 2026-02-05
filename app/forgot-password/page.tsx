"use client";
import { useState } from "react";
import Toast from "../Components/toast/Toast";
import { Button } from "../Components/Form/Button";
import { Input } from "../Components/Form/Input";
import { Form } from "../Components/Form/Form";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });
 const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    setToast({
      show: true,
      message: data.message,
      type: res.ok ? "success" : "error",
    });
  } catch (err) {
    setToast({
      show: true,
      message: "خطایی رخ داد، دوباره تلاش کنید",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <Form onSubmit={handleSubmit} className="w-full max-w-md space-y-3">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-24 sm:h-32" src="/forgot-password.svg" alt="" />
          </div>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="ایمیل"
            required
            className="px-11"
            rightIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <div className="mt-6">
            <Button
              type="submit"
              loading={loading}
            >
              دریافت لینک یک بار مصرف
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