"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type ProfileType = {
  profile: {};
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: "student" | "coach" | "admin";
};


type UserContextType = {
  user: ProfileType | null;
  setUser: React.Dispatch<React.SetStateAction<ProfileType | null>>;
  logout: () => Promise<void>;
  loading: boolean;
};


const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user/me", { cache: "no-store", credentials: "include" });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setUser(data?.user ?? null);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();

    return () => { mounted = false; };
  }, [router]);

  // logout (client) — حتماً credentials: "include" بذار
  const logout = async () => {
    try {
      // include ensures browser sends cookies and accepts set-cookie from same-origin
      const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (res.ok) {
        setUser(null);
        router.replace("/login");
      } else {
        // fallback: still clear local user state
        setUser(null);
        router.replace("/login");
      }
    } catch (e) {
      // بی‌رحمانه: اگر بک‌اند خطا داد، ما محلی پاک می‌کنیم و می‌ریم لاگین
      setUser(null);
      router.replace("/login");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
