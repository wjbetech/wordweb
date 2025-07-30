// src/components/Sidebar.tsx
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <button
        className="absolute top-4 left-4 z-50 px-3 py-2 bg-[#4c5c68] text-white rounded-lg shadow-md hover:bg-[#3b4a54] transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Sidebar panel */}
      <div
        className={`fixed top-4 left-4 h-[calc(100%-2rem)] w-64 rounded-xl bg-[#e8e4d9] shadow-xl p-4 z-40 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-lg font-bold mb-4 text-gray-800">Sidebar</h2>
        <p className="text-sm text-gray-600">Sidebar content coming soon…</p>
      </div>
    </>
  );
}
