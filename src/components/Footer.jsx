import React from "react";

export default function Footer() {
  return (
    <footer className="w-full mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Weather App. All rights reserved.
      </div>
    </footer>
  );
}
