import React, { useState, useEffect, useCallback, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Loader from "./components/Loader";
import { motion } from "framer-motion";

const WeatherCard = React.lazy(() => import("./components/WeatherCard"));

export default function App() {
  const [search, setSearch] = useState("London");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");

  const cacheKey = (city) => `weather_cache_${city.toLowerCase()}`;

  const fetchWeather = useCallback(async (city) => {
    if (!city) return;
    setError("");
    setLoading(true);

    try {
      // cache check
      const cached = sessionStorage.getItem(cacheKey(city));
      if (cached) {
        const parsed = JSON.parse(cached);
        const age = Date.now() - parsed._ts;
        if (age < 10 * 60 * 1000) {
          setWeather(parsed.data);
          setLoading(false);
          return;
        } else {
          sessionStorage.removeItem(cacheKey(city));
        }
      }

      // Fetch via Netlify Function
      const res = await fetch(`/.netlify/functions/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (!res.ok || data.cod !== 200) {
        setError(data.message || "City not found!");
        setWeather(null);
      } else {
        const cleaned = {
          city: data.name,
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          wind: data.wind.speed,
          description: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        };
        setWeather(cleaned);
        sessionStorage.setItem(
          cacheKey(city),
          JSON.stringify({ _ts: Date.now(), data: cleaned })
        );
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching weather");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load default city
  useEffect(() => {
    fetchWeather(search);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (city) => {
    setSearch(city);
    fetchWeather(city);
  };

  const toggleDarkMode = () => {
    setDarkMode((d) => !d);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col">
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

        <main className="flex flex-col items-center justify-center flex-grow px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl"
          >
            <SearchBar onSearch={handleSearch} defaultValue={search} />

            {loading && <Loader />}

            {!loading && error && (
              <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 p-4 rounded text-center">
                ⚠️ {error}
              </div>
            )}

            {!loading && weather && !error && (
              <Suspense fallback={<Loader />}>
                <div className="flex justify-center mt-6">
                  <WeatherCard {...weather} />
                </div>
              </Suspense>
            )}
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
