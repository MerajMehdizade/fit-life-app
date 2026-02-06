"use client";

import { useRouter } from "next/navigation";
import AvatarNavItem from "@/app/dashboard/student/_Components/AvatarNavItem";
import { RefObject } from "react";

interface Props {
  avatarSrc: string;
  avatarRef: RefObject<HTMLDivElement | null>;
}

export default function DashboardHeader({ avatarSrc, avatarRef }: Props) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900">
      <img
        src="/logo.png"
        alt="logo"
        className="h-8 cursor-pointer"
        onClick={() => router.push("/dashboard/student")}
      />
      
      <div ref={avatarRef} onClick={() => router.push("/dashboard/student/profile")}>
        <AvatarNavItem avatarSrc={avatarSrc} avatarRef={avatarRef} />
      </div>
    </header>
  );
}
