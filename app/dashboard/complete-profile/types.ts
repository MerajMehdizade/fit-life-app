export type ProfileForm = {
  gender?: "male" | "female";

  currentBodyVisual?: string;
  targetBodyVisual?: string;

  mainObjective?:
  | "fat_loss"
  | "muscle_gain"
  | "cut"
  | "health"
  | "strength"
  | "recomposition";

  age?: number;
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  bodyFatPercentage?: number;
  trainingLevel?: "beginner" | "intermediate" | "advanced";
  supplement_usage_status?:"no" | "yes";
  doping_status?: "no" | "yes";
  workoutDaysPerWeek?: number;
  waist?: number;
  chest?: number;
  arm?: number;
  hip?: number;
  userPriority?: "appearance" | "performance" | "health";
  goalDeadline?: Date;
  calorieTarget?: number;
  dietPlanPreference?: "balanced" | "keto" | "vegan";
  appetiteLevel?: "low" | "normal" | "high";
  foodAllergies?: string;
  dietaryRestrictions?: string;
  avg_breakfast_grams?: string;
  avg_lunch_grams?: string;
  avg_dinner_grams?: string;
  diet_history?: "no" | "yes";
  smoking_status?: "no" | "yes";
  alcohol_status?: "no" | "yes";
  injuries?: string;
  chronicDiseases?: string;
  medications?: string;
  doctorRestrictions?: string;

  sleepHours?: number;
  sleepQuality?: "poor" | "average" | "good";

  dailyActivityLevel?:
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

  trainingExperienceYears?: number;
  maxWorkoutDuration?: number;
  trainingLocation?: "gym" | "home" | "outdoor";
  availableEquipment?: string;

  motivationLevel?: number;
  confidenceLevel?: number;
};

export type Field = {
  name: keyof ProfileForm;
  placeholder?: string;
  type: "text" | "number" | "select" | "image" | "date" | "triple-image";
  options?: string[];
  images?: Record<string, string>;
  helperText?: string;
};

export type StepConfig = {
  title: string;
  fields: Field[];
  required?: (keyof ProfileForm)[];
  optional?: boolean;
};
