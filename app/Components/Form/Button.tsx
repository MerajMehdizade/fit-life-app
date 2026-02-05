export function Button({
  children,
  loading = false,
  disabled,
  className = "",
  ...props
}: any) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`
        w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize
        transition-colors duration-300 transform bg-blue-500 rounded-lg
        hover:bg-blue-400 focus:outline-none focus:ring
        focus:ring-blue-300 focus:ring-opacity-50
        flex items-center justify-center gap-2
        disabled:opacity-70
        ${className}
      `}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
