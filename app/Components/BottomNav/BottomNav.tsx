"use client";

import MobileNavItem from "../MobileNavItem/MobileNavItem";
import { MobileNavItemType } from "../MobileNavItem/MobileNavItem";

export default function BottomNav({
    items,
    isActive,
    handleNavClick,
    shiftUp = false,
}: {
    items: MobileNavItemType[];
    isActive: (url?: string) => boolean;
    handleNavClick: (item: MobileNavItemType) => void;
    shiftUp?: boolean;
}) {
    return (
       <nav className={`fixed bottom-4 inset-x-4 bg-gray-800/90 rounded-3xl z-50 transition-transform duration-300
  ${shiftUp ? "translate-y-[-60px]" : "translate-y-0"}`}>

  {/* محتوا نوار */}
  <ul className="flex justify-around items-center h-17 relative z-10">
    {items.map((item) => (
      <MobileNavItem
        key={item.key}
        item={item}
        isActive={isActive}
        onClick={() => handleNavClick(item)}
      />
    ))}
  </ul>

  {/* هاله حرفه‌ای زیر نوار */}
  <div className="absolute -bottom-4 left-0 w-full h-8 rounded-t-3xl pointer-events-none
      bg-black/50 blur-[12px] mix-blend-multiply" />
</nav>

    );
}
