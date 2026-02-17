"use client";

import { useRouter } from "next/navigation";
import AvatarNavItem from "@/app/dashboard/student/_Components/AvatarNavItem";
import { RefObject } from "react";
import Image from "next/image";
import { useUser } from "@/app/context/UserContext";

interface Props {
  avatarSrc: string;
  avatarRef: RefObject<HTMLDivElement | null>;
}

export default function DashboardHeader({ avatarSrc, avatarRef }: Props) {
  const router = useRouter();
  const { user } = useUser();

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-gray-900 bg-gray-950">
      <Image
        src="/logo.png"
        alt="logo"
        width={32}
        height={32}
        className=" cursor-pointer"
        onClick={() => router.push("/dashboard/student")}
      />

      <div
        ref={avatarRef}
        onClick={() => router.push("/dashboard/student/profile")}
        className="flex items-center gap-3 px-2 py-1.5 rounded-xl 
             cursor-pointer group 
             hover:bg-gray-900 transition"
      >
        <span className="text-sm font-medium text-gray-300 
                   group-hover:text-white transition 
                   truncate max-w-[140px]">
          {user?.name}
        </span>
        <AvatarNavItem avatarSrc={avatarSrc} />
      </div>


    </header>
  );
}
