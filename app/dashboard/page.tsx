"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) router.push("/login");
    else setUser(JSON.parse(userData));
  }, []);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return <h1 className="text-2xl text-center mt-10 text-white">Welcome, {user.name} to Dashbord</h1>;
}
