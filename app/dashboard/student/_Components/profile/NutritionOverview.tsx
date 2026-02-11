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
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
