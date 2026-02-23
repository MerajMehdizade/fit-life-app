export function calculateBodyScore({
  bmi,
  workOutDays,
  sleepHours,
}: {
  bmi?: number;
  workOutDays?: number;
  sleepHours?: number;
}) {
  if (!bmi) return 0;

  let bmiScore = 0;
  if (bmi >= 18.5 && bmi <= 24.9) bmiScore = 40;
  else if (bmi >= 25 && bmi < 30) bmiScore = 25;
  else bmiScore = 15;

  let workoutScore = 0;
  if (workOutDays && workOutDays >= 4) workoutScore = 30;
  else if (workOutDays && workOutDays >= 2) workoutScore = 20;
  else workoutScore = 10;

  let sleepScore = 0;
  if (sleepHours) {
    if (sleepHours >= 7.5 && sleepHours <= 9) sleepScore = 30;
    else if (sleepHours >= 6) sleepScore = 20;
    else sleepScore = 10;
  }

  return Math.min(100, bmiScore + workoutScore + sleepScore);
}