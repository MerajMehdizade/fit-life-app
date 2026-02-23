"use client";

import { useEffect, useState, useRef } from "react";
import RealtimeListener from "@/app/Components/RealtimeListener/RealtimeListener";
import { useUser } from "@/app/context/UserContext";
import Loading from "@/app/Components/LoadingSpin/Loading";

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

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "چند ثانیه پیش";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "دیروز";
  if (days < 7) return `${days} روز پیش`;
  return date.toLocaleDateString("fa-IR");
}

export default function UserNotifications() {
  const { user, loading: userLoading } = useUser();
  const [notifications, setNotifications] = useState<Notify[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();
        setNotifications(data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    loadNotifications();
  }, []);

  if (userLoading || pageLoading || !user) return <Loading />;

  const enableSound = () => {
    if (!audioRef.current)
      audioRef.current = new Audio("/sound/notify.mp3");
    audioRef.current.volume = 0.6;
    setSoundEnabled(true);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  async function markAsRead(id: string) {
    await fetch(`/api/notifications/read/${id}`, {
      method: "PATCH",
      credentials: "include",
    });
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
    );
  }

  async function markAllAsRead() {
    await fetch(`/api/notifications/read-all`, {
      method: "PATCH",
      credentials: "include",
    });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }

  async function deleteNotification(id: string) {
    await fetch(`/api/notifications/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setNotifications(prev => prev.filter(n => n._id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 space-y-5">
      {user?.id ? (
        <RealtimeListener
          userId={user.id}
          onNewNotification={notif => {
            setNotifications(prev => [notif, ...prev]);
            if (audioRef.current && soundEnabled) {
              audioRef.current.play().catch(() => { });
            }
          }}
          onReadNotification={id => {
            setNotifications(prev =>
              prev.map(n =>
                n._id === id ? { ...n, isRead: true } : n
              )
            );
          }}
        />
      ) : <div className="p-4 space-y-3">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-24 bg-gray-800 rounded-xl animate-pulse"
          />
        ))}
      </div>}

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">اعلان‌ها</h1>
        {unreadCount > 0 && (
          <p className="text-sm text-gray-400">
            {unreadCount} اعلان خوانده‌نشده دارید
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-between items-center">
        <button
          onClick={enableSound}
          disabled={soundEnabled}
          className="text-xs underline text-gray-400 disabled:opacity-50"
        >
          {soundEnabled ? "🔊 فعال" : "فعال‌سازی صدا"}
        </button>

        <div className="flex gap-2">
          {["all", "unread", "read"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 rounded-full text-xs transition
              ${filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400"
                }`}
            >
              {f === "all" && "همه"}
              {f === "unread" && "خوانده‌نشده"}
              {f === "read" && "خوانده‌شده"}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="w-full sm:w-auto py-2 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            علامت‌گذاری همه به‌عنوان خوانده‌شده
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          📭 اعلانی وجود ندارد
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => (
            <div
              key={n._id}
              className={`relative rounded-xl p-4 border transition
              ${n.isRead
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-850 border-blue-500/40"
                }`}
            >
              {!n.isRead && (
                <span className="absolute right-0 top-0 h-full w-1 bg-blue-500 rounded-r-xl" />
              )}

              <div className="space-y-1">
                <h3 className="font-semibold text-sm">{n.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {n.message}
                </p>

                {n.meta?.actorName && (
                  <p className="text-[11px] text-gray-500">
                    توسط {n.meta.actorName}{" "}
                    {n.meta.action && `(${n.meta.action})`}
                  </p>
                )}

                <p className="text-[11px] text-gray-500 pt-1">
                  {timeAgo(n.createdAt)}
                </p>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="absolute top-2 left-2 text-blue-400 text-xs"
                >
                  خوانده شد
                </button>
              )}

              <button
                onClick={() => deleteNotification(n._id)}
                className="absolute bottom-2 left-2 text-red-400 text-xs hover:text-red-300"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
