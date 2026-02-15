"use client";
import { InputHTMLAttributes } from "react";
type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

export default function FormInput({
    label,
    value,
    className = "",
    ...props
}: Props) {
    const hasValue = value !== undefined && value !== null && value !== "";

    return (
        <div className="relative w-full">
            <input
                {...props}
                value={value ?? ""}
                className={`
          peer w-full p-3 pt-5 rounded-2xl bg-gray-800 border
          border-gray-700 text-white text-base
          focus:border-green-500 focus:ring-2 focus:ring-green-500
          outline-none transition-all duration-200
          ${className}
        `}
            />

            <label
                className={`
          absolute right-4 transition-all duration-200 pointer-events-none
          ${hasValue
                        ? "top-2 text-xs text-green-400"
                        : "top-4 text-sm text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-green-400"
                    }
        `}
            >
                {label}
            </label>
        </div>
    );
}
