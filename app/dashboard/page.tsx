"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "../Components/toast/Toast";

interface ProfileType {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  primaryGoal?: string;
  currentWeight?: number;
  bodyFatPercentage?: number;
  waistCircumference?: number;
  chestCircumference?: number;
  armCircumference?: number;
  trainingLevel?: string;
  bodyGoalType?: string;
  workOutDays?: string;
  calorieTarget?: string;
  foodAllergies?: string;
  dietaryRstrictions?: string;
  dietPlanType?: string;
}

interface UserType {
  name: string;
  email: string;
  profile?: ProfileType;
}

interface ProfileField {
  name: keyof ProfileType;
  placeholder: string;
  type: "text" | "number";
  halfWidth?: boolean;
}

const stepsFields: Record<number, ProfileField[]> = {
  1: [
    { name: "age", placeholder: "سن", type: "number", halfWidth: true },
    { name: "gender", placeholder: "جنسیت", type: "text", halfWidth: true },
    { name: "height", placeholder: "قد", type: "number", halfWidth: true },
    { name: "weight", placeholder: "وزن", type: "number", halfWidth: true },
  ],
  2: [
    { name: "primaryGoal", placeholder: "هدف اصلی", type: "text", halfWidth: true },
    { name: "currentWeight", placeholder: "وزن فعلی", type: "number", halfWidth: true },
    { name: "bodyFatPercentage", placeholder: "درصد چربی بدن", type: "number", halfWidth: true },
    { name: "waistCircumference", placeholder: "دور کمر", type: "number", halfWidth: true },
    { name: "chestCircumference", placeholder: "دور سینه", type: "number" },
    { name: "armCircumference", placeholder: "دور بازو", type: "number" },
  ],
  3: [
    { name: "trainingLevel", placeholder: "سطح تمرین", type: "text" },
    { name: "bodyGoalType", placeholder: "نوع هدف بدنی", type: "text" },
    { name: "workOutDays", placeholder: "روزهای تمرین", type: "text" },
  ],
  4: [
    { name: "calorieTarget", placeholder: "کالری هدف", type: "text" },
    { name: "foodAllergies", placeholder: "آلرژی غذایی", type: "text" },
    { name: "dietaryRstrictions", placeholder: "محدودیت‌های غذایی", type: "text" },
    { name: "dietPlanType", placeholder: "نوع رژیم", type: "text" },
  ],
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<ProfileType>({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        if (!res.ok) router.replace("/login");
        else {
          setUser(data.user);
          setProfile(data.user.profile ?? {});
          setToast({ show: true, message: `${data.user.name} عزیز خوش آمدید!`, type: "success" });
          setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
        }
      } catch {
        router.replace("/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      setToast({ show: true, message: data.message, type: res.ok ? "success" : "error" });
      if (res.ok) setUser((prev) => (prev ? { ...prev, profile: data.profile } : null));
    } catch {
      setToast({ show: true, message: "خطا در ذخیره اطلاعات", type: "error" });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    } catch {
      setToast({ show: true, message: "خطا در خروج", type: "error" });
    }
  };

  if (!user) return <div className="flex items-center justify-center h-screen text-white text-xl">Loading...</div>;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center pt-10 text-white w-full px-4 md:px-0">
      <h1 className="text-2xl mb-5">{user.name} عزیز، داشبورد شما</h1>

      {/* Wizard */}
      <div className="bg-base-100 w-full rounded-lg p-4 shadow-base-300/20 shadow-sm max-w-4xl">
        {/* Stepper Nav */}
        <ul className="relative flex flex-col gap-2 md:flex-row mb-5">
          {["اطلاعات فردی", "آمار بدنی", "ترجیحات تمرینی", "تنظیمات تغذیه"].map((title, idx) => {
            const index = idx + 1;
            const active = step > index;
            return (
              <li key={idx} className="group flex flex-1 flex-col items-center gap-2 md:flex-row">
                <span className="min-h-7.5 min-w-7.5 inline-flex flex-col items-center gap-2 align-middle text-sm md:flex-row">
                  <span className={`flex size-7.5 shrink-0 items-center justify-center rounded-full font-medium ${active ? "bg-blue-800 text-white shadow-sm" : "bg-gray-500/30 text-gray-200"
                    }`}>
                    {index}
                  </span>
                  <span className="text-base-content text-nowrap font-medium ml-2">{title}</span>
                </span>
                {index <= 3 &&
                  <div className={`h-1 w-full  mt-2 md:mt-0 md:flex-1 ${active ? "bg-blue-800 shadow-sm" : "bg-gray-500/30"}`}></div>
                }
              </li>
            );
          })}
        </ul>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
          {/* Render Step Inputs Dynamically */}
          <div className="flex flex-wrap gap-3">
            {stepsFields[step].map((field) => (
              <input
                key={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className={`input p-3 bg-gray-700 text-white rounded ${field.halfWidth ? "w-[calc(50%-0.75rem)]" : "w-full"
                  }`}
                value={profile[field.name] ?? ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    [field.name]:
                      field.type === "number"
                        ? e.target.value === ""
                          ? undefined
                          : +e.target.value
                        : e.target.value,
                  })
                }
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-5 flex items-center justify-between gap-y-2">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="bg-red-700 p-3 rounded-2xl">
                Back </button>
            )
            }
            {step < 4 && (
              <button type="button" onClick={nextStep} className="bg-blue-700 p-3 rounded-2xl">
                Next
              </button>
            )}
            {step === 4 && (
              <button type="submit" className="bg-blue-700 p-4 rounded-2xl">
                ذخیره اطلاعات
              </button>
            )}
          </div>
        </form>
      </div>

      <button onClick={handleLogout} className="mt-6 bg-red-500 hover:bg-red-400 px-4 py-2 rounded">
        خروج
      </button>

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
