"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard(redirectIfAuthenticated = true) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/user/me", { cache: "no-store" });
        if (!mounted) return;

        if (res.ok) {
          const data = await res.json();
          const user = data?.user ?? null;

          if (user) {
            const role = (user.role || "student").toLowerCase();

            if (redirectIfAuthenticated) {
              router.replace(`/dashboard/${role}`);
              return;
            }

            setLoading(false);
          } else {
            if (!redirectIfAuthenticated) router.replace("/login");
            else setLoading(false);
          }
        } else {
          if (!redirectIfAuthenticated) router.replace("/login");
          else setLoading(false);
        }
      } catch (err) {
        if (!redirectIfAuthenticated) router.replace("/login");
        else setLoading(false);
      }
    };

    checkAuth();

    // ❌ return () => (mounted = false);
    // ✅ اصلاح شده:
    return () => { mounted = false; };
  }, [redirectIfAuthenticated, router]);

  return { loading };
}
