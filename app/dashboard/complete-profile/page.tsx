"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/app/Components/Form/Select";
import { Input } from "@/app/Components/Form/Input";

/* ================= TYPES ================= */

type ProfileForm = {
  gender?: "male" | "female";
  currentBodyType?: "slim" | "average" | "fit" | "muscular";
  primaryGoal?: "slim" | "average" | "fit" | "muscular";
  age?: number;
  height?: number;
  weight?: number;
  trainingLevel?: "beginner" | "intermediate" | "pro";
  workOutDays?: string;
  calorieTarget?: number;
  foodAllergies?: string;
  dietaryRstrictions?: string;
  dietPlanType?: "balanced" | "keto" | "vegan";
};

/* ================= STEPS ================= */

type Field = {
  name: keyof ProfileForm;
  placeholder?: string;
  type: "text" | "number" | "select" | "image";
  options?: string[];
  images?: Record<string, string>;
  helperText?: string;
};

const steps: { title: string; fields: Field[]; required: (keyof ProfileForm)[] }[] = [
  {
    title: "مرحله ۱ : انتخاب جنسیت",
    required: ["gender"],
    fields: [
      {
        name: "gender",
        type: "image",
        helperText: "لطفاً جنسیت خود را انتخاب کنید",
        images: { male: "/body/gender/male.PNG", female: "/body/gender/female.PNG" },
      },
    ],
  },
  {
    title: "مرحله ۲ : بدن فعلی",
    required: ["currentBodyType"],
    fields: [
      {
        name: "currentBodyType",
        type: "image",
        helperText: "بدنتان فعلاً شبیه کدام گزینه است؟",
        images: {
          slim: "/body/{gender}/slim.PNG",
          average: "/body/{gender}/average.PNG",
          fit: "/body/{gender}/fit.PNG",
          muscular: "/body/{gender}/muscular.PNG",
        },
      },
    ],
  },
  {
    title: "مرحله ۳ : هدف بدنی",
    required: ["primaryGoal"],
    fields: [
      {
        name: "primaryGoal",
        type: "image",
        helperText: "می‌خواهید بدنتان به کدام شکل برسد؟",
        images: {
          slim: "/body/{gender}/slim.PNG",
          average: "/body/{gender}/average.PNG",
          fit: "/body/{gender}/fit.PNG",
          muscular: "/body/{gender}/muscular.PNG",
        },
      },
    ],
  },
  {
    title: "مرحله ۴ : اطلاعات پایه",
    required: ["age", "height", "weight"],
    fields: [
      { name: "age", placeholder: "سن (سال)", type: "number" },
      { name: "height", placeholder: "قد (cm)", type: "number" },
      { name: "weight", placeholder: "وزن (kg)", type: "number" },
    ],
  },
  {
    title: "مرحله ۵ : تمرین و سبک زندگی",
    required: ["trainingLevel", "workOutDays"],
    fields: [
      {
        name: "trainingLevel",
        type: "select",
        placeholder: "سطح تمرین",
        options: ["beginner", "intermediate", "pro"],
      },
      { name: "workOutDays", placeholder: "روزهای تمرین در هفته", type: "text" },
    ],
  },
  {
    title: "مرحله ۶ : تغذیه",
    required: ["calorieTarget", "foodAllergies", "dietaryRstrictions", "dietPlanType"],
    fields: [
      { name: "calorieTarget", placeholder: "کالری هدف روزانه", type: "number" },
      { name: "foodAllergies", placeholder: "آلرژی غذایی", type: "text" },
      { name: "dietaryRstrictions", placeholder: "محدودیت غذایی ", type: "text" },
      {
        name: "dietPlanType",
        type: "select",
        placeholder: "نوع رژیم",
        options: ["balanced", "keto", "vegan"],
      },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function CompleteProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ProfileForm>({});
  const [error, setError] = useState("");

  const numericFields: (keyof ProfileForm)[] = ["age", "height", "weight", "calorieTarget"];

  const update = (key: keyof ProfileForm, value: any) => {
    setForm((p) => ({
      ...p,
      [key]: numericFields.includes(key) ? Number(value) : value,
    }));
  };

  const validateStep = () => {
    const required = steps[step].required;
    return required.filter((f) => {
      const val = form[f];
      if (val === undefined || val === null) return true;
      if (typeof val === "string" && val.trim() === "") return true;
      if (typeof val === "number" && isNaN(val)) return true;
      return false;
    });
  };

  const next = () => {
    if (validateStep().length) return setError("لطفاً همه فیلدهای این مرحله را پر کنید");
    setError("");
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const submit = async () => {
    if (validateStep().length) return setError("فرم ناقص است");

    const res = await fetch("/api/user/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!data.profileCompleted) return setError("ذخیره نشد");
    router.push("/dashboard/student");
  };

  const progress = Math.round(((step + 1) / steps.length) * 100);

  const renderField = (field: Field) => {
    const key = field.name;
    if (field.type === "select") {
      return (
        <Select
          icon={false}
          key={key}
          value={form[key]?.toString() ?? ""}
          onChange={(e) => update(key, e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-800"
        >
          <option value="">{field.placeholder}</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      );
    }

    if (field.type === "image" && field.images) {
      const gender = form.gender || "male";
      return (
        <div key={key} className="flex flex-wrap gap-4 justify-center mt-2">
          {Object.entries(field.images).map(([value, src]) => {
            const url = src.replace("{gender}", gender);
            const selected = form[key] === value;
            return (
              <div
                key={value}
                onClick={() => update(key, value as any)}
                className={`cursor-pointer border-4 rounded-xl overflow-hidden transition ${
                  selected ? "border-green-400 scale-105" : "border-gray-700"
                }`}
              >
                <img src={url} className="w-36 h-36 object-cover" />
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <Input
        key={key}
        type={field.type}
        value={form[key] ?? ""}
        placeholder={field.placeholder}
        onChange={(e) => update(key, e.target.value)}
        className="w-full p-3 rounded-xl"
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-black via-gray-900 to-black text-white p-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-700 shadow-2xl">

        {/* PROGRESS BAR */}
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-1">{progress}%</div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-2 bg-green-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">{steps[step].title}</h1>
        {steps[step].fields[0].helperText && (
          <p className="text-gray-300 text-sm mb-4">{steps[step].fields[0].helperText}</p>
        )}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="flex flex-col gap-4">{steps[step].fields.map(renderField)}</div>

        <div className="flex justify-between mt-6">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="bg-red-700 px-4 py-2 rounded-2xl">
              قبلی
            </button>
          )}
          {step < steps.length - 1 && (
            <button onClick={next} className="bg-sky-700 px-4 py-2 rounded-2xl">
              بعدی
            </button>
          )}
          {step === steps.length - 1 && (
            <button onClick={submit} className="bg-green-500 px-4 py-2 rounded-2xl">
              اتمام
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
