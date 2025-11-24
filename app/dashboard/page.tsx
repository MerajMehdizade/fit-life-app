"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "../Components/toast/Toast";
import DropdownMenu from "../Components/DropdownMenu/DropdownMenu";

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
}

const stepsFields: Record<number, ProfileField[]> = {
  1: [
    { name: "age", placeholder: "سن", type: "number" },
    { name: "gender", placeholder: "جنسیت", type: "text" },
    { name: "height", placeholder: "قد", type: "number" },
    { name: "weight", placeholder: "وزن", type: "number" },
  ],
  2: [
    { name: "primaryGoal", placeholder: "هدف اصلی", type: "text" },
    { name: "currentWeight", placeholder: "وزن فعلی", type: "number" },
    { name: "bodyFatPercentage", placeholder: "درصد چربی بدن", type: "number" },
    { name: "waistCircumference", placeholder: "دور کمر", type: "number" },
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
    const allFields = Object.values(stepsFields).flat();
    const emptyField = allFields.find((field) => {
      const value = profile[field.name];
      return value === undefined || value === "";
    });
    if (emptyField) {
      const fieldStep = Object.entries(stepsFields).find(([_, fields]) =>
        fields.some((f) => f.name === emptyField.name)
      );
      if (fieldStep) setStep(Number(fieldStep[0]));
      setToast({
        show: true,
        message: `لطفا فیلد "${emptyField.placeholder}" را پر کنید`,
        type: "error",
      });
      return; 
    }
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
  if (!user)
    return <div className="flex items-center justify-center h-screen text-white text-xl">Loading...</div>;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  return (
    <>
      <div className="bg-gray-900 min-h-screen">
        <DropdownMenu user={user} onLogout={handleLogout} />
        <div className="flex flex-col items-center md:pt-10 text-white w-full px-4 md:px-0">
          <ul className="relative flex gap-6 md:gap-2 mb-5 font-yekanBakhBold mt-10">
            {["اطلاعات فردی", "آمار بدنی", "ترجیحات تمرینی", "تنظیمات تغذیه"].map((title, idx) => {
              const index = idx + 1;
              const active = step > index;
              return (
                <li key={idx} className="group flex flex-1 flex-col items-center gap-2 md:flex-row">
                  <span className="min-h-7.5 min-w-7.5 inline-flex flex-col items-center gap-2 align-middle text-sm">
                    <div className="flex items-center justify-center gap-5 ">
                      <span
                        className={`flex size-7.5 shrink-0 items-center justify-center rounded-full font-medium ${
                          active ? "bg-blue-800 text-white shadow-sm" : "bg-gray-500/30 text-gray-200"
                        }`}
                      >
                        {active ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        ) : (
                          index
                        )}
                      </span>
                      {index <= 3 && (
                        <div
                          className={`md:h-1 md:w-30 rounded-2xl ${
                            active ? "bg-blue-800 shadow-sm" : "bg-gray-500/30 hidden md:block"
                          }`}
                        ></div>
                      )}
                    </div>
                    <span className="text-base-content text-nowrap font-medium mt-2">{title}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="w-full rounded-lg p-4 shadow-sm max-w-4xl">
            <form onSubmit={handleProfileSubmit} className="flex flex-col justify-between gap-6 h-full p-5">
              <div className="flex flex-wrap gap-3">
                {stepsFields[step].map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className={`p-2 bg-gray-700 text-white rounded-lg tex-sm w-full h-10 md:w-[calc(50%-0.75rem)] `}
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

              <div className="mt-5 flex items-center justify-between gap-y-2 ">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="hover:bg-red-500 w-24 h-12  p-3 rounded-md cursor-pointer transition-all text-center"
                  >
                    بازگشت
                  </button>
                )}
                {step < 4 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-cyan-900 w-24 h-12 p-3 rounded-md cursor-pointer transition-all text-center ms-auto"
                  >
                    بعدی
                  </button>
                )}
                {step === 4 && (
                  <button
                    type="submit"
                    className="bg-cyan-950 w-30 h-12 p-3 rounded-md cursor-pointer transition-all text-center"
                  >
                    ذخیره اطلاعات
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      </div>
    </>
  );
}
