"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "../Components/toast/Toast";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { Button } from "../Components/Form/Button";
import { Input } from "../Components/Form/Input";
import { Form } from "../Components/Form/Form";
import { PasswordInput } from "../Components/Form/PasswordInput";
import { Select } from "../Components/Form/Select";

export default function RegisterPage() {
  useAuthGuard();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "coach">("student");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user.role === 'admin')
          router.push("/dashboard/admin");
        else if (data.user.role === 'coach')
          router.push("/dashboard/coach");
        else if (data.user.role === 'student')
          router.push("/dashboard/student");
      }
      else {
        setToast({ show: true, message: data.message, type: "error" });
      }
    } catch (err) {
      setToast({ show: true, message: "خطا در ارتباط با سرور", type: "error" });
    }
  };
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <Form onSubmit={handleSubmit} className="w-full max-w-md">

          <div className="flex justify-center mx-auto">
            <img className="w-auto h-24 sm:h-32" src="/logoFitness2.svg" alt="" />
          </div>

          <div className="flex items-center justify-center my-6" dir="rtl">
            <a href="./login" className="w-1/3 pb-4 font-medium text-center text-gray-500 border-b dark:border-gray-400 dark:text-gray-300">
              ورود
            </a>
            <a className="w-1/3 pb-4 font-medium text-center text-gray-800 border-b-2 border-blue-500 dark:border-blue-400 dark:text-white">
              عضویت
            </a>
          </div>

          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="نام کاربری"
            required
            className="px-11"
            rightIcon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-w-6 h-6 mx-3 text-gray-300 dark:text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            }
          />

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
          <Select value={role}
            onChange={(e) => setRole(e.target.value as "student" | "coach")}>
            <option value="student">دانشجو</option>
            <option value="coach">مربی</option>
          </Select>
          <PasswordInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="رمز عبور"
          />

          <div className="mt-6">
            <Button type="submit">عضویت در فیت</Button>
            <div className="mt-6 text-center">
              <a href="./login" className="text-sm text-blue-500 hover:underline dark:text-blue-400">
                قبلاً ثبت‌نام کرده‌اید؟
              </a>
            </div>
          </div>

        </Form>
      </div>

      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
    </section>
  );
}
