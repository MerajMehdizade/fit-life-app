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
  return (
    <li
      onClick={onClick}
      className={`flex flex-col items-center gap-1 text-xs font-medium transition w-32 ${
        isActive(item.url) ? "text-gray-100" : "text-gray-400"
      }`}
    >
      <div className="relative">
        {item.icon}
        {item.badge && <span className="absolute -top-1 -right-1">{item.badge}</span>}
      </div>
      <span>{item.title}</span>
    </li>
  );
}
