"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type UserStatus = "active" | "suspended";
export type UserRole = "student" | "coach" | "admin";

export type UserProfile = {
  age?: number;
  gender?: "male" | "female";
  height?: number;
  role: UserRole;
  status?: UserStatus;

  currentWeight?: number;
  targetWeight?: number;

  bodyFatPercentage?: number;

  trainingLevel?: string;
  workoutDaysPerWeek?: number;

  nutritionPlan?: {
    calorieTarget?: number;
    calculatedAt?: string;
  };
  motivationLevel?: number;
  confidenceLevel?: number;
  medical?: {
    injuries?: string[];
    chronicDiseases?: string[];
    medications?: string[];
    doctorRestrictions?: string;
  };
};
type BodyVisualKey = "body_1" | "body_2" | "body_3" | "body_4";

export type UiPreferences = {
  bodyVisuals?: {
    current?: BodyVisualKey;
    target?: BodyVisualKey;
  };
};


export type ProfileType = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "student" | "coach" | "admin";
  status?: "active" | "suspended";
  assignedCoach?: any; 
  students?: any[];  
  profile?: UserProfile;
  uiPreferences?: UiPreferences;
};

type UserContextType = {
  user: ProfileType | null;
  setUser: React.Dispatch<React.SetStateAction<ProfileType | null>>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
};



const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/me", { cache: "no-store", credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const avatarUrl = data.user?.avatar
          ? `${data.user.avatar}?t=${Date.now()}`
          : "/avatars/default.png";
        setUser({
          ...data.user,
          status: data.user?.status ?? "active",
          avatar: avatarUrl,
        });

      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (res.ok) {
        setUser(null);
        router.replace("/login");
      } else {
        setUser(null);
        router.replace("/login");
      }
    } catch (e) {
      setUser(null);
      router.replace("/login");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
