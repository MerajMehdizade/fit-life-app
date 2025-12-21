export default function SearchBox({
  value,
  onChange,
  placehold,
}: {
  value: string;
  onChange: (v: string) => void;
  placehold:string;
}) {
  return (
    <input
      placeholder={placehold}
      className="w-full sm:w-64 border border-gray-700 bg-gray-800 text-gray-100 p-2 rounded
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
