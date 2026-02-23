"use client";

import { useRouter } from "next/navigation";
import AvatarNavItem from "@/app/dashboard/student/_Components/profile/AvatarNavItem";
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
    <div className="fixed select-none top-0 inset-x-4 bg-gray-950 z-50 transition-transform duration-300">
    <header className=" h-14 flex items-center justify-between px-4 ">
      <Image
        src="/logo.png"
        alt="logo"
        width={110}
        height={110}
        className=" cursor-pointer object-cover"
        onClick={() => router.push("/dashboard/student")}
      />

      <div
        ref={avatarRef}
        onClick={() => router.push("/dashboard/student/profile")}
        className="flex items-center gap-3 px-2 py-1.5 rounded-xl 
             cursor-pointer group 
             hover:bg-gray-950 transition"
      >
        <span className="text-sm font-medium text-gray-300 
                   group-hover:text-white transition 
                   truncate max-w-[140px]">
          {user?.name}
        </span>
        <AvatarNavItem avatarSrc={avatarSrc} />
      </div>
    </header>
    </div >
  );
}
