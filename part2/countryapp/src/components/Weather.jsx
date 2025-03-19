import { useState, useEffect } from "react";
import weatherData from "../data/weatherData";

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherData
      .getWeather(capital)
      .then(setWeather)
      .catch(() => setWeather(null));
  }, [capital]);

  if (!weather) return <p>Loading weather...</p>;

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {weather.main.temp}°C</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Weather icon"
      />
      <p>{weather.weather[0].description}</p>
    </div>
  );
};

export default Weather;
