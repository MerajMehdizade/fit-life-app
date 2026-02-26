"use client";

import { useState } from "react";
import Toast from "@/app/Components/toast/Toast";

interface Props {
  title: string;
  children: (isEditing: boolean) => React.ReactNode;
  onSave: () => Promise<void>;
  canEdit?: boolean;
}

export default function EditableCard({
  title,
  children,
  onSave,
  canEdit = true,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave();
      setIsEditing(false);

      setToast({
        show: true,
        message: "با موفقیت ذخیره شد",
        type: "success",
      });
    } catch (err: any) {
      setToast({
        show: true,
        message: err?.message || "خطا در ذخیره اطلاعات",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-gray-950 border rounded-2xl p-6 shadow-sm transition ${isEditing ? "border-blue-600" : "border-gray-800"
        }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-100">{title}</h2>

        {canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-500 hover:text-blue-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415" /><path d="M16 5l3 3" /></svg>
          </button>
        )}
      </div>

      {children(isEditing)}

      {isEditing && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm"
          >
            {loading ? "در حال ذخیره..." : "ذخیره"}
          </button>

          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm"
          >
            انصراف
          </button>
        </div>
      )}

      <Toast
        {...toast}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
