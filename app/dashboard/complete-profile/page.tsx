"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/app/Components/toast/Toast";
import { useUser } from "@/app/context/UserContext";

import { steps } from "./steps";
import { ProfileForm } from "./types";
import { generateConfetti } from "./utils/confetti";

import ProgressDots from "./components/ProgressDots";
import ConfirmModal from "./components/ConfirmModal";
import ConfettiLayer from "./components/ConfettiLayer";
import StepRenderer from "./components/StepRenderer";

export default function CompleteProfilePage() {
  const { refreshUser } = useUser();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ProfileForm>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [confetti, setConfetti] = useState<any[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string; type?: "success" | "error" }>({
    show: false,
    message: "",
  });

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

 const submit = async () => {
  try {
    setConfetti(generateConfetti(50));

    const payload = {
      ...form,

      uiPreferences: {
        bodyVisuals: {
          current: form.currentBodyVisual,
          target: form.targetBodyVisual,
        },
      },
    };

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      setToast({
        show: true,
        message: "ذخیره نشد",
        type: "error",
      });
      return;
    }

    setToast({
      show: true,
      message: "پروفایل با موفقیت ثبت شد",
      type: "success",
    });

    await refreshUser();
    router.replace("/dashboard/student");
  } catch {
    setToast({
      show: true,
      message: "خطا در ذخیره اطلاعات",
      type: "error",
    });
  }
};



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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-black via-gray-900 to-black p-4">
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      <ConfettiLayer confetti={confetti} />

      <div ref={containerRef} className="w-full max-w-md bg-gray-900/95 p-6 rounded-3xl border border-gray-700 shadow-2xl">
        <ProgressDots step={step} total={steps.length} />
        <StepRenderer
          step={step}
          form={form}
          setForm={setForm}
          onNext={next}
          onPrev={prev}
          onConfirm={() => setShowConfirm(true)}
          onInvalid={() =>
            setToast({
              show: true,
              message: "لطفاً همه فیلدها را پر کنید",
              type: "error",
            })
          }
        />

      </div>

      {showConfirm && (
        <ConfirmModal
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            submit();
          }}
        />
      )}
    </div>
  );
}
