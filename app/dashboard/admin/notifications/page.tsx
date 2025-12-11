"use client";

import { useEffect, useState } from "react";
import RealtimeListener from "@/app/Components/SocketClient/RealtimeListener";

type Notify = {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notify[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/notifications", { credentials: "include" });
    const data = await res.json();
    setNotifications(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

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

  if (loading) return <p>در حال بارگذاری...</p>;

  return (
    <>
      <RealtimeListener
        userId={userId}
        onNewNotification={(notif) => {
          setNotifications((prev) => [notif, ...prev]);
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
        <h1 className="text-xl font-semibold mb-4">نوتیفیکیشن‌ها</h1>

        {notifications.map((item) => (
          <div
            key={item._id}
            className={`border p-4 rounded-lg shadow-sm flex justify-between items-center transition ${
              item.isRead ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.message}</p>
            </div>

            {item.isRead ? (
              <button
                type="button"
                onClick={() => deleteNotif(item._id)}
                className="text-red-600 hover:text-red-800 text-sm ml-3"
              >
                حذف
              </button>
            ) : (
              <button
                type="button"
                onClick={() => markAsRead(item._id)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                خوانده شد
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
