"use client";

import { useEffect, useState } from "react";
import BodyTypeComparison from "./_Components/BodyTypeComparison";
import ProfileStatCard from "./_Components/ProfileStatCard";
import { useUser } from "@/app/context/UserContext";
import Loading from "@/app/Components/LoadingSpin/Loading";
import BMICard from "./_Components/BMICard";
import CalorieNeedsCard from "./_Components/CalorieNeedsCard";
import WaterIntakeCard from "./_Components/WaterIntakeCard";
import ActivityLevelCard from "./_Components/ActivityLevelCard";
import BodyStatusSummaryCard from "./_Components/BodyStatusSummaryCard";

interface ProfileType {
  age?: number;
  gender?: "male" | "female";
  height?: number;
  weight?: number;
  primaryGoal?: string;
  currentWeight?: number;
  bodyFatPercentage?: number;
  waistCircumference?: number;
  chestCircumference?: number;
  armCircumference?: number;
  trainingLevel?: string;
  currentBodyType?: "slim" | "average" | "fit" | "muscular";
  workOutDays?: number;
  calorieTarget?: number;
  foodAllergies?: string;
  dietaryRstrictions?: string;
  dietPlanType?: string;
}

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const [progress, setProgress] = useState<{ currentWeek: number; percent: number } | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const profile: ProfileType | null = user?.profile ?? null;

  useEffect(() => {
    if (!user) return;

    const run = async () => {
      try {
        const res = await fetch("/api/progress", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();
        setProgress(data);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    run();
  }, [user]);

  // ⭐ loading unified
  if (userLoading || pageLoading || !user) return <Loading />;

  if (!profile || Object.keys(profile).length === 0) {
    return (
      <p className="text-white text-2xl text-center mt-10">
        اطلاعات پروفایل هنوز تکمیل نشده است.
      </p>
    );
  }

  const mappedPrimaryGoal: "slim" | "average" | "fit" | "muscular" = (() => {
    switch (profile?.primaryGoal) {
      case "slim":
      case "weight_loss":
      case "cut":
        return "slim";

      case "muscular":
      case "muscle_gain":
      case "bulk":
        return "muscular";

      case "fit":
        return "fit";

      default:
        return "average";
    }
  })();

  return (
    <div className="flex flex-col items-center md:pt-10 w-full px-4 md:px-0 gap-8 mt-10 container mx-auto">
      <BodyTypeComparison
        gender={profile.gender}
        currentType={profile.currentBodyType}
        targetType={mappedPrimaryGoal}
        weight={profile.weight}
        currentWeight={profile.currentWeight}
        currentWeek={progress?.currentWeek ?? 1}
      />

      <div className="mt-40 w-full md:w-96">
        <BMICard height={profile.height} weight={profile.weight} />
      </div>

      <div className="flex justify-center items-center flex-col md:flex-row gap-6 h-full w-full flex-wrap">
        <WaterIntakeCard weight={profile.weight} workOutDays={profile.workOutDays} />

        <CalorieNeedsCard
          gender={profile.gender}
          age={profile.age}
          height={profile.height}
          weight={profile.weight}
          workOutDays={profile.workOutDays}
          primaryGoal={mappedPrimaryGoal}
          calorieTarget={profile.calorieTarget}
        />

        <ActivityLevelCard
          workOutDays={profile.workOutDays}
          primaryGoal={mappedPrimaryGoal}
          height={profile.height}
          weight={profile.weight}
        />

        <BodyStatusSummaryCard
          bmi={
            profile.height && profile.weight
              ? +(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
              : undefined
          }
          workOutDays={profile.workOutDays}
          primaryGoal={mappedPrimaryGoal}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full mt-5">
        {Object.entries(profile)
          .filter(([key]) => !["currentBodyType", "primaryGoal", "gender"].includes(key))
          .map(([key, value]) => (
            <ProfileStatCard key={key} label={key} value={value} />
          ))}
      </div>
    </div>
  );
}
