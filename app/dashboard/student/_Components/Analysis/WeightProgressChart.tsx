"use client";

import { useState, useMemo } from "react";
import FormInput from "../../../complete-profile/components/FormInput";
import Toast from "@/app/Components/toast/Toast";
import { useUser } from "@/app/context/UserContext";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
} from "recharts";

const WEIGHT_LIMITS = { min: 30, max: 300 };

export default function WeightProgressChart() {
    const { user, refreshUser } = useUser();
    const [newWeight, setNewWeight] = useState<number | "">("");
    const [toastState, setToastState] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "error",
    });

    const history = useMemo(() => {
        if (!user?.profile?.progressHistory) return [];
        const sorted = [...user.profile.progressHistory].sort(
            (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        return sorted.map((item: any) => {
            const dateObj = new Date(item.date);
            return {
                rawDate: dateObj,
                displayDate: dateObj.toLocaleDateString("fa-IR", {
                    day: "numeric",
                    month: "short",
                }),
                fullDate: dateObj.toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
                weight: Number(item.weight ?? 0),
            };
        });
    }, [user?.profile?.progressHistory]);

    const yDomain = useMemo(() => {
        if (history.length === 0) return [WEIGHT_LIMITS.min, WEIGHT_LIMITS.max];
        const weights = history.map((h) => h.weight);
        const minWeight = Math.min(...weights);
        const maxWeight = Math.max(...weights);

        const margin = 5; // فاصله کوچک بالای نمودار و پایین
        const minY = Math.max(minWeight - margin, WEIGHT_LIMITS.min);
        const maxY = Math.min(maxWeight + margin, WEIGHT_LIMITS.max);

        return [minY, maxY];
    }, [history]);

    const handleUpdateWeight = async () => {
        if (newWeight === "" || newWeight < WEIGHT_LIMITS.min || newWeight > WEIGHT_LIMITS.max) {
            setToastState({
                show: true,
                message: `وزن باید بین ${WEIGHT_LIMITS.min} تا ${WEIGHT_LIMITS.max} باشد`,
                type: "error",
            });
            return;
        }

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentWeight: Number(newWeight) }),
            });
            const data = await res.json();

            if (data.success) {
                setToastState({ show: true, message: "وزن بروزرسانی شد", type: "success" });
                await refreshUser();
                setNewWeight("");
            } else {
                setToastState({ show: true, message: data.message || "خطا در بروزرسانی", type: "error" });
            }
        } catch {
            setToastState({ show: true, message: "خطای سرور", type: "error" });
        }
    };

    const handleResetWeight = async () => {
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resetToInitial: true }),
            });
            const data = await res.json();

            if (data.success) {
                setToastState({ show: true, message: "وزن بازنشانی شد", type: "success" });
                await refreshUser();
                setNewWeight("");
            } else {
                setToastState({ show: true, message: data.message || "خطا در بازنشانی", type: "error" });
            }
        } catch {
            setToastState({ show: true, message: "خطای سرور", type: "error" });
        }
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700">
                    <p className="text-sm font-medium">تاریخ: {data.fullDate}</p>
                    <p className="text-sm font-medium text-green-400">وزن: {data.weight} کیلوگرم</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur px-4 py-5 shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        روند تغییر وزن
                    </h2>
                </div>
                <p className="text-gray-400 text-sm">
                    وزن فعلی:{" "}
                    <span dir="ltr" className="text-green-400">
                        {user?.profile?.currentWeight ?? "-"} Kg
                    </span>
                </p>

                <p className="text-gray-400 text-sm">
                    وزن هدف:{" "}
                    <span dir="ltr" className="text-green-400">
                        {user?.profile?.targetWeight ?? "-"} Kg
                    </span>
                </p>

            </div>

            {/* Chart */}
            <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart key={history.length}
                        data={history}
                        margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                        <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="displayDate"
                            stroke="#9ca3af"
                            tick={{ fill: "#9ca3af", fontSize: 12 }}
                            tickLine={false}
                            interval={Math.ceil(history.length / 5) - 1}
                            height={30}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: "#9ca3af", fontSize: 12 }}
                            axisLine={{ stroke: "#9ca3af" }}
                            tickLine={false}
                            width={50}
                            tickMargin={10}
                            domain={yDomain as [number, number]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="weight"
                            stroke="#22c55e"
                            fill="rgba(34,197,94,0.15)"
                            strokeWidth={3}
                            activeDot={{ r: 6 }}
                            isAnimationActive={true}
                            animationDuration={800}
                        />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            isAnimationActive={true}
                            animationDuration={800}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Weekly Reminder */}
            <p className="text-[12px] text-green-400 mb-4 text-center">
                هر هفته وزن خود را بروزرسانی کنید تا روند پیشرفت مشخص شود.
            </p>

            {/* Update Weight Section */}
            <div className="flex flex-col gap-3 items-center">
                <div className="flex-1 w-full">
                    <FormInput
                        label={`وزن جدید (${WEIGHT_LIMITS.min}-${WEIGHT_LIMITS.max} کیلوگرم)`}
                        type="number"
                        value={newWeight}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") return setNewWeight("");
                            const num = Number(val);
                            if (!isNaN(num)) setNewWeight(num);
                        }}
                        onBlur={() => {
                            if (newWeight === "") return;
                            const clamped = Math.min(Math.max(newWeight as number, WEIGHT_LIMITS.min), WEIGHT_LIMITS.max);
                            setNewWeight(clamped);
                        }}
                    />
                </div>
                <div className="space-x-2.5 flex w-full">
                    <button
                        onClick={handleUpdateWeight}
                        className="px-5 py-3 text-[14px] rounded-2xl bg-green-600 hover:bg-green-500 shadow-md text-white  transition-all duration-200 w-full"
                    >
                        ثبت
                    </button>
                    <button
                        onClick={handleResetWeight}
                        className="px-5 py-3 text-[14px] rounded-2xl bg-red-600 hover:bg-red-500 shadow-md text-white  transition-all duration-200 w-full"
                    >
                        بازنشانی سابقه
                    </button>

                </div>
            </div>

            {/* Toast */}
            <Toast
                show={toastState.show}
                message={toastState.message}
                type={toastState.type}
                onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
            />
        </div>
    );
}