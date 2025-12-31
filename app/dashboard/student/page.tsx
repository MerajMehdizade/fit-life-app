"use client";

import { useEffect, useState } from "react";
import BodyTypeComparison from "./_Components/BodyTypeComparison";
import ProfileStatCard from "./_Components/ProfileStatCard";
import { useUser } from "@/app/context/UserContext";
import Loading from "@/app/Components/LoadingSpin/Loading";

interface ProfileType {
  age?: number;
  gender?: "male" | "female";
  height?: number;
  weight?: number;
  primaryGoal?: "slim" | "average" | "fit" | "muscular";
  currentWeight?: number;
  bodyFatPercentage?: number;
  waistCircumference?: number;
  chestCircumference?: number;
  armCircumference?: number;
  trainingLevel?: string;
  currentBodyType?: "slim" | "average" | "fit" | "muscular";
  workOutDays?: string;
  calorieTarget?: string;
  foodAllergies?: string;
  dietaryRstrictions?: string;
  dietPlanType?: string;
}

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [profile, setProfile] = useState<ProfileType | null>(user?.profile ?? null);

  useEffect(() => {
    setProfile(user?.profile ?? null);
  }, [user]);

  if (loading) return <Loading />;

  if (!user || !profile || Object.keys(profile).length === 0) {
    return <p className="text-white text-2xl text-center mt-10">اطلاعات پروفایل هنوز تکمیل نشده است.</p>;
  }


  return (
    <div className="flex flex-col items-center md:pt-10 w-full px-4 md:px-0 gap-8">
      <h1 className="text-3xl font-bold my-4 text-white">داشبورد شخصی</h1>

      {/* مقایسه نوع بدن */}
      <BodyTypeComparison
        gender={profile.gender}
        currentType={profile.currentBodyType}
        targetType={profile.primaryGoal}
      />

      {/* آمار پروفایل */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full mt-6">
        {Object.entries(profile)
          .filter(([key]) => !["currentBodyType", "primaryGoal", "gender"].includes(key))
          .map(([key, value]) => (
            <ProfileStatCard key={key} label={key} value={value} />
          ))}
      </div>
    </div>
  );
}
