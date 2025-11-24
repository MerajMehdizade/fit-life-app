interface DropdownMenuProps {
  user: {
    name: string;
    email: string;
    profile?: any;
  };
  onLogout: () => void;
}

export default function DropdownMenu({ user, onLogout }: DropdownMenuProps) {
  return (
    <div  className="fixed top-0 left-0 z-50 bg-gray-900">
      <div  className="relative group inline-block px-5 mt-5">
        <button
          type="button"
          className="flex text-sm bg-neutral-800 rounded-full focus:ring-4 focus:ring-neutral-600 transition-all duration-200 group/avatar"
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="w-10 h-10 rounded-full object-cover"
            src="/profileTest.webp"
            alt="user photo"
          />
        </button>

        {/* Dropdown */}
        <div
          className="z-10 absolute bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg w-72 opacity-0 invisible group-hover:visible group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
        >
          <div className="p-2">
            <div className="flex items-center px-2.5 p-2 gap-2 text-sm bg-neutral-700 rounded-lg">

              <img
                className="w-8 h-8 rounded-full object-cover"
                src="/profileTest.webp"
                alt="user photo"
              />
              <div className="text-sm space-y-0.5">
                <div className="font-medium capitalize text-white">{user.name}</div>
                <div className="truncate text-neutral-300 text-xs">{user.email}</div>
              </div>
              <span className=" border text-white text-xs font-medium px-2 py-1 rounded ms-auto">
                Free
              </span>
            </div>
          </div>

          <ul className="px-2 pb-2 text-sm text-neutral-300 font-medium space-y-1 ">
            <li>
              <a
                className="inline-flex items-center w-full p-2 hover:bg-neutral-600 transition-colors duration-200 ease-out hover:text-white  rounded  gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                حساب کاربری
              </a>
            </li>

            <li>
              <a className="inline-flex items-center w-full p-2 hover:bg-neutral-600 transition-colors duration-200 ease-out hover:text-white  rounded  gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4" />
                </svg>
                اطلاعات فردی
              </a>
            </li>

            <li>
              <a className="inline-flex items-center w-full p-2 hover:bg-neutral-600 transition-colors duration-200 ease-out hover:text-white  rounded  gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365Z" />
                </svg>
                آمار بدنی
              </a>
            </li>
            <li>
              <a className="inline-flex items-center w-full p-2 hover:bg-neutral-600 transition-colors duration-200 ease-out hover:text-white  rounded  gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365Z" />
                </svg>
                ترجیحات تمرینی
              </a>
            </li>
            <li>
              <a className="inline-flex items-center w-full p-2 hover:bg-neutral-600 transition-colors duration-200 ease-out hover:text-white  rounded  gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365Z" />
                </svg>
                تنظیمات تغذیه
              </a>
            </li>

            <li className="border-t border-neutral-700 pt-1 ">
              <button onClick={onLogout} className="inline-flex items-center w-full p-2 hover:bg-neutral-600 transition-colors duration-200 ease-out hover:text-white cursor-pointer rounded  gap-2 text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                </svg>
                خروج
              </button >
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
