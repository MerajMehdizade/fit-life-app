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
  workoutDaysPerWeek?: number;
  waist?: number;
  chest?: number;
  arm?: number;
  hip?: number;
  userPriority?: "appearance" | "performance" | "health";
  goalDeadline?: Date;
  calorieTarget?: number;
  dietPlanPreference?: "balanced" | "keto" | "vegan";

  foodAllergies?: string;
  dietaryRestrictions?: string;

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
  type: "text" | "number" | "select" | "image" | "date";
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
