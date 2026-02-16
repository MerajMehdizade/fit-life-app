"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { steps } from "../steps";
import { ProfileForm, Field } from "../types";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import OptionSelector from "@/app/Components/Form/OptionSelector";
import FormInput from "./FormInput";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  step: number;
  form: ProfileForm;
  setForm: Dispatch<SetStateAction<ProfileForm>>;
  onNext: () => void;
  onPrev: () => void;
  onConfirm: () => void;
  onInvalid: () => void;
};
const NUMBER_LIMITS: Partial<
  Record<keyof ProfileForm, { min: number; max: number }>
> = {
  age: { min: 10, max: 100 },
  height: { min: 50, max: 250 },
  currentWeight: { min: 20, max: 300 },
  targetWeight: { min: 20, max: 300 },
  workoutDaysPerWeek: { min: 1, max: 7 },
  calorieTarget: { min: 100, max: 10000 },

  sleepHours: { min: 1, max: 24 },

  trainingExperienceYears: { min: 0, max: 50 },
  maxWorkoutDuration: { min: 10, max: 300 },

  motivationLevel: { min: 1, max: 10 },
  confidenceLevel: { min: 1, max: 10 },
};


export default function StepRenderer({
  step,
  form,
  setForm,
  onNext,
  onPrev,
  onConfirm,
  onInvalid,
}: Props) {
  const numericFields: (keyof ProfileForm)[] = [
    "age",
    "height",
    "currentWeight",
    "targetWeight",
    "workoutDaysPerWeek",
    "calorieTarget",
    "sleepHours",
    "trainingExperienceYears",
    "maxWorkoutDuration",
    "motivationLevel",
    "confidenceLevel",
  ];

  const update = (key: keyof ProfileForm, value: any) => {
    const num = numericFields.includes(key) ? Number(value) : value;
    setForm((p) => ({
      ...p,
      [key]: value === "" ? undefined : num,
    }));
  };
  const [flowStage, setFlowStage] = useState<
    "gender" | "current" | "target"
  >("gender");

  const validateStep = () => {
    const required = steps[step].required ?? [];
    return required.filter((f) => {
      const val = form[f];
      if (val === undefined || val === null) return true;
      if (typeof val === "string" && val.trim() === "") return true;
      if (typeof val === "number" && isNaN(val)) return true;
      return false;
    });
  };



  const renderField = (field: Field) => {
    const key = field.name;
    const limits = NUMBER_LIMITS[key as keyof typeof NUMBER_LIMITS];
    const value = Number(form[key]);
    const hasError =
      limits &&
      !isNaN(value) &&
      (value < limits.min || value > limits.max);

    if (field.type === "triple-image" && field.images) {
      const gender = form.gender || "male";
      const images = field.images!;

      const handleSelect = (value: string) => {
        if (flowStage === "gender") {
          update("gender", value);
          setFlowStage("current");
        } else if (flowStage === "current") {
          update("currentBodyVisual", value);
          setFlowStage("target");
        } else {
          update("targetBodyVisual", value);
          setFlowStage("gender");
          onNext();
        }

      };

      const renderImages = () => {
        if (flowStage === "gender") {
          return ["male", "female"].map((value) => {
            const selected = form.gender === value;

            return (
              <div
                key={value}
                onClick={() => handleSelect(value)}
                className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-all ${selected
                  ? "border-green-400 scale-105"
                  : "border-gray-700 hover:scale-105"
                  }`}
              >
                <img
                  src={images[value]}
                  className="w-36 h-36 object-cover"
                />
              </div>
            );
          });
        }

        return ["body_1", "body_2", "body_3", "body_4"].map((value) => {
          const src = images[value].replace("{gender}", gender);

          const selected =
            flowStage === "current"
              ? form.currentBodyVisual === value
              : form.targetBodyVisual === value;

          return (
            <div
              key={value}
              onClick={() => handleSelect(value)}
              className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-all ${selected
                ? "border-green-400 scale-105"
                : "border-gray-700 hover:scale-105"
                }`}
            >
              <img src={src} className="w-36 h-36 object-cover" />
            </div>
          );
        });
      };

      return (
        <div
          key={field.name}
          className="w-full max-w-xl mx-auto flex flex-col items-center gap-6"

        >

          {/* Breadcrumb */}
          <div className="flex gap-4 text-sm">
            <button
              onClick={() => setFlowStage("gender")}
              className={flowStage === "gender" ? "text-green-400" : "text-gray-400"}
            >
              جنسیت {form.gender && "✓"}
            </button>

            <button
              onClick={() => form.gender && setFlowStage("current")}
              className={flowStage === "current" ? "text-green-400" : "text-gray-400"}
            >
              بدن فعلی {form.currentBodyVisual && "✓"}
            </button>

            <button
              onClick={() =>
                form.currentBodyVisual && setFlowStage("target")
              }
              className={flowStage === "target" ? "text-green-400" : "text-gray-400"}
            >
              بدن هدف {form.targetBodyVisual && "✓"}
            </button>
          </div>

          <h2 className="text-white text-lg font-semibold">
            {flowStage === "gender"
              ? "جنسیت خود را انتخاب کنید"
              : flowStage === "current"
                ? "بدن فعلی خود را انتخاب کنید"
                : "بدن هدف خود را انتخاب کنید"}
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {renderImages()}
          </div>
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={key} className="flex flex-col gap-2">
          <p className="text-sm text-gray-400">
            {field.placeholder}
          </p>

          <OptionSelector
            value={form[key]?.toString()}
            options={field.options}
            onChange={(val) => update(key, val)}
          />
        </div>
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
                className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-transform duration-200 ${selected
                  ? "border-green-400 scale-105"
                  : "border-gray-700 hover:scale-105"
                  }`}
              >
                <img src={url} className="w-36 h-36 object-cover" />
              </div>
            );
          })}
        </div>
      );
    }

    if (field.type === "number") {

      return (
        <div key={key} className="flex items-center justify-between gap-2">
          <FormInput
            key={key}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={limits?.min}
            max={limits?.max}
            value={
              form[key] instanceof Date
                ? form[key].toISOString().split("T")[0]
                : (form[key] as string | number | undefined) ?? ""
            }
            label={field.placeholder || ""}
            onChange={(e) => {
              update(key, e.target.value === "" ? "" : Number(e.target.value));
            }}
            onBlur={() => {
              const limits = NUMBER_LIMITS[key];
              const raw = form[key];

              if (!limits || raw === undefined || raw === null) return;

              let value = Number(raw);
              if (isNaN(value)) return;

              value = Math.min(limits.max, Math.max(limits.min, value));
              update(key, value);
            }}
            className={
              hasError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : ""}
          />


        </div>
      );
    }

    if (field.type === "date") {
      return (
        <DatePicker
          key={key}
          calendar={persian}
          locale={persian_fa}
          value={form[key] || ""}
          onChange={(date) => {
            update(key, date?.toDate?.() || date);
          }}
          inputClass="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
          placeholder={field.placeholder}
          calendarPosition="bottom-center"
        />
      );
    }

    return (
      <FormInput
        key={key}
        type={field.type}
        value={
          form[key] instanceof Date
            ? form[key].toISOString().split("T")[0]
            : form[key] ?? ""
        }
        label={field.placeholder || ""}
        onChange={(e) => update(key, e.target.value)}
      />
    );
  };

  const invalid = validateStep();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const measurementFields = ["waist", "chest", "arm", "hip"];
  const optionalFields = [
    "bodyFatPercentage",
    "waist",
    "chest",
    "arm",
    "hip",
  ];


  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <>
            <h1 className="text-2xl font-semibold mb-3 text-center text-white tracking-tight">
              {steps[step].title}
              {steps[step].optional && (
                <span className="text-xs text-gray-500 mr-2">
                  اختیاری
                </span>

              )}
            </h1>


            {steps[step].fields[0].helperText && (
              <p className="text-gray-400 text-sm mb-4 text-center">
                {steps[step].fields[0].helperText}
              </p>
            )}

            <div className="flex flex-col gap-4">
              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {steps[step].fields
                    .filter((f) =>
                      ["trainingLevel", "trainingLocation"].includes(f.name)
                    )
                    .map((field) => (
                      <div key={field.name}>
                        {renderField(field)}
                      </div>
                    ))}
                </div>
              )}


              {steps[step].fields
                .filter((field) => {

                  if (
                    step === 3 &&
                    ["trainingLevel", "trainingLocation"].includes(field.name)
                  ) {
                    return false;
                  }

                  if (step === 1 && optionalFields.includes(field.name)) {
                    return showAdvanced;
                  }

                  return true;
                })
                .map((field) => {
                  if (step === 1 && measurementFields.includes(field.name)) {
                    return null;
                  }

                  if (field.type === "triple-image") {
                    return (
                      <div key={field.name} className="w-full flex justify-center">
                        {renderField(field)}
                      </div>
                    );
                  }

                  return (
                    <div key={field.name}>
                      {renderField(field)}
                    </div>
                  );
                })}

              {step === 1 && showAdvanced && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {steps[step].fields
                    .filter((field) => measurementFields.includes(field.name))
                    .map((field) => (
                      <div key={field.name}>
                        {renderField(field)}
                      </div>
                    ))}
                </div>
              )}
              {step === 1 && (
                <button
                  type="button"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  className="text-sm text-green-400 hover:text-green-300 transition cursor-pointer mt-2"
                >
                  {showAdvanced
                    ? "بستن اطلاعات پیشرفته"
                    : "افزودن اطلاعات بیشتر (اختیاری)"}
                </button>
              )}

            </div>

            <div className="flex justify-between mt-6">
              {step !== 0 && step < steps.length - 1 && (
                <button
                  onClick={() => {
                    if (invalid.length) {
                      onInvalid();
                      return;
                    }
                    onNext();
                  }}
                  className="text-green-500 border px-4 py-2 rounded-2xl"
                >
                  بعدی
                </button>
              )}

              {step === steps.length - 1 && (
                <button
                  onClick={() => {
                    if (invalid.length) {
                      onInvalid();
                      return;
                    }
                    onConfirm();
                  }}
                  className="text-green-500 border px-4 py-2 rounded-2xl"
                >
                  تایید نهایی
                </button>
              )}

              {step > 0 && (
                <button
                  onClick={onPrev}
                  className="text-red-500 border px-4 py-2 rounded-2xl"
                >
                  قبلی
                </button>
              )}
            </div>
          </>
        </motion.div>
      </AnimatePresence>
    </>
  );

}
