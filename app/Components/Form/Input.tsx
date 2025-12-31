"use client";

import { InputHTMLAttributes } from "react";

export function Input({
  leftIcon,
  rightIcon,
  wrapperClassName = "",
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}) {
  return (
    <div className={`relative flex items-center w-full ${wrapperClassName}`}>
      {rightIcon && <span className="absolute right-0">{rightIcon}</span>}
      {leftIcon && <span className="absolute left-0">{leftIcon}</span>}

      <input
        {...props}
        className={`block w-full py-3 text-gray-700 bg-white border rounded-lg
        dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600
        focus:border-blue-400 dark:focus:border-blue-300
        focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40
        ${className}`}
      />
    </div>
  );
}
