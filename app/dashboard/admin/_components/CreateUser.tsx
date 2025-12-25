"use client";

import { Button } from "@/app/Components/Form/Button";
import { Form } from "@/app/Components/Form/Form";
import { Input } from "@/app/Components/Form/Input";
import { PasswordInput } from "@/app/Components/Form/PasswordInput";
import Toast from "@/app/Components/toast/Toast";
import { useState } from "react";
import Loading from "@/app/Components/LoadingSpin/Loading";
type Props = {
    role?: string;
};
export default function CreateUser({ role }: Props) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: role,
    });
    let roleTitle = ""
    if (form.role === 'admin') {
        roleTitle = "ادمین"
    } else if (form.role === 'student') {
        roleTitle = "دانشجو"
    } else {
        roleTitle = "مربی"
    }
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "error",
    });

    const submit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            setToast({
                show: true,
                message: res.ok
                    ? "با موفقیت ساخته شد"
                    : data.message || "خطایی رخ داد",
                type: res.ok ? "success" : "error",
            });
        } catch (err) {
            setToast({
                show: true,
                message: "خطا در ارتباط با سرور",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
        if (form.role === 'coach') {
            window.location.href = `/dashboard/admin/${form.role}es/list`;
        } else {
            window.location.href = `/dashboard/admin/${form.role}s/list`;
        }
    };
    if (loading) return <Loading />
    return (
        <>

            <section className="bg-white dark:bg-gray-900">
                <div className="container flex items-center justify-center px-6 mx-auto ">
                    <Form onSubmit={submit}>
                        <h1 className="text-white text-2xl text-center mb-10">
                            افزودن {roleTitle}
                        </h1>
                        <Input
                            type="text"
                            placeholder={`نام ${roleTitle}`}
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            required
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
                                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                            }
                        />
                        <Input
                            type="email"
                            placeholder="ایمیل"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            required
                            className="px-11"
                            rightIcon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            }
                        />
                        <PasswordInput
                            placeholder="رمز عبور"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            required
                        />
                        <div className="mt-6 text-center">
                            <Button type="submit" disabled={loading}>
                                {loading ? "در حال ساخت..." : `ثبت ${roleTitle}`}
                            </Button>
                        </div>
                    </Form>
                </div>
                <Toast
                    show={toast.show}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            </section>
        </>
    );
}
