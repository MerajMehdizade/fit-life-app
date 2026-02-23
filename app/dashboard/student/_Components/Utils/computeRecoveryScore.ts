export function computeRecoveryScore({
  sleepHours,
  workoutDays,
  motivationLevel,
  trainingLevel,
}: {
  sleepHours?: number;
  workoutDays?: number;
  motivationLevel?: number;
  trainingLevel?: "beginner" | "intermediate" | "advanced";
}) {
  const wd = workoutDays ?? 0; // اگر undefined بود، 0 در نظر بگیر

  // ---------- Sleep ----------
  let sleepScore = 0;
  if (sleepHours) {
    if (sleepHours >= 7 && sleepHours <= 9) sleepScore = 40;
    else if (sleepHours >= 6) sleepScore = 25;
    else sleepScore = 10;
  }

  // ---------- Workout ----------
  let workoutScore = 0;
  if (wd >= 3 && wd <= 5) workoutScore = 30;
  else if (wd > 5) workoutScore = 15;
  else workoutScore = 10;

  // ---------- Motivation ----------
  let motivationScore = 0;
  if (motivationLevel) motivationScore = motivationLevel * 2; // max 20

  let total = sleepScore + workoutScore + motivationScore;

  // فشار زیاد
  if (
    trainingLevel === "advanced" &&
    wd >= 5 &&
    sleepHours &&
    sleepHours < 6
  ) {
    total -= 15;
  }

  return Math.min(Math.max(total, 0), 100); // clamp 0-100
}