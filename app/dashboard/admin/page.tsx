"use client";
import { useUser } from "@/app/context/UserContext";
import SocketWrapper from "./_components/SocketWrapper";
export default function AdminPage() {
  const { user } = useUser();
  const userId =
    (user as any)?._id?.toString() ||
    (user as any)?.user?._id?.toString() ||
    null;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{user?.name} عزیز خوش آمدید به داشبورد ادمین</h1>
       {userId && <SocketWrapper userId={userId} />}
      <p className="text-gray-700 mb-4">
        از اینجا می‌تونید کاربران و مربی‌ها را مدیریت کنید.
      </p>
    </div>
  );
}
