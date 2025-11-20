"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } else alert(data.message);
  };
  return (
    <div className=" text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
      <div className="relative mt-12 max-w-lg sm:mt-10 ">
        <div className="relative -mb-px h-px w-full from-transparent via-sky-300 to-transparent "
        ></div>
        <div
          className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20  border-white/20 border-l-white/20 border-r-white/20 rounded-xl">
          <div className="flex flex-col p-6" dir="rtl">
            <h3 className="text-xl  leading-6 tracking-tighter">ورود</h3>
            <p className="mt-2 text-sm  text-white/50">خوش برگشتی! لطفاً برای ادامه، اطلاعات ورود خود را وارد کنید.
            </p>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">

              <div className="relative z-0 w-full mb-5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={e => setEmail(e.target.value)} value={email}
                  placeholder=" "
                  required
                  className="block py-2.5 px-0 w-full text-sm text-gray-200 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer text-left"
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-200 right-0"
                >
                  ایمیل
                </label>
              </div>
              <div className="relative z-0 w-full mb-5">
                <input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  onChange={e => setPassword(e.target.value)}
                  placeholder=" "
                  required
                  className="block py-2.5 pr-2 pl-0 w-full text-sm text-gray-200 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>

                <label
                  htmlFor="password"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-top-right peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-200 right-0"
                >
                  رمز عبور
                </label>
              </div>
              {/* 
              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="remember"
                    className="outline-none focus:outline focus:outline-sky-300" />
                  <span className="text-xs">به یاد داشته باش</span>
                </label>
                <a className="text-sm  text-foreground underline" href="/forgot-password">فراموشی رمز عبور</a>
              </div> */}
              <div className="mt-4 flex items-center justify-end gap-x-2">
                <a className="inline-flex items-center justify-center rounded-md text-sm  transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2 duration-200"
                  href="./register">عضویت در فیت</a>
                <button
                  className=" hover:bg-zinc-950 hover:text-white hover:ring hover:ring-zinc-600 transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2"
                  type="submit">ورود به پنل کاربری</button>


              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
