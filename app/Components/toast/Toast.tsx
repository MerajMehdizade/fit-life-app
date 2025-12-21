"use client";

import { useEffect } from "react";

export default function Toast({
  show,
  message,
  type = "success",
  onClose,
  bgColor
}: {
  show: boolean;
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  bgColor?: string;
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;
  const bgClass = bgColor
    ? bgColor
    : type === "success"
      ? "bg-gray-700 border-gray-300 text-white"
      : "bg-red-600/30 border-red-300 text-white";
  return (
    <div
      dir="rtl"
      className={`flex items-center w-full max-w-sm p-4 text-bodyrounded-md shadow border ${bgClass} fixed bottom-5 right-5 z-50`}
      role="alert"
    >
      <svg
        className="w-5 h-5 text-blue-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m12 18-7 3 7-18 7 18-7-3Zm0 0v-5"
        />
      </svg>
      <div className="mr-3 border-r border-red-300 pr-3 dark:border-red-500 capitalize">
        {message}
      </div>

      <button
        type="button"
        className="ms-auto flex items-center justify-center text-body border border-transparent font-medium rounded text-sm h-8 w-8 focus:outline-none focus:ring-2 text-red-500 cursor-pointer"
        onClick={onClose}
        aria-label="Close"
      >
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 17.94 6M18 18 6.06 6" />
        </svg>
      </button>
    </div>




    // <div id="toast-default" className={`flex items-center w-full max-w-xs p-4 ${bgClass} rounded-base shadow-xs border`} role="alert">
    //   <svg className="w-6 h-6 text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.122 17.645a7.185 7.185 0 0 1-2.656 2.495 7.06 7.06 0 0 1-3.52.853 6.617 6.617 0 0 1-3.306-.718 6.73 6.73 0 0 1-2.54-2.266c-2.672-4.57.287-8.846.887-9.668A4.448 4.448 0 0 0 8.07 6.31 4.49 4.49 0 0 0 7.997 4c1.284.965 6.43 3.258 5.525 10.631 1.496-1.136 2.7-3.046 2.846-6.216 1.43 1.061 3.985 5.462 1.754 9.23Z" /></svg>
    //   <div className="ms-2.5 text-sm border-s ps-3.5">{message}</div>
    //   <button type="button" className="ms-auto flex items-center justify-center text hover:text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-900 font-medium leading-5 rounded text-sm h-8 w-8 focus:outline-none" data-dismiss-target="#toast-default" aria-label="Close">
    //     <span className="sr-only">Close</span>
    //     <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" /></svg>
    //   </button>
    // </div>


  );
}
