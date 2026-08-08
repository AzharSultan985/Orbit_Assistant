import React from "react";

export default function SidebarLayout() {
  return (
    <nav className="flex flex-col h-screen w-64 border-r border-[#1c1c1c] bg-white p-4 dark:border-[#353434] dark:bg-[#1c1c1c]">
      {/* Logo */}
      <a href="#" className="ml-2 w-fit text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        ORBIT
      </a>

      {/* Links */}
      <div className="flex flex-col gap-2">
        <a
          href="#"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#353434] dark:hover:text-white"
        >
          {/* Example icon */}
          <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15.5 2..."></path>
          </svg>
          Chat
        </a>
      </div>
    </nav>
  );
}
