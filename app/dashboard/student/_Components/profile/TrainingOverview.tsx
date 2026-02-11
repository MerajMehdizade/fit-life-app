"use client";

import { useState, useEffect } from "react";
import EditableCard from "./EditableCard";
import { getLabel } from "@/lib/labels";
import { useUser } from "@/app/context/UserContext";
import { Select } from "@/app/Components/Form/Select";
import { Input } from "@/app/Components/Form/Input";

interface Props {
  profile: any;
}

/* ================= TYPE ================= */

type TrainingForm = {
  trainingLevel: string;
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
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
    if (!data.success) throw new Error();

    await refreshUser();
  };

  /* ================= FIELD CONFIG ================= */

  const fields: {
    key: keyof TrainingForm;
    label: string;
    type: "number" | "select" | "text";
  }[] = [
      { key: "trainingLevel", label: "سطح تمرین", type: "select" },
      { key: "trainingExperienceYears", label: "سال تجربه", type: "number" },
      { key: "workoutDaysPerWeek", label: "روز تمرین در هفته", type: "number" },
      { key: "maxWorkoutDuration", label: "مدت تمرین (دقیقه)", type: "number" },
      { key: "trainingLocation", label: "محل تمرین", type: "select" },
      { key: "dailyActivityLevel", label: "فعالیت روزانه", type: "select" },
      { key: "sleepHours", label: "ساعت خواب", type: "number" },
      { key: "sleepQuality", label: "کیفیت خواب", type: "select" },
      { key: "injuries", label: "آسیب‌دیدگی‌ها", type: "text" },
      { key: "chronicDiseases", label: "بیماری‌های مزمن", type: "text" },
      { key: "medications", label: "داروهای مصرفی", type: "text" },
      { key: "doctorRestrictions", label: "محدودیت پزشک", type: "text" },

    ];

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

          {field.key === "trainingLevel" && (
            <>
              <option value="beginner">مبتدی</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">پیشرفته</option>
            </>
          )}

          {field.key === "trainingLocation" && (
            <>
              <option value="gym">باشگاه</option>
              <option value="home">خانه</option>
              <option value="outdoor">فضای باز</option>
            </>
          )}

          {field.key === "dailyActivityLevel" && (
            <>
              <option value="sedentary">بی‌تحرک</option>
              <option value="light"> کم‌تحرک</option>
              <option value="moderate"> متوسط</option>
              <option value="active"> فعال</option>
              <option value="very_active"> بسیار فعال</option>
            </>
          )}

          {field.key === "sleepQuality" && (
            <>
              <option value="poor">ضعیف</option>
              <option value="average">متوسط</option>
              <option value="good">خوب</option>
            </>
          )}
        </Select>
      );
    }

    return (
      <Input
        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-400 focus:ring-2 text-white"
        type={field.type}
        value={value ?? ""}
        onChange={(e) =>
          handleChange(
            field.key,
            field.type === "number"
              ? Number(e.target.value)
              : e.target.value
          )
        }
      />
    );

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
