import React, { useState, useEffect, useRef } from "react";

/**
 * Props:
 * - onSearch(city: string)
 * - defaultValue
 */
export default function SearchBar({ onSearch, defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);
  const timer = useRef(null);

  // local debounce for key typing (avoid too many calls)
  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    // debounce: if user stops typing for 700ms, trigger search automatically
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (e.target.value.trim()) onSearch(e.target.value.trim());
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        className="flex-1 px-4 py-3 rounded-l-lg border border-gray-200 dark:border-gray-700 outline-none shadow-sm"
        placeholder="Search city (e.g. London)"
        value={value}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition"
      >
        Search
      </button>
    </form>
  );
}
