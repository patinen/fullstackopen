import axios from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const getWeather = async (city) => {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; 
  if (!API_KEY) {
    console.error("API key is missing");
    return null;
  }

  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        q: city,
        units: "metric",
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

export default { getWeather };