"use client";

import { useEffect, useMemo, useState } from "react";
import BodyTypeComparison from "../_Components/Analysis/BodyTypeComparison";
import { useUser } from "@/app/context/UserContext";
import Loading from "@/app/Components/LoadingSpin/Loading";
import BMICard from "../_Components/Analysis/BMICard";
import CalorieNeedsCard from "../_Components/Steps/CalorieNeedsCard";
import WaterIntakeCard from "../_Components/Steps/WaterIntakeCard";
import SleepCard from "../_Components/Steps/SleepCard";
import WeightProgressChart from "../_Components/Analysis/WeightProgressChart";
import BodyIntelligenceHero from "../_Components/Analysis/BodyIntelligenceHero";
import RecoveryHalfRadial from "../_Components/Analysis/RecoveryHalfRadial";
import ActivityRing from "../_Components/Analysis/ActivityRing";
import { calculateBodyScore } from "../_Components/Utils/calculateBodyScore";
import { computeRecoveryScore } from "../_Components/Utils/computeRecoveryScore";
interface ProgressItem {
  date: Date | string;
  weight: number;
  bodyFat?: number;
  notes?: string;
}
interface DashboardProfile {
  age?: number;
  gender?: "male" | "female";
  height?: number;
  mainObjective?:
  | "fat_loss"
  | "muscle_gain"
  | "strength"
  | "health"
  | "recomposition";
  sleep?: {
    averageHours?: number;
    quality?: "poor" | "average" | "good";
  };

  progressHistory?: ProgressItem[];

  dailyActivityLevel?: string;
  goalDeadline?: Date;
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

  const currentVisual =
    user?.uiPreferences?.bodyVisuals?.current as BodyVisualKey | undefined;

  const targetVisual =
    user?.uiPreferences?.bodyVisuals?.target as BodyVisualKey | undefined;

  // -------------------- DASHBOARD PROFILE --------------------
  const dashboardProfile: DashboardProfile | null = useMemo(() => {
    if (!user?.profile) return null;

    return {
      age: user.profile.age,
      gender: user.profile.gender,
      height: user.profile.height,
      sleep: user.profile.sleep,
      mainObjective: user.profile.mainObjective,
      dailyActivityLevel: user.profile.dailyActivityLevel,
      goalDeadline: user.profile.goalDeadline
        ? new Date(user.profile.goalDeadline)
        : undefined,
      currentWeight: user.profile.currentWeight,
      targetWeight: user.profile.targetWeight,
      progressHistory: user.profile.progressHistory?.map((p) => ({
        date: new Date(p.date),       // حتما Date بساز
        weight: p.weight ?? 0,        // weight همیشه number
        bodyFat: p.bodyFat,
        notes: p.notes,
      })),
      bodyFatPercentage: user.profile.bodyFatPercentage,
      trainingLevel: user.profile.trainingLevel,
      workoutDaysPerWeek: user.profile.workoutDaysPerWeek,
      calorieTarget: user.profile.nutritionPlan?.calorieTarget,
    };
  }, [user?.profile]);
  const recoveryScore = computeRecoveryScore({
    sleepHours: dashboardProfile?.sleep?.averageHours,
    workoutDays: dashboardProfile?.workoutDaysPerWeek,
    motivationLevel: user?.profile?.motivationLevel,
    trainingLevel: dashboardProfile?.trainingLevel as
      | "beginner"
      | "intermediate"
      | "advanced",
  });
  const bmi =
    dashboardProfile?.height && dashboardProfile?.currentWeight
      ? +(
        dashboardProfile.currentWeight /
        Math.pow(dashboardProfile.height / 100, 2)
      ).toFixed(1)
      : undefined;

  const totalScore = calculateBodyScore({
    bmi,
    workOutDays: dashboardProfile?.workoutDaysPerWeek,
    sleepHours: dashboardProfile?.sleep?.averageHours,
  });

  const goalLabelMap: Record<string, string> = {
    fat_loss: "چربی‌سوزی",
    muscle_gain: "عضله‌سازی",
    strength: "افزایش قدرت",
    recomposition: "ریکامپ",
    health: "سلامتی",
  };

  const goalLabel =
    dashboardProfile?.mainObjective &&
    goalLabelMap[dashboardProfile.mainObjective];
  useEffect(() => {
    if (!user || !dashboardProfile) return;

    const computed = computeProgressPercent(dashboardProfile);
    setProgress(computed);
    setPageLoading(false);
  }, [user, dashboardProfile]);
  if (userLoading || pageLoading || !user) return <Loading />;

  const hasMinimumData =
    dashboardProfile?.height &&
    dashboardProfile?.currentWeight;
  if (!hasMinimumData) {
    return (
      <p className="text-white text-2xl text-center mt-10">
        برای نمایش داشبورد لطفا قد و وزن خود را وارد کنید.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center md:pt-10 w-full px-4 md:px-0 gap-8 mt-10 container mx-auto">

      <BodyTypeComparison
        gender={dashboardProfile.gender}
        currentVisual={currentVisual}
        targetVisual={targetVisual}
        currentWeight={dashboardProfile.currentWeight}
        targetWeight={dashboardProfile.targetWeight}
        currentWeek={progress?.currentWeek ?? 1}
      />

      <div className="mt-40 mb-5 md:w-96 space-y-10 w-full max-w-3xl mx-auto">
        <WeightProgressChart />
        <BodyIntelligenceHero
          score={totalScore}
          goalLabel={goalLabel}
        />
        <div className="flex gap-4 md:flex-col ">
          <RecoveryHalfRadial score={recoveryScore} />
          <ActivityRing
            workoutDays={dashboardProfile?.workoutDaysPerWeek}
            mainObjective={dashboardProfile?.mainObjective}
          />
        </div>
        <BMICard
          height={dashboardProfile.height}
          weight={dashboardProfile.currentWeight}
        />

      </div>
    </div>

  );
}

// ================== HELPER: محاسبه درصد پیشرفت ==================
function computeProgressPercent(
  profile: DashboardProfile
): { currentWeek: number; percent: number } {
  if (!profile) return { currentWeek: 1, percent: 0 };

  const history = profile.progressHistory ?? [];
  const startWeight = history[0]?.weight ?? profile.currentWeight ?? 0;
  const currentWeight = history[history.length - 1]?.weight ?? profile.currentWeight ?? 0;
  const targetWeight = profile.targetWeight ?? startWeight;

  let percent = 0;

  if (profile.mainObjective === "fat_loss") {
    const total = startWeight - targetWeight;
    percent = total > 0 ? ((startWeight - currentWeight) / total) * 100 : 0;
  } else if (profile.mainObjective === "muscle_gain" || profile.mainObjective === "strength") {
    const total = targetWeight - startWeight;
    percent = total > 0 ? ((currentWeight - startWeight) / total) * 100 : 0;
  } else {
    // اهداف دیگه یا health/recomposition میتونه fallback
    percent = 0;
  }

  // clamp بین 0 تا 100
  percent = Math.min(100, Math.max(0, percent));

  const currentWeek = history.length || 1;

  return { currentWeek, percent };
}