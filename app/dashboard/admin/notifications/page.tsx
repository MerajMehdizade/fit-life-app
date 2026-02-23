"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import RealtimeListener from "@/app/Components/RealtimeListener/RealtimeListener";
import Link from "next/link";

/* ================= utils ================= */

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

/* ================= types ================= */

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

/* ================= page ================= */

export default function NotificationsPage() {
  const { user, loading: userLoading } = useUser();

  const [notifications, setNotifications] = useState<Notify[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  /* sound */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const enableSound = () => {
    if (!audioRef.current) audioRef.current = new Audio("/sound/notify.mp3");
    audioRef.current
      .play()
      .then(() => {
        audioRef.current!.pause();
        audioRef.current!.currentTime = 0;
        setSoundEnabled(true);
      })
      .catch(() => { });
  };

  /* load */
  async function load() {
    setLoading(true);
    const res = await fetch("/api/notifications", {
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    setNotifications(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (!userLoading && user) load();
  }, [userLoading, user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  if (userLoading || loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <RealtimeListener
        userId={user!.id!}
        onNewNotification={(notif) => {
          setNotifications(prev => [notif, ...prev]);
          if (audioRef.current && soundEnabled) {
            audioRef.current.play().catch(() => { });
          }
        }}
        onReadNotification={(id) => {
          setNotifications(prev =>
            prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
          );
        }}
      />

      <div className="min-h-screen bg-gray-950 text-gray-100 p-4 space-y-5">

        {/* header */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold">اعلان‌ها</h1>

          {unreadCount > 0 && (
            <p className="text-sm text-gray-400">
              {unreadCount} اعلان خوانده‌نشده دارید
            </p>
          )}
        </div>

        {/* actions */}
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={enableSound}
              disabled={soundEnabled}
              className="text-xs underline text-gray-400 disabled:opacity-50"
            >
              {soundEnabled ? "🔊 فعال" : "فعال‌سازی صدا"}
            </button>

            <Link
              href="/dashboard/admin/notifications/send"
              className="text-xs bg-blue-600 px-3 py-1 rounded"
            >
              ارسال
            </Link>
          </div>
          <div className="flex gap-2">
            {["all", "unread", "read"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 rounded-full text-xs transition
                  ${filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400"}`}
              >
                {f === "all" && "همه"}
                {f === "unread" && "خوانده‌نشده"}
                {f === "read" && "خوانده‌شده"}
              </button>
            ))}
          </div>

        </div>

        {/* bulk */}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="w-full py-2 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            علامت‌گذاری همه به‌عنوان خوانده‌شده
          </button>
        )}

        {/* list */}
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            📭 اعلانی وجود ندارد
          </div>
        ) : (
          <div className="space-y-3 mb-10">
            {filtered.map(n => (
              <div
                key={n._id}
                className={`relative rounded-xl p-4 border transition
                  ${n.isRead
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-850 border-blue-500/40"}`}
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
                      توسط {n.meta.actorName}
                      {n.meta.action && ` (${n.meta.action})`}
                    </p>
                  )}

                  <p className="text-[11px] text-gray-500 pt-1">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>

                {/* actions */}
                <div className="mt-3 flex gap-3 text-xs">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="text-blue-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>


                    </button>
                  )}

                  <button
                    onClick={() => deleteNotif(n._id)}
                    className="text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9
       m9.968-3.21c.342.052.682.107 1.022.166
       m-1.022-.165L18.16 19.673
       a2.25 2.25 0 0 1-2.244 2.077H8.084
       a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79
       m14.456 0a48.108 48.108 0 0 0-3.478-.397
       m-12 .562c.34-.059.68-.114 1.022-.165
       m0 0a48.11 48.11 0 0 1 3.478-.397
       m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201
       a51.964 51.964 0 0 0-3.32 0
       c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                    </svg>

                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  /* ================= actions ================= */

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

  async function deleteNotif(id: string) {
    await fetch(`/api/notifications/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setNotifications(prev => prev.filter(n => n._id !== id));
  }
}
