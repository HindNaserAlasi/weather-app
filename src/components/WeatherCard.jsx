import React from "react";
import { motion } from "framer-motion";

export default function WeatherCard({ city, temp, description, icon, humidity, wind }) {
  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="card mt-6 p-6 rounded-2xl shadow-xl w-80 text-center"
      role="region"
      aria-label={`Weather in ${city}`}
    >
      <h2 className="text-2xl font-bold mb-2">{city}</h2>

      <img src={icon} alt={description} className="mx-auto w-28 h-28" />

      <div className="mt-2">
        <div className="text-5xl font-extrabold">{temp}°C</div>
        <div className="capitalize text-sm text-gray-700 dark:text-gray-300">{description}</div>
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex flex-col items-center">
          <span className="font-semibold">{humidity}%</span>
          <span className="text-xs">Humidity</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{wind} m/s</span>
          <span className="text-xs">Wind</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">Now</span>
          <span className="text-xs">Condition</span>
        </div>
      </div>
    </motion.div>
  );
}
