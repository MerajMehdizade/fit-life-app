"use client";

import { useEffect, useState, useRef } from "react";
import Toast from "@/app/Components/toast/Toast";

type UserItem = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function SendNotificationPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // بارگذاری کاربران
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch("/api/admin/users?page=1&limit=100", { credentials: "include" });
        const json = await res.json();
        const userList = Array.isArray(json.data) ? json.data : [];
        setUsers(userList);
        setFilteredUsers(userList);
      } catch (err) {
        console.error(err);
      }
    };
    loadUsers();
  }, []);

  // فیلتر کاربران با سرچ و رول
  useEffect(() => {
    let list = users;
    if (roleFilter) list = list.filter(u => u.role === roleFilter);
    if (search) list = list.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(list);
  }, [search, users, roleFilter]);

  // انتخاب/حذف کاربر
  const toggleUser = (user: UserItem) => {
    setSelectedUsers(prev => {
      if (prev.find(u => u._id === user._id)) {
        setSelectAll(false);
        return prev.filter(u => u._id !== user._id);
      } else {
        const newSelection = [...prev, user];
        if (newSelection.length === users.length) setSelectAll(true);
        return newSelection;
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
      setSelectAll(false);
    } else {
      setSelectedUsers([...users]);
      setSelectAll(true);
    }
  };

  // ارسال اعلان
  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!selectedUsers.length && !selectAll) || !title || !message) {
      setToast({ show: true, message: "همه فیلدها الزامی است", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const targets = selectAll ? users : selectedUsers;
      const promises = targets.map(user =>
        fetch("/api/notifications/send", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, title, message }),
        })
      );
      await Promise.all(promises);

      setToast({ show: true, message: "پیام‌ها ارسال شدند ✅", type: "success" });
      setTitle("");
      setMessage("");
      setSelectedUsers([]);
      setSelectAll(false);
      setSearch("");
      setRoleFilter("");
      setDropdownOpen(false);
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "خطا در ارسال پیام", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center justify-center px-6 mx-auto">

        <form onSubmit={sendNotification} className="w-full max-w-md space-y-3">
          <h1 className="text-white text-2xl text-center mb-10">ارسال اعلان به کاربر</h1>

          {/* انتخاب همه */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
            />
            <label className="text-white">ارسال به همه کاربران</label>
          </div>

          {/* Dropdown کاربران */}
          {!selectAll && (
            <div className="relative" ref={dropdownRef}>
              <div
                className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white cursor-pointer flex justify-between items-center"
                onClick={() => setDropdownOpen(prev => !prev)}
              >
                {selectedUsers.length ? `${selectedUsers.length} کاربر انتخاب شده` : "انتخاب کاربران..."}
                <span>{dropdownOpen ? "▲" : "▼"}</span>
              </div>

              {dropdownOpen && (
                <div className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-gray-800 rounded-lg border border-gray-700 p-2">
                  {/* فیلتر رول */}
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full p-2 mb-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none"
                  >
                    <option value="">همه نقش‌ها</option>
                    <option value="admin">ادمین</option>
                    <option value="coach">مربی</option>
                    <option value="student">دانشجو</option>
                  </select>

                  {/* جستجو */}
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="جستجوی کاربر..."
                    className="w-full p-2 mb-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none"
                  />

                  {/* لیست کاربران */}
                  {filteredUsers.length === 0 ? (
                    <p className="p-2 text-gray-400">موردی پیدا نشد</p>
                  ) : (
                    filteredUsers.map(u => (
                      <label
                        key={u._id}
                        className={`flex justify-between items-center p-2 cursor-pointer hover:bg-gray-700 ${selectedUsers.find(su => su._id === u._id) ? "bg-gray-700" : ""
                          }`}
                      >
                        <span>{u.name} ({u.role})</span>
                        <input
                          type="checkbox"
                          checked={!!selectedUsers.find(su => su._id === u._id)}
                          onChange={() => toggleUser(u)}
                          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* نمایش انتخاب‌ها */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(u => (
                <span key={u._id} className="bg-blue-600 px-2 py-1 rounded-full flex items-center gap-1 text-white">
                  {u.name}
                  <button type="button" onClick={() => toggleUser(u)} className="ml-1 text-xs hover:text-gray-300">✕</button>
                </span>
              ))}
            </div>
          )}

          {/* عنوان */}
          <input
            type="text"
            placeholder="عنوان اعلان"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 bg-gray-800 text-white"
            required
          />

          {/* پیام */}
          <textarea
            rows={4}
            placeholder="متن پیام"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 bg-gray-800 text-white"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition"
          >
            {loading ? "در حال ارسال..." : "ارسال اعلان"}
          </button>
        </form>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </section>
  );
}
