import React, { useState, useEffect } from "react";
import countryData from "./data/countryData";
import weatherData from "./data/weatherData";
import Search from "./components/Search";
import CountryList from "./components/CountryList";
import CountryInfo from "./components/CountryInfo";

const CountryApp = () => {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!query) {
      setCountries([]);
      setSelected(null);
      setWeather(null);
      return;
    }
  
    countryData.getAll().then((data) => {
      const results = data.filter((c) =>
        c.name.common.toLowerCase().includes(query.toLowerCase())
      );
      setCountries(results);
  
      if (results.length === 1) {
        setSelected(results[0]);
      } else {
        setSelected(null);
        setWeather(null);
      }
    });
  }, [query]);

  useEffect(() => {
    if (!selected || !selected.capital) {
      setWeather(null);
      return;
    }

    const capitalCity = Array.isArray(selected.capital) ? selected.capital[0] : selected.capital;

    weatherData.getWeather(capitalCity)
      .then((data) => {
        if (data && data.main) {
          setWeather(data);
        } else {
          setWeather(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setWeather(null);
      });
  }, [selected]);

  return (
    <div>
      <h1>Country Search</h1>
      <Search value={query} onChange={(e) => setQuery(e.target.value)} />
      
      {countries.length === 1 ? (
        <CountryInfo country={countries[0]} weather={weather} showLanguages={true} />
      ) : selected ? (
        <CountryInfo country={selected} weather={weather} showLanguages={true} />
      ) : (
        <CountryList countries={countries} onSelect={setSelected} />
      )}
    </div>
  );
};

export default CountryApp;
