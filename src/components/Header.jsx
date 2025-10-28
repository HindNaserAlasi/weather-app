import React from "react";

export default function Header({ toggleDarkMode, darkMode }) {
  return (
    <header className="w-full bg-gradient-to-r from-primary to-secondary text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Weather App</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md transition"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
