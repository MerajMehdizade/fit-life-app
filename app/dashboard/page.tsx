"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
    } else {
      setUser(JSON.parse(userData));
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!user) return <div className="flex items-center justify-center h-screen"><p className=" text-white text-3xl">...Loading</p></div>;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-10 bg-gray-900 w-full">
      {showToast && (
        <div dir="rtl"
          className="flex items-center w-full max-w-sm p-4 text-body bg-gray-100 dark:bg-gray-700 rounded-md shadow border border-gray-300 dark:border-gray-600 text-white fixed bottom-5 right-5"
          role="alert"
        >
          <svg
            className="w-5 h-5 text-blue-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m12 18-7 3 7-18 7 18-7-3Zm0 0v-5"
            />
          </svg>

          <div className="mr-3 border-r border-gray-300 pr-3 dark:border-gray-500 capitalize">
            {user.name} عزیز خوش آمدید
          </div>

          <button
            type="button"
            className="ms-auto flex items-center justify-center text-body border border-transparent  font-medium rounded text-sm h-8 w-8 focus:outline-none focus:ring-2 text-red-500 cursor-pointer"
            onClick={() => setShowToast(false)}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
          </button>
        </div>
      )}


    </div>
  );
}
