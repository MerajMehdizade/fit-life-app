"use client";

import { getLabel } from "@/lib/labels"; 

type Props = {
  value?: string;
  options?: string[];
  onChange: (value: string) => void;
};

export default function OptionSelector({
  value,
  options = [],
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        const selected = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`
              p-3 rounded-xl border text-sm font-medium transition-all duration-200
              ${
                selected
                  ? "bg-green-500 text-black border-green-400 scale-105"
                  : "bg-gray-800 text-white border-gray-700 active:scale-95"
              }
            `}
          >
            {getLabel(option)}
          </button>
        );
      })}
    </div>
  );
}
