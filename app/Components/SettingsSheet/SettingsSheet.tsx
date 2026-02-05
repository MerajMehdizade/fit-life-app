"use client";

import Link from "next/link";
import { useState } from "react";

type SheetKey = "settings";

type SheetItem = {
  title: string;
  url?: string;
  action?: "logout";
  danger?: boolean;
};

export default function SettingsSheet({
  openSheet,
  sheets,
  setOpenSheet,
  logout,
  isActive,
  onSheetOpen,
}: {
  openSheet: SheetKey | null;
  sheets: Record<SheetKey, SheetItem[]>;
  setOpenSheet: (key: SheetKey | null) => void;
  logout: () => void;
  isActive: (url?: string) => boolean;
  onSheetOpen?: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);

  if (!openSheet) {
    onSheetOpen?.(false);
    return null;
  }

  onSheetOpen?.(true);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
      setOpenSheet(null);
    }
  };

  return (
    <div className="fixed inset-0 z-60 pointer-events-auto">
      {/* پس‌زمینه تار */}
      <div
        onClick={() => setOpenSheet(null)}
        className="absolute inset-0 bg-black/40 transition-opacity duration-300 opacity-100"
      />

      {/* Bottom Sheet */}
      <div className="absolute bottom-4 inset-x-4 bg-gray-800/90 backdrop-blur-md rounded-3xl p-4 max-h-[80vh] overflow-y-auto transform transition-transform duration-300 ease-out animate-sheet-up text-white">
        <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-4" />

        <ul className="space-y-3">
          {sheets[openSheet].map((item, i) =>
            item.action === "logout" ? (
              <li key={i}>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full text-center p-3 rounded-xl bg-red-600 font-medium text-white flex justify-center items-center gap-2 transition-colors duration-200 hover:bg-red-500 disabled:opacity-70"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  {!loading && item.title}
                </button>
              </li>
            ) : (
              <li key={i}>
                <Link
                  href={item.url!}
                  onClick={() => setOpenSheet(null)}
                  className={`block p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(item.url)
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
