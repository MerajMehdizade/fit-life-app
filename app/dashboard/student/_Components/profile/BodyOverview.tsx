"use client";

import { useState } from "react";
import EditableCard from "./EditableCard";
import { getLabel } from "@/lib/labels";
import { useUser } from "@/app/context/UserContext";
import { Select } from "@/app/Components/Form/Select";
import FormInput from "@/app/dashboard/complete-profile/components/FormInput";

interface Props {
  profile: any;
}
const NUMBER_LIMITS: Partial<
  Record<keyof FormState, { min: number; max: number }>
> = {
  age: { min: 10, max: 100 },
  height: { min: 50, max: 250 },
  currentWeight: { min: 20, max: 300 },
  targetWeight: { min: 20, max: 300 },
  bodyFatPercentage: { min: 3, max: 70 },

  waist: { min: 30, max: 200 },
  chest: { min: 30, max: 200 },
  arm: { min: 15, max: 100 },
  hip: { min: 30, max: 200 },
};

/* ================== FORM TYPE ================== */

type FormState = {
  gender: string;
  age: number | string;
  height: number | string;
  currentWeight: number | string;
  targetWeight: number | string;
  bodyFatPercentage: number | string;
  mainObjective: string;
  userPriority: string;
  goalDeadline: string;
  waist: number | string;
  chest: number | string;
  arm: number | string;
  hip: number | string;
};

export default function BodyOverview({ profile }: Props) {
  const { refreshUser } = useUser();

  const [form, setForm] = useState<FormState>({
    gender: profile?.gender || "",
    age: profile?.age || "",
    height: profile?.height || "",
    currentWeight: profile?.currentWeight || "",
    targetWeight: profile?.targetWeight || "",
    bodyFatPercentage: profile?.bodyFatPercentage || "",
    mainObjective: profile?.mainObjective || "",
    userPriority: profile?.userPriority || "",
    goalDeadline: profile?.goalDeadline
      ? profile.goalDeadline.split("T")[0]
      : "",
    waist: profile?.measurements?.waist || "",
    chest: profile?.measurements?.chest || "",
    arm: profile?.measurements?.arm || "",
    hip: profile?.measurements?.hip || "",
  });

  if (!profile) return null;

  const handleChange = (
    key: keyof FormState,
    rawValue: string
  ) => {
    const limits = NUMBER_LIMITS[key];

    if (limits) {
      if (rawValue === "") {
        setForm((prev) => ({ ...prev, [key]: "" }));
        return;
      }

      let num = Number(rawValue);
      if (isNaN(num)) return;

      setForm((prev) => ({ ...prev, [key]: num }));
    } else {
      setForm((prev) => ({ ...prev, [key]: rawValue }));
    }
  };



  const handleSave = async () => {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!data.success) throw new Error();

    await refreshUser();
  };

  /* ================== FIELD CONFIG ================== */

  const fields: {
    key: keyof FormState;
    label: string;
    type: "number" | "select" | "date";
    unit?: string;
  }[] = [
      { key: "gender", label: "جنسیت", type: "select" },
      { key: "age", label: "سن", type: "number" },
      { key: "height", label: "قد", type: "number", unit: "cm" },
      { key: "currentWeight", label: "وزن فعلی", type: "number", unit: "kg" },
      { key: "targetWeight", label: "وزن هدف", type: "number", unit: "kg" },
      { key: "bodyFatPercentage", label: "درصد چربی", type: "number", unit: "%" },
      { key: "waist", label: "دور کمر", type: "number", unit: "cm" },
      { key: "chest", label: "دور سینه", type: "number", unit: "cm" },
      { key: "arm", label: "دور بازو", type: "number", unit: "cm" },
      { key: "hip", label: "دور باسن", type: "number", unit: "cm" },
      { key: "mainObjective", label: "هدف اصلی", type: "select" },
      { key: "userPriority", label: "اولویت", type: "select" },
      { key: "goalDeadline", label: "ددلاین", type: "date" },
    ];

  /* ================== RENDER INPUT ================== */

  const renderInput = (
    field: (typeof fields)[number],
    isEditing: boolean
  ) => {
    const value = form[field.key];

    if (!isEditing) {
      if (!value) return <span className="text-gray-600">خالی</span>;

      if (field.key === "mainObjective" || field.key === "userPriority")
        return getLabel(String(value));

      if (field.key === "goalDeadline")
        return new Date(value).toLocaleDateString("fa-IR");

      return field.unit ? `${value} ${field.unit}` : value;
    }

    if (field.type === "select") {
      return (
        <Select
          value={String(value ?? "")}
          onChange={(e) => handleChange(field.key, e.target.value)}
        >
          <option value="">انتخاب کنید</option>

          {field.key === "gender" && (
            <>
              <option value="male">مرد</option>
              <option value="female">زن</option>
            </>
          )}

          {field.key === "mainObjective" && (
            <>
              <option value="fat_loss">چربی‌سوزی</option>
              <option value="muscle_gain">حجم و عضله سازی</option>
              <option value="strength">افزایش قدرت</option>
              <option value="cut">کات</option>
              <option value="health">سلامتی</option>
              <option value="recomposition">اصلاح ترکیب بدن</option>
            </>
          )}

          {field.key === "userPriority" && (
            <>
              <option value="appearance">ظاهر</option>
              <option value="performance">عملکرد</option>
              <option value="health">سلامتی</option>
            </>
          )}
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
            setForm((prev) => ({ ...prev, [field.key]: num }));
          }}
          className={
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }
        />
      );
    }

  };

  return (
    <EditableCard title="اطلاعات بدنی" onSave={handleSave}>
      {(isEditing) => (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          {fields.map((field) => (
            <Field key={field.key} label={field.label}>
              {renderInput(field, isEditing)}
            </Field>
          ))}
        </div>
      )}
    </EditableCard>
  );
}

/* ================== FIELD WRAPPER ================== */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="text-gray-300 font-medium">{children}</div>
    </div>
  );
}
