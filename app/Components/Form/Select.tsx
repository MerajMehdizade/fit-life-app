import { useState } from "react";

export function Select({
  children,
  value,
  onChange,
  className = "",
}: {
  children: React.ReactNode;
  value: string;
  onChange: (e: any) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex items-center">
      <span className="absolute">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-w-6 h-6 mx-3 text-gray-300 dark:text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>

      </span>
      <select
        value={value}
        onChange={onChange}
        onMouseDown={() => setOpen(prev => !prev)}
        onBlur={() => setOpen(false)}
        onKeyDown={() => setOpen(true)}
        className={`block w-full py-3 px-11 
        bg-gray-100 border border-gray-300 text-gray-700 text-sm
        rounded-lg appearance-none
        focus:ring-blue-500 focus:border-blue-500
        shadow-sm
        dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700
        dark:focus:ring-blue-400 dark:focus:border-blue-400
        ${className}`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>

  );
}
