"use client";

import { useState, useEffect } from "react";
import EditableCard from "./EditableCard";
import { getLabel } from "@/lib/labels";
import { useUser } from "@/app/context/UserContext";
import { Select } from "@/app/Components/Form/Select";
import { Input } from "@/app/Components/Form/Input";
import FormInput from "@/app/dashboard/complete-profile/components/FormInput";

interface Props {
  profile: any;
}

const NUMBER_LIMITS: Partial<
  Record<keyof NutritionForm, { min: number; max: number }>
> = {
  calorieTarget: { min: 100, max: 10000 },
  protein: { min: 10, max: 500 },
  carbs: { min: 10, max: 1000 },
  fat: { min: 5, max: 300 },
};

/* ================= TYPE ================= */

type NutritionForm = {
  dietPlanPreference: string;
  calorieTarget: number | string;
  protein: number | string;
  carbs: number | string;
  fat: number | string;
  foodAllergies: string;
  dietaryRestrictions: string;
};


export default function NutritionOverview({ profile }: Props) {
  const { refreshUser } = useUser();

  const [form, setForm] = useState<NutritionForm>({
    dietPlanPreference: "",
    calorieTarget: "",
    foodAllergies: "",
    dietaryRestrictions: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  useEffect(() => {
    setForm({
      dietPlanPreference: profile?.dietPlanPreference || "",
      calorieTarget: profile?.nutritionPlan?.calorieTarget || "",
      protein: profile?.nutritionPlan?.macros?.protein || "",
      carbs: profile?.nutritionPlan?.macros?.carbs || "",
      fat: profile?.nutritionPlan?.macros?.fat || "",
      foodAllergies: profile?.foodAllergies?.join(", ") || "",
      dietaryRestrictions: profile?.dietaryRestrictions?.join(", ") || "",
    });
  }, [profile]);


  const handleChange = (
    key: keyof NutritionForm,
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
      dietPlanPreference: form.dietPlanPreference,

      nutritionPlan: {
        calorieTarget: Number(form.calorieTarget),
        macros: {
          protein: Number(form.protein),
          carbs: Number(form.carbs),
          fat: Number(form.fat),
        },
        calculatedAt: new Date(),
      },

      foodAllergies: form.foodAllergies
        ? form.foodAllergies.split(",").map((i) => i.trim())
        : [],

      dietaryRestrictions: form.dietaryRestrictions
        ? form.dietaryRestrictions.split(",").map((i) => i.trim())
        : [],
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
    key: keyof NutritionForm;
    label: string;
    type: "number" | "select" | "text";
  }[] = [
      { key: "dietPlanPreference", label: "نوع رژیم", type: "select" },
      { key: "calorieTarget", label: "کالری هدف", type: "number" },
      { key: "protein", label: "پروتئین (گرم)", type: "number" },
      { key: "carbs", label: "کربوهیدرات (گرم)", type: "number" },
      { key: "fat", label: "چربی (گرم)", type: "number" },
      { key: "foodAllergies", label: "آلرژی غذایی", type: "text" },
      { key: "dietaryRestrictions", label: "محدودیت غذایی", type: "text" },
    ];

  const renderField = (
    field: (typeof fields)[number],
    isEditing: boolean
  ) => {
    const value = form[field.key];

    if (!isEditing) {
      if (!value) return <span className="text-gray-600">خالی</span>;

      if (field.key === "dietPlanPreference")
        return getLabel(String(value));

      return value;
    }

    if (field.type === "select") {
      return (
        <Select
          value={String(value ?? "")}
          onChange={(e) => handleChange(field.key, e.target.value)}
        >
          <option value="">انتخاب کنید</option>
          <option value="balanced">متعادل</option>
          <option value="keto">کتو</option>
          <option value="vegan">وگان</option>
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
    <EditableCard title="تغذیه" onSave={handleSave}>
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
