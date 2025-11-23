"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard(redirectIfAuthenticated = true) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/user/me");
      if (res.ok) {
        if (!redirectIfAuthenticated) setLoading(false);
        else router.replace("/dashboard");
      } else {
        if (redirectIfAuthenticated) setLoading(false);
        else router.replace("/login");
      }
    };
    checkAuth();
  }, []);

  return { loading };
}
