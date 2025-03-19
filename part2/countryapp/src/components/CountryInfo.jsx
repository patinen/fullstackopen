import React from "react";

const CountryInfo = ({ country, weather }) => {
  if (!country) return null;

  return (
    <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Population: {country.population}</p>
        <p>Region: {country.region}</p>
            {country.languages && (
    
    <div>
        <h4>Languages:</h4>
        <ul>
        {Object.values(country.languages).map((lang, index) => (
            <li key={index}>{lang}</li>
        ))}
        </ul>
    </div>
    )}
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />

        <h3>Weather in {country.capital}</h3>
        {weather && weather.main ? (
            <div>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Feels Like: {weather.main.feels_like}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          {weather.weather && weather.weather.length > 0 && (
            <>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <p>{weather.weather[0].description}</p>
            </>
          )}
        </div>
      ) : (
        <p>Weather data not available.</p>
      )}
    </div>
  );
};

export default CountryInfo;