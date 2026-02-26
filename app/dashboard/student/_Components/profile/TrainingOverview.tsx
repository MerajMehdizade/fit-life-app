"use client";

import { useState, useEffect } from "react";
import EditableCard from "./EditableCard";
import { getLabel } from "@/lib/labels";
import { useUser } from "@/app/context/UserContext";
import { Select } from "@/app/Components/Form/Select";
import FormInput from "@/app/dashboard/complete-profile/components/FormInput";

interface Props {
  profile: any;
}
const NUMBER_LIMITS: Partial<
  Record<keyof TrainingForm, { min: number; max: number }>
> = {
  trainingExperienceYears: { min: 0, max: 60 },
  workoutDaysPerWeek: { min: 1, max: 7 },
  maxWorkoutDuration: { min: 10, max: 300 },
  sleepHours: { min: 1, max: 16 },
};

/* ================= TYPE ================= */

type TrainingForm = {
  trainingLevel: string;
  availableEquipment: string;
  supplement_usage_status: string;
  doping_status: string;
  trainingExperienceYears: number | string;
  workoutDaysPerWeek: number | string;
  maxWorkoutDuration: number | string;
  trainingLocation: string;
  dailyActivityLevel: string;
  sleepHours: number | string;
  sleepQuality: string;
  injuries: string;
  chronicDiseases: string;
  medications: string;
  doctorRestrictions: string;
};

