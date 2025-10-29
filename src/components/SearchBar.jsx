import React, { useState, useEffect, useRef } from "react";

export default function SearchBar({ onSearch, defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);
  const timer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    clearTimeout(timer.current);

    // ننتظر 800 مللي ثانية بعد آخر كتابة
    timer.current = setTimeout(() => {
      if (newValue.trim()) onSearch(newValue.trim());
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
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
