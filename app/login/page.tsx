"use client";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/app/Components/Toast/Toast";
import { useUser } from "../context/UserContext";
import { Button } from "../Components/Form/Button";
import { PasswordInput } from "../Components/Form/PasswordInput";
import { Form } from "../Components/Form/Form";
import { Input } from "../Components/Form/Input";

export default function LoginPage() {
  useAuthGuard();
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      router.refresh();
      if (data.user.role === "student")
        router.push("/dashboard/student");
      else if (data.user.role === "coach")
        router.push("/dashboard/coach");
      else if (data.user.role === "admin")
        router.push("/dashboard/admin");
    }
    else setToast({ show: true, message: data.message, type: "error" });
  };
  return (
    <section className="bg-white dark:bg-gray-900 ">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <Form onSubmit={handleSubmit} className="w-full max-w-md">

          <div className="flex justify-center mx-auto">
            <img className="w-auto h-24 sm:h-32" src="/logoFitness.svg" alt="" />
          </div>

          <div className="flex items-center justify-center my-6" dir="rtl">
            <a className="w-1/3 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 border-blue-500 dark:border-blue-400 dark:text-white">
              ورود
            </a>
            <a href="./register" className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b dark:border-gray-400 dark:text-gray-300">
              عضویت
            </a>
          </div>

          <Input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="ایمیل"
            required
            className="px-11 "
            rightIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />

          <PasswordInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="رمز عبور"
          />

          <div className="flex items-center mt-4 gap-1 ms-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992M2.985 19.644v-4.992h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            <a href="./forgot-password" className="text-gray-300 font-bold text-sm">
              فراموشی رمز عبور
            </a>
          </div>

          <div className="mt-6">
            <Button type="submit">ورود به پنل کاربری</Button>
            <div className="mt-6 text-center">
              <a href="./register" className="text-sm text-blue-500 hover:underline dark:text-blue-400">
                ثبت نام در فیت
              </a>
            </div>
          </div>

        </Form>
      </div>

      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
    </section>

  );
}
