export default function Pagination({ page, pages, setPage }: any) {
  return (
    <div className="flex gap-4 mt-6 justify-center sm:justify-start">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
      >
        قبلی
      </button>

      <span>
        صفحه {page} از {pages}
      </span>

      <button
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
      >
        بعدی
      </button>
    </div>
  );
}
