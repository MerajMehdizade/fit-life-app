"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { useUser } from "@/app/context/UserContext";
import Toast from "@/app/Components/toast/Toast";
import BottomNav from "@/app/Components/BottomNav/BottomNav";
import { MobileNavItemType } from "@/app/Components/MobileNavItem/MobileNavItem";
import NotificationBadge from "@/app/Components/NotificationBadge/NotificationBadge";
import SettingsSheet from "@/app/Components/SettingsSheet/SettingsSheet";
import AvatarNavItem from "./AvatarNavItem";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/app/Components/LoadingSpin/Loading";



type SheetKey = "settings";

export default function StudentShell({ children }: { children: ReactNode }) {
    const { user, logout, loading } = useUser();
    const router = useRouter();
    const [openSheet, setOpenSheet] = useState<SheetKey | null>(null);
    const [avatarMenu, setAvatarMenu] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(user?.avatar || "/avatars/default.png");
    const avatarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isActive = (url?: string) => url ? pathname === url : false;
    const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);
    useEffect(() => {
        if (!user) return;
        setAvatarSrc(user.avatar || "/avatars/default.png");
    }, [user]);

    useEffect(() => {
        function handleClickOutside(e: any) {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setAvatarMenu(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleNavClick = (item: MobileNavItemType) => {
        if (item.url) {
            router.push(item.url);
        } else if (item.key === "profile") {
            setOpenSheet("settings");
        }
    };
    if (loading) {
        return <Loading />
    }
    const navItems: MobileNavItemType[] = [
        {
            key: "notifications",
            title: "اعلان‌ها",
            url: "/dashboard/student/notifications",
            badge: <NotificationBadge />,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /></svg>
            ),
        },
        {
            key: "coaches",
            title: "جستجو مربی",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h1.5" /><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>
            ),
        },
        {
            key: "admins",
            title: "داشبورد",
            url: "/dashboard/student",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1" /><path d="M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1" /><path d="M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1" /><path d="M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1" /></svg>
            ),
        },
        {
            key: "students",
            title: "مدیریت برنامه",
            url: "/dashboard/student/program",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4m0 1a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z" /><path d="M4 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 12l6 0" /><path d="M14 16l6 0" /><path d="M14 20l6 0" /></svg>
            ),
        },
        {
            key: "avatar",
            title: "پروفایل",
            icon: <AvatarNavItem avatarSrc={avatarSrc} avatarRef={avatarRef} onClick={() => setOpenSheet("settings")} />,
        },
    ];

    return (
        <div className="bg-gray-900 min-h-screen text-white pb-20">
            <SettingsSheet
                openSheet={openSheet}
                setOpenSheet={setOpenSheet}
                logout={logout}
                isActive={isActive}
                sheets={{
                    settings: [
                        { title: "حساب کاربری", url: "/dashboard/student/profile" },
                        { title: "خروج", action: "logout", danger: true },
                    ],
                }}
            />

            <BottomNav items={navItems} isActive={isActive} handleNavClick={handleNavClick} />

            <main>{children}</main>

            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
}
