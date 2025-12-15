"use client";

import { useEffect, useRef, useState } from "react";
import RealtimeListener from "@/app/Components/RealtimeListener/RealtimeListener";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";

type Notify = {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  meta?: {
    actorName?: string;
    action?: string;
  };
};

export default function NotificationsPage() {
  const { user, loading: userLoading } = useUser();

  const [notifications, setNotifications] = useState<Notify[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔊 sound
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const enableSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/public/sound/notify.mp3");
    }

    audioRef.current
      .play()
      .then(() => {
        audioRef.current!.pause();
        audioRef.current!.currentTime = 0;
        setSoundEnabled(true);
      })
      .catch(() => {});
  };

  // 📥 load notifications
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notifications", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setNotifications(data ?? []);
      } else {
        setError("خطا در بارگذاری اعلان‌ها");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userLoading && user) {
      load();
    }
  }, [userLoading, user]);

  if (userLoading || loading) return <p>در حال بارگذاری...</p>;
  if (!user) return <p>لطفاً دوباره وارد شوید</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {/* realtime */}
      <RealtimeListener
        userId={user.id!}
        onNewNotification={(notif) => {
          setNotifications((prev) => [notif, ...prev]);

          if (audioRef.current && soundEnabled) {
            audioRef.current.play().catch(() => {});
          }
        }}
        onReadNotification={(id) => {
          setNotifications((prev) =>
            prev.map((n) =>
              n._id === id ? { ...n, isRead: true } : n
            )
          );
        }}
      />

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">نوتیفیکیشن‌ها</h1>

          <div className="flex gap-4 items-center">
            <Link
              href="/dashboard/admin/notifications/send"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ➕ ارسال پیام
            </Link>

            <button
              onClick={enableSound}
              disabled={soundEnabled}
              className="text-sm text-gray-500 underline disabled:opacity-50"
            >
              {soundEnabled
                ? "🔊 صدای اعلان فعال شد"
                : "فعال‌سازی صدای اعلان"}
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <p>هیچ اعلانی وجود ندارد</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
              className={`border p-4 rounded-lg shadow-sm flex justify-between items-center transition ${
                item.isRead ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.message}</p>

                {item.meta?.actorName && (
                  <p className="text-xs text-gray-400 mt-1">
                    توسط {item.meta.actorName}
                    {item.meta.action && ` (${item.meta.action})`}
                  </p>
                )}
              </div>

              {item.isRead ? (
                <button
                  onClick={() => deleteNotif(item._id)}
                  className="text-red-600 hover:text-red-800 text-sm ml-3"
                >
                  حذف
                </button>
              ) : (
                <button
                  onClick={() => markAsRead(item._id)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  خوانده شد
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );

  async function deleteNotif(id: string) {
    await fetch(`/api/notifications/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  }

  async function markAsRead(id: string) {
    await fetch(`/api/notifications/read/${id}`, {
      method: "PATCH",
      credentials: "include",
    });

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  }
}
