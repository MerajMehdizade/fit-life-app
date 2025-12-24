"use client";

import MobileNavItem from "../MobileNavItem/MobileNavItem";
import { MobileNavItemType } from "../MobileNavItem/MobileNavItem";

export default function BottomNav({
    items,
    isActive,
    handleNavClick,
}: {
    items: MobileNavItemType[];
    isActive: (url?: string) => boolean;
    handleNavClick: (item: MobileNavItemType) => void;
}) {
    return (
        <nav className="fixed bottom-0 inset-x-0 bg-gray-800 border-t border-gray-950 shadow-lg rounded-t-xl z-30">
            <ul className="flex justify-around items-center h-16">
                {items.map((item) => (
                    <MobileNavItem
                        key={item.key}
                        item={item}
                        isActive={isActive}
                        onClick={() => handleNavClick(item)}
                    />
                ))}
            </ul>
        </nav>
    );
}
