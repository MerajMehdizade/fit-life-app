"use client";

import { useEffect, useState } from "react";

type UserItem = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function SendNotificationPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 👇 گرفتن لیست کاربران
  useEffect(() => {
    const loadUsers = async () => {
      const res = await fetch(
        "/api/admin/users?page=1&limit=50",
        { credentials: "include" }
      );
      const json = await res.json();
      setUsers(Array.isArray(json.data) ? json.data : []);
    };

    loadUsers();
  }, []);

  // 👇 ارسال پیام
  const sendNotification = async () => {
    if (!selectedUser || !title || !message) {
      alert("همه فیلدها الزامی است");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/notifications/send", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: selectedUser,
        title,
        message,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("پیام ارسال شد ✅");
      setTitle("");
      setMessage("");
      setSelectedUser("");
    } else {
      alert("خطا در ارسال پیام");
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-bold">ارسال اعلان به کاربر</h1>

      {/* انتخاب کاربر */}
      <select
        className="w-full border p-2 rounded"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">انتخاب کاربر</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name} ({u.role})
          </option>
        ))}
      </select>

      {/* عنوان */}
      <input
        className="w-full border p-2 rounded"
        placeholder="عنوان اعلان"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* متن پیام */}
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        placeholder="متن پیام"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={sendNotification}
        disabled={loading}
        className="bg-pink-600 text-white px-4 py-2 rounded"
      >
        {loading ? "در حال ارسال..." : "ارسال پیام"}
      </button>
    </div>
  );
}
