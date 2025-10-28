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
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Simple sessionStorage cache to avoid repeated requests
  const cacheKey = (city) => `weather_cache_${city.toLowerCase()}`;

  const fetchWeather = useCallback(async (city) => {
    if (!city) return;
    setError("");
    setLoading(true);

    try {
      // check cache
      const cached = sessionStorage.getItem(cacheKey(city));
      if (cached) {
        const parsed = JSON.parse(cached);
        const age = Date.now() - parsed._ts;
        // use cache for 10 minutes
        if (age < 10 * 60 * 1000) {
          setWeather(parsed.data);
          setLoading(false);
          return;
        } else {
          sessionStorage.removeItem(cacheKey(city));
        }
      }

      if (!apiKey) {
        setError("API key missing. Put VITE_WEATHER_API_KEY in .env");
        setWeather(null);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&units=metric&appid=${apiKey}`
      );

      const data = await res.json();

      if (res.status !== 200) {
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
        // cache
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
  }, [apiKey]);

  // debounce user search submissions inside SearchBar; here effect loads initial
  useEffect(() => {
    fetchWeather(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (city) => {
    setSearch(city);
    fetchWeather(city);
  };

  const toggleDarkMode = () => {
    setDarkMode((d) => !d);
    // optional: persist UI preference
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
              <div className="mt-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded">
                {error}
              </div>
            )}

            {!loading && weather && (
              <Suspense fallback={<Loader />}>
                <div className="flex justify-center">
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
