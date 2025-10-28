export async function handler(event) {
  const city = event.queryStringParameters.city || "London";
  const apiKey = process.env.WEATHER_API_KEY; // هذا المفتاح موجود بس على Netlify

  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}