export default function TrainingOverview({ profile }: Props) {
  const { refreshUser } = useUser();

  const [form, setForm] = useState<TrainingForm>({
    trainingLevel: "",
    availableEquipment: "",
    supplement_usage_status: "",
    doping_status: "",
    trainingExperienceYears: "",
    workoutDaysPerWeek: "",
    maxWorkoutDuration: "",
    trainingLocation: "",
    dailyActivityLevel: "",
    sleepHours: "",
    sleepQuality: "",
    injuries: "",
    chronicDiseases: "",
    medications: "",
    doctorRestrictions: "",
  });

  useEffect(() => {
    setForm({
      trainingLevel: profile?.trainingLevel || "",
      availableEquipment: profile?.availableEquipment || "",
      supplement_usage_status: profile?.supplement_usage_status || "",
      doping_status: profile?.doping_status || "",
      trainingExperienceYears: profile?.trainingExperienceYears || "",
      workoutDaysPerWeek: profile?.workoutDaysPerWeek || "",
      maxWorkoutDuration: profile?.maxWorkoutDuration || "",
      trainingLocation: profile?.trainingLocation || "",
      dailyActivityLevel: profile?.dailyActivityLevel || "",
      sleepHours: profile?.sleep?.averageHours || "",
      sleepQuality: profile?.sleep?.quality || "",
      injuries: profile?.medical?.injuries?.join(", ") || "",
      chronicDiseases: profile?.medical?.chronicDiseases?.join(", ") || "",
      medications: profile?.medical?.medications?.join(", ") || "",
      doctorRestrictions: profile?.medical?.doctorRestrictions || "",

    });
  }, [profile]);

  const handleChange = (
    key: keyof TrainingForm,
    rawValue: string
  ) => {
    const limits = NUMBER_LIMITS[key];

    if (limits) {
      if (rawValue === "") {
        setForm((prev) => ({ ...prev, [key]: "" }));
        return;
      }

      const num = Number(rawValue);
      if (isNaN(num)) return;

      setForm((prev) => ({ ...prev, [key]: num }));
    } else {
      setForm((prev) => ({ ...prev, [key]: rawValue }));
    }
  };


  const handleSave = async () => {
    const payload = {
      ...form,
      trainingExperienceYears: Number(form.trainingExperienceYears),
      workoutDaysPerWeek: Number(form.workoutDaysPerWeek),
      maxWorkoutDuration: Number(form.maxWorkoutDuration),
      sleepHours: Number(form.sleepHours),
    };

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

   const data = await res.json();

if (!res.ok || !data.success) {
  throw new Error(data.message || "خطا در ذخیره اطلاعات");
}

    await refreshUser();
  };

  /* ================= FIELD CONFIG ================= */

  const fields: {
    key: keyof TrainingForm;
    label: string;
    type: "number" | "select" | "text";
  }[] = [
      { key: "trainingLevel", label: "سطح تمرین", type: "select" },
      { key: "supplement_usage_status", label: "سابقه مصرف مکمل", type: "select" },
      { key: "doping_status", label: "سابقه دوپینگ", type: "select" },
      { key: "trainingExperienceYears", label: "سابقه تمرین (سال)", type: "number" },
      { key: "workoutDaysPerWeek", label: "روز تمرین در هفته", type: "number" },
      { key: "maxWorkoutDuration", label: "مدت تمرین (دقیقه)", type: "number" },
      { key: "trainingLocation", label: "محل تمرین", type: "select" },
      { key: "availableEquipment", label: "تجهیزات", type: "text" },
      { key: "dailyActivityLevel", label: "فعالیت روزانه", type: "select" },
      { key: "sleepHours", label: "ساعت خواب", type: "number" },
      { key: "sleepQuality", label: "کیفیت خواب", type: "select" },
      { key: "injuries", label: "آسیب‌دیدگی‌ها", type: "text" },
      { key: "chronicDiseases", label: "بیماری‌های مزمن", type: "text" },
      { key: "medications", label: "داروهای مصرفی", type: "text" },
      { key: "doctorRestrictions", label: "محدودیت پزشک", type: "text" },

    ];
  const SELECT_OPTIONS: Record<string, { value: string; label: string }[]> = {
    trainingLevel: [
      { value: "beginner", label: "مبتدی" },
      { value: "intermediate", label: "متوسط" },
      { value: "advanced", label: "پیشرفته" },
    ],
    supplement_usage_status: [
      { value: "no", label: "خیر" },
      { value: "yes", label: "بله" },
    ],
    doping_status: [
      { value: "no", label: "خیر" },
      { value: "yes", label: "بله" },
    ],
    trainingLocation: [
      { value: "gym", label: "باشگاه" },
      { value: "home", label: "خانه" },
      { value: "outdoor", label: "فضای باز" },
    ],
    dailyActivityLevel: [
      { value: "sedentary", label: "بی‌تحرک" },
      { value: "light", label: "کم‌تحرک" },
      { value: "moderate", label: "متوسط" },
      { value: "active", label: "فعال" },
      { value: "very_active", label: "بسیار فعال" },
    ],
    sleepQuality: [
      { value: "poor", label: "ضعیف" },
      { value: "average", label: "متوسط" },
      { value: "good", label: "خوب" },
    ],
  };
  const renderField = (
    field: (typeof fields)[number],
    isEditing: boolean
  ) => {
    const value = form[field.key];

    if (!isEditing) {
      if (!value) return <span className="text-gray-600">خالی</span>;

      if (field.type === "select") return getLabel(String(value));

      return value;
    }

    if (field.type === "select") {
      return (
        <Select
          value={String(value ?? "")}
          onChange={(e) => handleChange(field.key, e.target.value)}
        >
          <option value="">انتخاب کنید</option>

          {SELECT_OPTIONS[field.key]?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      );
    }

    if (field.type === "number") {
      const limits = NUMBER_LIMITS[field.key];
      const numericValue = form[field.key];

      const hasError =
        limits &&
        numericValue !== "" &&
        numericValue !== undefined &&
        (Number(numericValue) < limits.min ||
          Number(numericValue) > limits.max);

      return (
        <FormInput
          label={""}
          type="number"
          inputMode="numeric"
          min={limits?.min}
          max={limits?.max}
          value={numericValue ?? ""}
          onChange={(e) =>
            handleChange(field.key, e.target.value)
          }
          onBlur={() => {
            if (!limits) return;

            const val = form[field.key];
            if (val === "" || val === undefined) return;

            let num = Number(val);
            if (isNaN(num)) return;

            num = Math.min(limits.max, Math.max(limits.min, num));

            setForm((prev) => ({
              ...prev,
              [field.key]: num,
            }));
          }}
          className={
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }
        />
      );
    }
    if (field.type === "text") {
      return (
        <FormInput
          label={""}
          type="text"
          value={value ?? ""}
          onChange={(e) =>
            handleChange(field.key, e.target.value)
          }
        />
      );
    }


  };

  return (
    <EditableCard title="تمرین و سبک زندگی" onSave={handleSave}>
      {(isEditing) => (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          {fields.map((field) => (
            <div key={field.key}>
              <div className="text-sm text-gray-400 mb-1">
                {field.label}
              </div>
              <div className="text-gray-300 font-medium">
                {renderField(field, isEditing)}
              </div>
            </div>
          ))}
        </div>
      )}
    </EditableCard>
  );
}
