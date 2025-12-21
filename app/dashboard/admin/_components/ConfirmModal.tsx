"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function ConfirmModal({ open, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(open);

  // برای انیمیشن خروج
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
        open ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-gray-900 rounded-xl p-6 w-full max-w-sm border border-gray-700 transform transition-all duration-200 ${
          open ? "scale-100 translate-y-0" : "scale-95 translate-y-2"
        }`}
      >
        <h3 className="text-lg font-semibold text-white mb-3">
          حذف آیتم
        </h3>

        <p className="text-sm text-gray-400 mb-6">
          آیا از حذف این مورد مطمئن هستید؟ این عملیات قابل بازگشت نیست.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50"
          >
            انصراف
          </button>

          <button
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              setLoading(false);
            }}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
