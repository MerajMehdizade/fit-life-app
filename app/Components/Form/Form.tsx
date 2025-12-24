"use client";

export function Form({
  children,
  onSubmit,
  className = "",
}: {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}) {
  return (
    <form onSubmit={onSubmit} className={`w-full max-w-md space-y-3 ${className}`}>
      {children}
    </form>
  );
}
