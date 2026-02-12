"use client";

import { useEffect, useState } from "react";
import BodyTypeComparison from "../_Components/BodyTypeComparison";
import { useUser } from "@/app/context/UserContext";
import Loading from "@/app/Components/LoadingSpin/Loading";
import BMICard from "../_Components/BMICard";
import CalorieNeedsCard from "../_Components/CalorieNeedsCard";
import WaterIntakeCard from "../_Components/WaterIntakeCard";
import ActivityLevelCard from "../_Components/ActivityLevelCard";
import BodyStatusSummaryCard from "../_Components/BodyStatusSummaryCard";

interface DashboardProfile {
  age?: number;
  gender?: "male" | "female";
  height?: number;

  currentWeight?: number;
  targetWeight?: number;

  bodyFatPercentage?: number;

  trainingLevel?: string;
  workoutDaysPerWeek?: number;

  calorieTarget?: number;
}

type BodyVisualKey = "body_1" | "body_2" | "body_3" | "body_4";

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();

  const [progress, setProgress] = useState<{
    currentWeek: number;
    percent: number;
  } | null>(null);

  const [pageLoading, setPageLoading] = useState(true);

  /** ✅ visual keys safe */
  const currentVisual =
    user?.uiPreferences?.bodyVisuals?.current as BodyVisualKey | undefined;

  const targetVisual =
    user?.uiPreferences?.bodyVisuals?.target as BodyVisualKey | undefined;

  const dashboardProfile: DashboardProfile | null = user?.profile
    ? {
        age: user.profile.age,
        gender: user.profile.gender,
        height: user.profile.height,

        currentWeight: user.profile.currentWeight,
        targetWeight: user.profile.targetWeight,

        bodyFatPercentage: user.profile.bodyFatPercentage,

        trainingLevel: user.profile.trainingLevel,
        workoutDaysPerWeek: user.profile.workoutDaysPerWeek,

        calorieTarget: user.profile.nutritionPlan?.calorieTarget,
      }
    : null;

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

  if (userLoading || pageLoading || !user) return <Loading />;

  if (!dashboardProfile || Object.keys(dashboardProfile).length === 0) {
    return (
      <p className="text-white text-2xl text-center mt-10">
        اطلاعات پروفایل هنوز تکمیل نشده است.
      </p>
    );
  }


  return (
    <div className="flex flex-col items-center md:pt-10 w-full px-4 md:px-0 gap-8 mt-10 container mx-auto">

      {/* ✅ BODY COMPARISON */}
      <BodyTypeComparison
        gender={dashboardProfile.gender}
        currentVisual={currentVisual}
        targetVisual={targetVisual}
        currentWeight={dashboardProfile.currentWeight}
        targetWeight={dashboardProfile.targetWeight}
        currentWeek={progress?.currentWeek ?? 1}
      />

      <div className="mt-40 w-full md:w-96">
        <BMICard
          height={dashboardProfile.height}
          weight={dashboardProfile.currentWeight}
        />
      </div>

      <div className="flex justify-center items-center flex-col md:flex-row gap-6 h-full w-full flex-wrap">
        <WaterIntakeCard
          weight={dashboardProfile.currentWeight}
          workOutDays={dashboardProfile.workoutDaysPerWeek}
        />

        <CalorieNeedsCard
          gender={dashboardProfile.gender}
          age={dashboardProfile.age}
          height={dashboardProfile.height}
          weight={dashboardProfile.currentWeight}
          workOutDays={dashboardProfile.workoutDaysPerWeek}
          calorieTarget={dashboardProfile.calorieTarget}
        />

        <ActivityLevelCard
          workOutDays={dashboardProfile.workoutDaysPerWeek}
        />

        <BodyStatusSummaryCard
          bmi={
            dashboardProfile.height && dashboardProfile.currentWeight
              ? +(
                  dashboardProfile.currentWeight /
                  Math.pow(dashboardProfile.height / 100, 2)
                ).toFixed(1)
              : undefined
          }
          workOutDays={dashboardProfile.workoutDaysPerWeek}
        />
      </div>
    </div>
  );
}