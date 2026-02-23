"use client";

import { useEffect, useState } from "react";
import EditableCard from "./EditableCard";
import { getLabel } from "@/lib/labels";
import {
  ProfileType,
  UserStatus,
  UserRole,
} from "@/app/context/UserContext";

interface Props {
  user: ProfileType;
  avatarSrc?: string;
  onChangeAvatar: () => void;
  onDeleteAvatar: () => void;
  onHandleLogOut: () => void;
  onUserUpdate?: (data: ProfileType) => void;
}


export default function ProfileAccountCard({
  user,
  avatarSrc,
  onChangeAvatar,
  onDeleteAvatar,
  onHandleLogOut,
  onUserUpdate,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);


  const statusStyles: Record<UserStatus, string> = {
    active: "bg-green-600",
    suspended: "bg-red-600",
  };

  const roleStyles: Record<UserRole, string> = {
    student: "bg-blue-600",
    coach: "bg-purple-600",
    admin: "bg-gray-700",
  };

  const resolvedAvatar =
    avatarSrc || user.avatar || "/avatars/default.png";

  const handleSave = async () => {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: form.name,
        email: form.email,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error();

    onUserUpdate?.(data.user);
  };

  return (
    <EditableCard title="اطلاعات حساب" onSave={handleSave}>
      {(isEditing) => (
        <div className="space-y-8">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-5">
              <img
                src={resolvedAvatar}
                alt={user.name || "avatar"}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-600"
              />

              <div className="w-64">
                {isEditing ? (
                  <>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full mb-2"
                    />

                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full"
                    />
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-100">
                      {user.name || "بدون نام"}
                    </h1>
                    <p className="text-gray-400">
                      {user.email || "خالی"}
                    </p>
                  </>
                )}

                <div className="flex gap-2 mt-2">
                  {user.role && roleStyles[user.role] && (
                    <span
                      className={`px-3 py-1 text-xs rounded-full text-white ${roleStyles[user.role]}`}
                    >
                      {getLabel(user.role)}
                    </span>
                  )}

                  {user.status && statusStyles[user.status] && (
                    <span
                      className={`px-3 py-1 text-xs rounded-full text-white ${statusStyles[user.status]}`}
                    >
                      {getLabel(user.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-around gap-5 text-center">

              <InfoItem
                label="سطح انگیزه"
                value={
                  user.profile?.motivationLevel !== undefined
                    ? `${user.profile.motivationLevel} از 10`
                    : null
                }
              />

              <InfoItem
                label="اعتماد به نفس"
                value={
                  user.profile?.confidenceLevel !== undefined
                    ? `${user.profile.confidenceLevel} از 10`
                    : null
                }
              />

              {user.role === "student" && (
                <InfoItem
                  label="مربی اختصاصی"
                  value={user.assignedCoach ? "دارد" : "ندارد"}
                />
              )}

              {user.role === "coach" && (
                <InfoItem
                  label="تعداد شاگردان"
                  value={user.students?.length || 0}
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onChangeAvatar}
              className="px-2 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-photo-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8h.01" /><path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" /><path d="M14 14l1 -1c.67 -.644 1.45 -.824 2.182 -.54" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
            </button>

            {resolvedAvatar !== "/avatars/default.png" && (
              <button
                onClick={onDeleteAvatar}
                className="px-2 py-1 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-photo-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8h.01" /><path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v9" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l2 2" /><path d="M16 19h6" /></svg>
              </button>
            )}

            <button
              onClick={onHandleLogOut}
              className="px-2 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-logout-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" /><path d="M15 12h-12l3 -3" /><path d="M6 15l-3 -3" /></svg>
            </button>
          </div>

          {/* INFO GRID */}

        </div>
      )}
    </EditableCard>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  if (value === null || value === undefined) return null;

  return (
    <div>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="text-gray-300 font-medium">{value}</div>
    </div>
  );
}
