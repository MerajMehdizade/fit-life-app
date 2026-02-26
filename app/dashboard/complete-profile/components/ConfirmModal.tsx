export default function ConfirmModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gray-950 rounded-2xl p-6 max-w-sm w-full text-center border border-gray-700 shadow-2xl">
        <h2 className="text-md font-bold mb-4 text-white">آیا مطمئن هستید؟</h2>
        <p className="text-gray-300 mb-3">با تایید، اطلاعات پروفایل شما ثبت و آنالیز می‌شود.</p>
        <p className="text-red-600 mb-3 text-sm">هرچی اطلاعات دقیق‌تر باشه، ما هم بهتر می‌تونیم کنارت باشیم و یه برنامه کاملاً متناسب با خودت برات بسازیم</p>
        <div className="flex justify-between gap-4">
          <button onClick={onCancel} className="w-1/2 py-2 border border-red-500 rounded-xl text-red-500">
            لغو
          </button>
          <button onClick={onConfirm} className="w-1/2 py-2 border border-green-500 rounded-xl text-green-500">
            تایید
          </button>
        </div>
      </div>
    </div>
  );
}
