import { StepConfig } from "./types";

export const steps: StepConfig[] = [
  {
    title: "جنسیتت رو انتخاب کن",
    required: ["gender"],
    fields: [
      {
        name: "gender",
        type: "image",
        images: {
          male: "/body/gender/male.PNG",
          female: "/body/gender/female.PNG",
        },
      },
    ],
  },
  {
    title: " وضعیت بدن فعلی",
    required: ["currentBodyVisual"],
    fields: [
      {
        name: "currentBodyVisual",
        type: "image",
        images: {
          body_1: "/body/{gender}/slim.PNG",
          body_2: "/body/{gender}/average.PNG",
          body_3: "/body/{gender}/fit.PNG",
          body_4: "/body/{gender}/muscular.PNG",
        },
      },
    ],
  },
  {
    title: " بدن هدف ",
    required: ["targetBodyVisual"],
    fields: [
      {
        name: "targetBodyVisual",
        type: "image",
        images: {
          body_1: "/body/{gender}/slim.PNG",
          body_2: "/body/{gender}/average.PNG",
          body_3: "/body/{gender}/fit.PNG",
          body_4: "/body/{gender}/muscular.PNG",
        },
      },
    ],
  },
  {
    title: " اطلاعات پایه",
    required: ["age", "height", "currentWeight", "targetWeight"],
    fields: [
      { name: "age", placeholder: "سن (سال)", type: "number" },
      { name: "height", placeholder: "قد (cm)", type: "number" },
      { name: "currentWeight", placeholder: "وزن فعلی (kg)", type: "number" },
      { name: "targetWeight", placeholder: "وزن هدف (kg)", type: "number" },
      { name: "bodyFatPercentage", placeholder: "درصد چربی بدن (اختیاری)", type: "number" },
      { name: "waist", placeholder: "دور کمر (اختیاری)", type: "number" },
      { name: "chest", placeholder: "دور سینه (اختیاری)", type: "number" },
      { name: "arm", placeholder: "دور بازو (اختیاری)", type: "number" },
      { name: "hip", placeholder: "دور باسن (اختیاری)", type: "number" },
    ],
  },
  {
    title: " هدفت از تمرین چیه؟",
    required: ["mainObjective"],
    fields: [
      {
        name: "mainObjective",
        type: "select",
        placeholder: "هدف اصلی تمرین",
        options: [
          "fat_loss",
          "muscle_gain",
          "cut",
          "health",
          "strength",
          "recomposition",
        ],
      },

    ],
  },

  {
    title: " تمرین",
    required: ["trainingLevel", "workoutDaysPerWeek"],
    fields: [
      {
        name: "trainingLevel",
        type: "select",
        placeholder: "سطح تمرین",
        options: ["beginner", "intermediate", "advanced"],
      },
      {
        name: "workoutDaysPerWeek",
        placeholder: "تعداد روز تمرین در هفته",
        type: "number",
      },
    ],
  },
  {
    title: "تغذیه",
    required: ["dietPlanPreference"],
    fields: [
      {
        name: "dietPlanPreference",
        type: "select",
        placeholder: "نوع رژیم",
        options: ["balanced", "keto", "vegan"],
      },
      { name: "foodAllergies", placeholder: "آلرژی غذایی (اختیاری)", type: "text" },
      { name: "dietaryRestrictions", placeholder: "محدودیت غذایی (اختیاری)", type: "text" },
    ],
  },
  {
    title: "اولویت و زمان هدف",
    optional: true,
    fields: [
      {
        name: "userPriority",
        type: "select",
        placeholder: "اولویت شما چیست؟",
        options: ["appearance", "performance", "health"],
      },
      {
        name: "goalDeadline",
        type: "date",
        placeholder: "تاریخ رسیدن به هدف (اختیاری)",
      },
    ],
  },

  {
    title: "وضعیت پزشکی (اختیاری)",
    optional: true,
    fields: [
      { name: "injuries", placeholder: "آسیب‌دیدگی‌ها", type: "text" },
      { name: "chronicDiseases", placeholder: "بیماری‌های مزمن", type: "text" },
      { name: "medications", placeholder: "داروهای مصرفی", type: "text" },
      { name: "doctorRestrictions", placeholder: "محدودیت پزشک", type: "text" },
    ],
  },
  {
    title: "خواب (اختیاری)",
    optional: true,
    fields: [
      {
        name: "sleepQuality",
        type: "select",
        placeholder: "کیفیت خواب",
        options: ["poor", "average", "good"],
      },
      { name: "sleepHours", placeholder: "میانگین ساعت خواب", type: "number" },
    ],
  },
  {
    title: "فعالیت روزانه (اختیاری)",
    optional: true,
    fields: [
      {
        name: "dailyActivityLevel",
        type: "select",
        placeholder: "سطح فعالیت روزانه",
        options: ["sedentary", "light", "moderate", "active", "very_active"],
      },
    ],
  },
  {
    title: "جزئیات تمرین (اختیاری)",
    optional: true,
    fields: [
      {
        name: "trainingLocation",
        type: "select",
        placeholder: "محل تمرین",
        options: ["gym", "home", "outdoor"],
      },
      { name: "trainingExperienceYears", placeholder: "سابقه تمرین (سال)", type: "number" },
      { name: "maxWorkoutDuration", placeholder: "حداکثر زمان تمرین (دقیقه)", type: "number" },
      { name: "availableEquipment", placeholder: "تجهیزات", type: "text" },
    ],
  },
  {
    title: "انگیزه (اختیاری)",
    optional: true,
    fields: [
      { name: "motivationLevel", placeholder: "انگیزه (1 تا 10)", type: "number" },
      { name: "confidenceLevel", placeholder: "اعتماد به نفس (1 تا 10)", type: "number" },
    ],
  },
];
