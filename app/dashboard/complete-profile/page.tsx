"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/app/Components/Form/Select";
import { Input } from "@/app/Components/Form/Input";
import Toast from "@/app/Components/toast/Toast";
import { useUser } from "@/app/context/UserContext";

/* ================= TYPES ================= */

type ProfileForm = {
  name?: string;
  gender?: "male" | "female";
  currentBodyType?: "slim" | "average" | "fit" | "muscular";
  primaryGoal?: "slim" | "average" | "fit" | "muscular";
  age?: number;
  height?: number;
  weight?: number;
  currentWeight?: number;
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
    title: "مرحله ۱: جنسیتت رو انتخاب کن",
    required: ["gender"],
    fields: [
      {
        name: "gender",
        type: "image",
        helperText: "جنسیت خود را انتخاب کنید",
        images: { male: "/body/gender/male.PNG", female: "/body/gender/female.PNG" },
      },
    ],
  },
  {
    title: "مرحله ۲: وضعیت بدن فعلی",
    required: ["currentBodyType"],
    fields: [
      {
        name: "currentBodyType",
        type: "image",
        helperText: "بدنتان فعلاً شبیه کدام است؟",
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
    title: "مرحله ۳: هدف بدن",
    required: ["primaryGoal"],
    fields: [
      {
        name: "primaryGoal",
        type: "image",
        helperText: "می‌خواهید به کدام شکل برسید؟",
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
    title: "مرحله ۴: اطلاعات پایه",
    required: ["age", "height", "weight", "currentWeight"],
    fields: [
      { name: "age", placeholder: "سن (سال)", type: "number" },
      { name: "height", placeholder: "قد (cm)", type: "number" },
      { name: "weight", placeholder: "وزن (kg)", type: "number" },
      { name: "currentWeight", placeholder: "وزن هدف (kg)", type: "number" },
    ],
  },
  {
    title: "مرحله ۵: تمرین و سبک زندگی",
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
    title: "مرحله ۶: تغذیه",
    required: ["calorieTarget", "foodAllergies", "dietaryRstrictions", "dietPlanType"],
    fields: [
      { name: "calorieTarget", placeholder: "کالری هدف روزانه", type: "number" },
      { name: "foodAllergies", placeholder: "آلرژی غذایی", type: "text" },
      { name: "dietaryRstrictions", placeholder: "محدودیت غذایی", type: "text" },
      {
        name: "dietPlanType",
        type: "select",
        placeholder: "نوع رژیم",
        options: ["balanced", "keto", "vegan"],
      },
    ],
  },
];

/* ================= Confetti دستی ================= */

const generateConfetti = (count: number) => {
  const colors = ["#FBBF24", "#60A5FA", "#34D399", "#F87171", "#A78BFA"];
  return Array.from({ length: count }).map(() => ({
    id: Math.random().toString(36).substr(2, 9),
    left: Math.random() * 100,
    rotate: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
    duration: Math.random() * 2 + 1.5,
  }));
};

/* ================= COMPONENT ================= */

export default function CompleteProfilePage() {
  const { refreshUser, setUser } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ProfileForm>({});
  const [toast, setToast] = useState<{ show: boolean; message: string; type?: "success" | "error" }>({
    show: false,
    message: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confetti, setConfetti] = useState<{ id: string; left: number; rotate: number; color: string; size: number; duration: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const numericFields: (keyof ProfileForm)[] = ["age", "height", "weight", "calorieTarget"];

  /* ================= UPDATE INPUTS ================= */

  const update = (key: keyof ProfileForm, value: any) => {
    const num = numericFields.includes(key) ? Number(value) : value;
    setForm((p) => ({
      ...p,
      [key]: value === "" ? undefined : num,
    }));
  };

  /* ================= VALIDATE ================= */

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

  /* ================= NUMERIC VALIDATION ================= */

  const isInvalidNumber = (key: keyof ProfileForm) => {
    const val = Number(form[key]);
    if (isNaN(val)) return false;
    if (key === "age" && (val < 10 || val > 100)) return true;
    if (key === "height" && (val < 50 || val > 250)) return true;
    if (key === "weight" && (val < 20 || val > 300)) return true;
    if (key === "calorieTarget" && (val < 100 || val > 10000)) return true;
    return false;
  };

  /* ================= NEXT / PREV ================= */

  const next = () => {
    const invalid = validateStep();
    if (invalid.length) {
      setToast({ show: true, message: "لطفاً همه فیلدها را پر کنید", type: "error" });
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  /* ================= SUBMIT ================= */

  const submit = async () => {
    const invalid = validateStep();
    if (invalid.length) {
      setToast({ show: true, message: "فرم ناقص است", type: "error" });
      return;
    }

    setConfetti(generateConfetti(50));

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.profileCompleted) {
        setToast({ show: true, message: "ذخیره نشد", type: "error" });
        setConfetti([]);
        return;
      }
      const meRes = await fetch("/api/user/me", { cache: "no-store", credentials: "include" });
      const meData = await meRes.json();
      if (meData.user) {
        setUser(meData.user);
      }
      setToast({ show: true, message: "پروفایل با موفقیت ثبت شد", type: "success" });
      await refreshUser();
      router.replace("/dashboard/student");
      setTimeout(() => setConfetti([]), 3000);
    } catch {
      setToast({ show: true, message: "خطا، دوباره تلاش کنید", type: "error" });
      setConfetti([]);
    }
  };

  /* ================= SWIPE ================= */

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX: number | null = null;
    const onTouchStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (startX === null) return;
      const diff = e.touches[0].clientX - startX;
      if (diff > 100) prev();
      else if (diff < -100) next();
      startX = null;
    };
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [step]);

  /* ================= RENDER FIELD ================= */

  const renderField = (field: Field) => {
    const key = field.name;

    if (field.type === "select") {
      return (
        <Select
          icon={false}
          key={key}
          value={form[key]?.toString() ?? ""}
          onChange={(e) => update(key, e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 text-white"
        >
          <option value="">{field.placeholder}</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
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
                className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-transform duration-200 ${selected ? "border-green-400 scale-105" : "border-gray-700 hover:scale-105"
                  }`}
              >
                <img src={url} className="w-36 h-36 object-cover" />
              </div>
            );
          })}
        </div>
      );
    }

    /* ================= NUMBER INPUTS BETTER ================= */

    if (field.type === "number") {
      const min = key === "age" ? 10 : key === "height" ? 50 : key === "weight" ? 20 : 100;
      const max = key === "age" ? 100 : key === "height" ? 250 : key === "weight" ? 300 : 10000;

      return (
        <div key={key} className="flex items-center justify-between gap-2">
          <button type="button" onClick={() => update(key, Math.max(min, (Number(form[key] ?? min)) - 1))} className="px-3 py-1 bg-gray-700 rounded text-white">-</button>
          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={min}
            max={max}
            value={form[key] ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => update(key, e.target.value !== "" ? Number(e.target.value) : "")}
            className={`w-full p-3 rounded-xl bg-gray-800 border ${isInvalidNumber(key) ? "border-red-500" : "border-gray-700"} placeholder-gray-400 focus:ring-2 focus:ring-green-500 text-white`}
          />
          <button type="button" onClick={() => update(key, Math.min(max, (Number(form[key] ?? min)) + 1))} className="px-3 py-1 bg-gray-700 rounded text-white">+</button>
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
        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 text-white"
      />
    );
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-black via-gray-900 to-black p-4">
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

      {confetti.map((c) => (
        <div
          key={c.id}
          style={{
            position: "fixed",
            top: "-10px",
            left: `${c.left}vw`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            transform: `rotate(${c.rotate}deg)`,
            borderRadius: "50%",
            animation: `confetti-fall ${c.duration}s linear forwards`,
            zIndex: 9999,
          }}
        ></div>
      ))}

      <style>
        {`
          @keyframes confetti-fall {
            0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}
      </style>

      <div ref={containerRef} className="w-full max-w-md bg-gray-900/95 p-6 rounded-3xl border border-gray-700 shadow-2xl">
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, idx) => (
            <div key={idx} className={`w-4 h-4 rounded-full ${idx <= step ? "bg-green-400" : "bg-gray-700"}`}></div>
          ))}
        </div>

        <h1 className="text-xl font-bold mb-2 text-center text-white">{steps[step].title}</h1>
        {steps[step].fields[0].helperText && (
          <p className="text-gray-400 text-sm mb-4 text-center">{steps[step].fields[0].helperText}</p>
        )}

        <div className="flex flex-col gap-4">{steps[step].fields.map(renderField)}</div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {step < steps.length - 1 && <button onClick={next} className="text-green-500 border px-4 py-2 rounded-2xl">بعدی</button>}
          {step === steps.length - 1 && <button onClick={() => setShowConfirm(true)} className="text-green-500 border px-4 py-2 rounded-2xl">تایید نهایی</button>}
          {step > 0 && <button onClick={prev} className="text-red-500 border px-4 py-2 rounded-2xl">قبلی</button>}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full text-center border border-gray-700 shadow-2xl">
            <h2 className="text-md font-bold mb-4 text-white">آیا مطمئن هستید؟</h2>
            <p className="text-gray-300 mb-6">با تایید، اطلاعات پروفایل شما ثبت می‌شود.</p>
            <div className="flex justify-between gap-4">
              <button onClick={() => setShowConfirm(false)} className="w-1/2 py-2 border border-red-500 rounded-xl text-red-500">لغو</button>
              <button onClick={() => { setShowConfirm(false); submit(); }} className="w-1/2 py-2 border border-green-500 rounded-xl text-green-500">تایید</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
