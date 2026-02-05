"use client";

import type { ReactNode, JSX } from "react";

export type MobileNavItemType = {
  key: string;
  title: string;
  icon: JSX.Element;
  url?: string;
  badge?: ReactNode;
};

export default function MobileNavItem({
  item,
  isActive,
  onClick,
}: {
  item: MobileNavItemType;
  isActive: (url?: string) => boolean;
  onClick: () => void;
}) {
  const active = isActive(item.url);

  return (
    <li
      onClick={onClick}
      className={`flex flex-col items-center gap-1 text-xs font-medium w-32 transition-all duration-300 ${
        active
          ? "text-white translate-y-[-3px]"
          : "text-gray-400 hover:text-gray-200"
      }`}
    >
      <div
        className={`relative flex items-center justify-center transition-all duration-300 ${
          active ? "scale-110" : "scale-100"
        }`}
      >
        {item.icon}
        {item.badge && <span className="absolute -top-1 -right-1">{item.badge}</span>}
      </div>
      <span className={`select-none${active ? "font-semibold" : ""}`}>{item.title}</span>
    </li>
  );
}
