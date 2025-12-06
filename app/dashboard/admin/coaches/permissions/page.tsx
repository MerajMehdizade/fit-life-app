"use client";

import { useEffect, useState } from "react";

interface Coach {
  _id: string;
  name: string;
  email: string;
  permissions: string[];
}

const PERMISSION_LIST = [
  { key: "manage_students", label: "مدیریت دانشجوها" },
  { key: "edit_plans", label: "ویرایش برنامه‌ها" },
  { key: "view_reports", label: "مشاهده گزارش‌ها" },
];

export default function CoachPermissionsPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/coaches/permissions", {
        credentials: "include",
      });

      const data = await res.json();
      setCoaches(data);
    } catch (err) {
      console.error("Error loading coach permissions:", err);
    }

    setLoading(false);
  };

  const togglePermission = async (coachId: string, permKey: string) => {
    setCoaches((prev) =>
      prev.map((coach) => {
        if (coach._id !== coachId) return coach;

        const hasPermission = coach.permissions.includes(permKey);

        return {
          ...coach,
          permissions: hasPermission
            ? coach.permissions.filter((p: string) => p !== permKey)
            : [...coach.permissions, permKey],
        };
      })
    );

    const updatedCoach = coaches.find((c) => c._id === coachId);
    if (!updatedCoach) return;

    try {
      await fetch(`/api/admin/coaches/permissions/${coachId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permissions: updatedCoach.permissions,
        }),
      });
    } catch (err) {
      console.error("Error saving permissions:", err);
    }
  };

  if (loading)
    return <p className="p-5">در حال بارگذاری اطلاعات مربیان...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6 font-bold text-black">دسترسی‌های مربیان</h1>

      <div className="overflow-auto rounded-lg border border-gray-700">
        <table className="w-full text-right">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3">مربی</th>
              <th className="p-3">ایمیل</th>
              {PERMISSION_LIST.map((perm) => (
                <th key={perm.key} className="p-3">
                  {perm.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {coaches.map((coach) => (
              <tr key={coach._id} className="border-t border-gray-700">
                <td className="p-3">{coach.name}</td>
                <td className="p-3">{coach.email}</td>

                {PERMISSION_LIST.map((perm) => {
                  const has = coach.permissions.includes(perm.key);
                  return (
                    <td key={perm.key} className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={has}
                        onChange={() => togglePermission(coach._id, perm.key)}
                        className="h-5 w-5 cursor-pointer"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
