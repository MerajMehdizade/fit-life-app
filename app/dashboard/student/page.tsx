"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DropdownMenu from "../../Components/DropdownMenu/DropdownMenu";
import Link from "next/link";
import Toast from "@/app/Components/toast/Toast";
import AvatarCropper from "@/app/Components/AvatarCropper/AvatarCropper";
import { createCroppedBlob } from "@/lib/createCroppedBlob";
import { useUser } from "@/app/context/UserContext";

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
  avatar: string | null;
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
  const { user, setUser } = useUser();
  const [profile, setProfile] = useState<ProfileType>({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [step, setStep] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    setAvatarPreview(user.avatar ? `${user.avatar}?t=${Date.now()}` : "/avatars/default.webp");
    setProfile(user.profile ?? {});
  }, [user]);

  const handleAvatarDelete = async () => {
    try {
      const res = await fetch("/api/user/avatar/delete", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const defaultAvatar = `/avatars/default.webp?t=${Date.now()}`;
        setAvatarPreview(defaultAvatar);
        setUser(prev => prev ? { ...prev, avatar: "" } : null);
        setToast({ show: true, message: "آواتار حذف شد", type: "success" });
      } else {
        setToast({ show: true, message: data.error || "خطا در حذف آواتار", type: "error" });
      }
    } catch {
      setToast({ show: true, message: "خطا در ارتباط با سرور", type: "error" });
    }
  };

  const handleAvatarUpload = async (blob: Blob) => {
    const fd = new FormData();
    fd.append("avatar", blob);

    try {
      const res = await fetch("/api/user/avatar", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();

      if (data.success && data.avatar) {
        const newAvatarUrl = `${data.avatar}?t=${Date.now()}`;
        setAvatarPreview(newAvatarUrl);
        setUser(prev => prev ? { ...prev, avatar: data.avatar } : null);
        setCropFile(null);
        setToast({ show: true, message: "آواتار با موفقیت آپلود شد", type: "success" });
      } else {
        setToast({ show: true, message: data.error || "خطا در آپلود آواتار", type: "error" });
      }
    } catch {
      setToast({ show: true, message: "خطا در ارتباط با سرور", type: "error" });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allFields = Object.values(stepsFields).flat();
    const emptyField = allFields.find(field => profile[field.name] === undefined || profile[field.name] === "");
    if (emptyField) {
      const fieldStep = Object.entries(stepsFields).find(([_, fields]) =>
        fields.some(f => f.name === emptyField.name)
      );
      if (fieldStep) setStep(Number(fieldStep[0]));
      setToast({ show: true, message: `لطفا فیلد "${emptyField.placeholder}" را پر کنید`, type: "error" });
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
      if (res.ok) setUser(prev => prev ? { ...prev, profile: data.profile } : null);
    } catch {
      setToast({ show: true, message: "خطا در ذخیره اطلاعات", type: "error" });
    }
  };

  if (!user) return <div className="flex items-center justify-center h-screen text-white text-xl">Loading...</div>;

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <>
      <div className="bg-gray-900 min-h-screen">
        <DropdownMenu role="Student" />

        <div className="flex flex-col items-center md:pt-10 text-white w-full px-4 md:px-0">
          {/* Steps UI */}
          <ul className="relative flex gap-6 md:gap-2 mb-5 font-yekanBakhBold mt-10">
            {["اطلاعات فردی", "آمار بدنی", "ترجیحات تمرینی", "تنظیمات تغذیه"].map((title, idx) => {
              const index = idx + 1;
              const active = step > index;
              return (
                <li key={idx} className="group flex flex-1 flex-col items-center gap-2 md:flex-row">
                  <span className="min-h-7.5 min-w-7.5 inline-flex flex-col items-center gap-2 align-middle text-sm">
                    <div className="flex items-center justify-center gap-5">
                      <span className={`flex size-7.5 shrink-0 items-center justify-center rounded-full font-medium ${active ? "bg-blue-800 text-white shadow-sm" : "bg-gray-500/30 text-gray-200"}`}>
                        {active ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        ) : index}
                      </span>
                      {index <= 3 && (
                        <div className={`md:h-1 md:w-30 rounded-2xl ${active ? "bg-blue-800 shadow-sm" : "bg-gray-500/30 hidden md:block"}`}></div>
                      )}
                    </div>
                    <span className="text-base-content text-nowrap font-medium mt-2">{title}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Avatar Upload */}
          <div className="w-full rounded-lg p-4 shadow-sm max-w-4xl">
            <div className="flex flex-col items-center mb-6 gap-3">
              <img src={avatarPreview || "/avatars/default.webp"} className="w-28 h-28 rounded-full object-cover border-4 border-cyan-800" />
              <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition" onClick={handleAvatarDelete}>حذف آواتار</button>
              <label className="cursor-pointer bg-cyan-900 px-4 py-2 rounded-lg">
                تغییر آواتار
                <input type="file" accept="image/*" hidden onChange={e => setCropFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          </div>
        </div>

        <Link href="/dashboard/student/program" className="p-2 bg-green-500 rounded-xl inline-block">برنامه</Link>

        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      </div>

      {cropFile && (
        <AvatarCropper file={cropFile} onConfirm={async area => {
          const blob = await createCroppedBlob(cropFile, area);
          handleAvatarUpload(blob);
        }} onCancel={() => setCropFile(null)} />
      )}
    </>
  );
}
