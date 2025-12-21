export default function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-10 bg-gray-800 rounded animate-pulse"
        />
      ))}
    </div>
  );
}
