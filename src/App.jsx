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
  const [controller, setController] = useState(null); // للتحكم في الطلبات المتداخلة

  const cacheKey = (city) => `weather_cache_${city.toLowerCase()}`;

  const fetchWeather = useCallback(async (city) => {
    if (!city.trim()) return;

    setError("");
    setLoading(true);

    // إلغاء أي طلب سابق قيد التنفيذ
    if (controller) controller.abort();
    const newController = new AbortController();
    setController(newController);

    try {
      // التحقق من الكاش
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

      // الطلب من دالة Netlify Function
      const res = await fetch(
        `/.netlify/functions/weather?city=${encodeURIComponent(city)}`,
        { signal: newController.signal }
      );

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      const cleaned = {
        city: data.name,
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        wind: data.wind.speed,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      };

      setWeather(cleaned);
      sessionStorage.setItem(
        cacheKey(city),
        JSON.stringify({ _ts: Date.now(), data: cleaned })
      );
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        setError("City not found or API error");
        setWeather(null);
      }
    } finally {
      setLoading(false);
    }
  }, [controller]);

  useEffect(() => {
    fetchWeather(search);
  }, []); // تحميل أول مدينة

  const handleSearch = (city) => {
    setSearch(city);
    fetchWeather(city);
  };

  const toggleDarkMode = () => {
    setDarkMode((d) => !d);
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
