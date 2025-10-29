import React, { useState } from "react";

/**
 * Props:
 * - onSearch(city: string)
 * - defaultValue
 */
export default function SearchBar({ onSearch, defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center justify-center">
      <input
        className="flex-1 px-4 py-3 rounded-l-lg border border-gray-200 dark:border-gray-700 outline-none shadow-sm w-64 dark:bg-gray-800 dark:text-gray-100"
        placeholder="Enter city name..."
        value={value}
        onChange={(e) => setValue(e.target.value)} // فقط تحديث النص
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}
