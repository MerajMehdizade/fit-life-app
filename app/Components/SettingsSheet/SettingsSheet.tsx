"use client";

import Link from "next/link";

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
}: {
  openSheet: SheetKey | null;
  sheets: Record<SheetKey, SheetItem[]>;
  setOpenSheet: (key: SheetKey | null) => void;
  logout: () => void;
  isActive: (url?: string) => boolean;
}) {
  if (!openSheet) return null;

  return (
    <div className="fixed inset-0 z-40 transition-all duration-300 pointer-events-auto">
      <div
        onClick={() => setOpenSheet(null)}
        className="absolute inset-0 bg-black/40 transition-opacity duration-300 opacity-100"
      />
      <div className="absolute bottom-0 inset-x-0 bg-gray-800 rounded-t-2xl p-4 transform transition-transform duration-300 ease-out text-white max-h-[90vh] overflow-y-auto translate-y-0">
        <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-4" />
        <ul className="space-y-3">
          {sheets[openSheet].map((item, i) =>
            item.action === "logout" ? (
              <li key={i} className="text-xs">
                <button
                  onClick={() => {
                    logout();
                    setOpenSheet(null);
                  }}
                  className="w-full text-center p-3 rounded-xl text-white bg-red-500 active:bg-red-100 font-medium"
                >
                  {item.title}
                </button>
              </li>
            ) : (
              <li key={i}>
                <Link
                  href={item.url!}
                  onClick={() => setOpenSheet(null)}
                  className={`block p-3 rounded-xl text-sm font-medium ${
                    isActive(item.url) ? "bg-gray-500 text-white" : "bg-gray-700 text-white"
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
