"use client";

import { useState } from "react";
import EditableCard from "./EditableCard";
import { getLabel } from "@/lib/labels";
import { useUser } from "@/app/context/UserContext";
import { Select } from "@/app/Components/Form/Select";
import { Input } from "@/app/Components/Form/Input";

interface Props {
  profile: any;
}

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
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
              <option value="muscle_gain">افزایش عضله</option>
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
