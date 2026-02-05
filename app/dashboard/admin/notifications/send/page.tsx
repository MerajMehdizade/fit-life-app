"use client";

import { useEffect, useState, useRef } from "react";
import Toast from "@/app/Components/toast/Toast";
import { Form } from "@/app/Components/Form/Form";
import { Select } from "@/app/Components/Form/Select";
import { Input } from "@/app/Components/Form/Input";
import { Button } from "@/app/Components/Form/Button";
import Loading from "@/app/Components/LoadingSpin/Loading";

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
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // بارگذاری کاربران
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch("/api/admin/users?page=1&limit=100", {
          credentials: "include",
        });
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
    if (roleFilter) list = list.filter((u) => u.role === roleFilter);
    if (search)
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    setFilteredUsers(list);
  }, [search, users, roleFilter]);

  // انتخاب/حذف کاربر
  const toggleUser = (user: UserItem) => {
    setSelectedUsers((prev) => {
      if (prev.find((u) => u._id === user._id)) {
        setSelectAll(false);
        return prev.filter((u) => u._id !== user._id);
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
      const promises = targets.map((user) =>
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
    <section className="bg-white dark:bg-gray-900 w-full p-4 pb-20 sm:p-10 text-gray-100 flex justify-center items-center h-screen md:h-full">
      <div className="container flex items-center justify-center px-6 mx-auto">
        <Form onSubmit={sendNotification} className="w-full max-w-md space-y-4">
          <h1 className="text-white text-2xl text-center mb-10">ارسال اعلان به کاربر</h1>

          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
            <label className="text-white">ارسال به همه کاربران</label>
          </div>

          {!selectAll && (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white cursor-pointer flex justify-between items-center"
              >
                {selectedUsers.length ? `${selectedUsers.length} کاربر انتخاب شده` : "انتخاب کاربران..."}
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {dropdownOpen && (
                <div className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-gray-800 rounded-lg border border-gray-700 p-2 space-y-2">
                  <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} icon={true}>
                    <option value="">همه نقش‌ها</option>
                    <option value="admin">ادمین</option>
                    <option value="coach">مربی</option>
                    <option value="student">دانشجو</option>
                  </Select>

                  <Input
                    placeholder="جستجوی کاربر..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-11"
                    rightIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35m1.6-5.15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                        />
                      </svg>
                    }
                  />

                  {filteredUsers.map((u) => (
                    <label key={u._id} className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-700">
                      <span>{u.name} ({u.role})</span>
                      <input type="checkbox" checked={!!selectedUsers.find((su) => su._id === u._id)} onChange={() => toggleUser(u)} />
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <Input placeholder="عنوان اعلان" value={title} onChange={(e) => setTitle(e.target.value)} className="p-3" />

          <textarea
            rows={4}
            placeholder="متن پیام"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white"
          />

          <div className="text-center">
            <Button type="submit" loading={loading}>
              ارسال اعلان
            </Button>
          </div>
        </Form>
      </div>

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
    </section>
  );
}
