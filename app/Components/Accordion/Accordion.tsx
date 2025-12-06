"use client";

import { ReactNode, useState } from "react";

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4 text-lg font-semibold bg-gray-700"
      >
        {title}

        <span
          className={`transition-transform duration-300 text-xl ${
            open ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
      </button>

      <div
        className={`transition-all duration-300 ${
          open ? "max-h-[1000px] opacity-100 p-4" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        {children}
      </div>
    </div>
  );
}
