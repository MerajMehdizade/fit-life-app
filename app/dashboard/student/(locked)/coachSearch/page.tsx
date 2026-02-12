"use client";

import { useEffect, useState } from "react";
import Loading from "@/app/Components/LoadingSpin/Loading";
import { useUser } from "@/app/context/UserContext";

export default function StudentDashboard() {
  const { loading: userLoading } = useUser();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // فقط برای شبیه‌سازی یا fetch صفحه
    const load = async () => {
      // اگر fetch داشتی اینجا بزار
      setPageLoading(false);
    };
    load();
  }, []);

  // ⭐ unified loading
  if (userLoading || pageLoading) return <Loading />;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold mb-6">جستجو مربی</h1>
      {/* بقیه کامپوننت ها */}
    </div>
  );
}
