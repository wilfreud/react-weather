import { useState, useEffect } from "react";
import "./App.css";
import { WEATHER_API_KEY } from "./environment";
import axios from "axios";

interface WeatherData {
  temp: string;
  desc: string;
  icon: string;
  humidity: string;
  wind: string;
  city: string;
}

function App() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: "",
    desc: "",
    icon: "",
    humidity: "",
    wind: "",
    city: "",
  });
  const [isReady, setReady] = useState(false);
  const [isError, setError] = useState(false);
  const [lat, setLat] = useState<string>("12.6937");
  const [lon, setLong] = useState<string>("-17.4441");

  const getTempColor = (temp: number) => {
    if (temp < 10) return "#67b0e8"; // cold (blue)
    if (temp < 20) return "#9be179"; // cool (green)
    if (temp < 30) return "#f5d749"; // warm (yellow)
    return "#f28482"; // hot (red)
  };

  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

  useEffect(() => {
    axios
      .get(API_URL, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
        },
      })
      .then((response) => {
        const temp = (response.data.main.temp - 273.15).toFixed(2);
        const desc = response.data.weather[0].description;
        const icon = response.data.weather[0].icon;
        const humidity = response.data.main.humidity;
        const wind = (response.data.wind.speed * 3.6).toFixed(2);
        const city = response.data.city;

        setWeather({
          temp,
          desc,
          icon,
          humidity: humidity.toString(),
          wind: wind.toString(),
          city,
        });
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      })
      .finally(() => {
        setReady(true);
      });
  }, [lat, lon, API_URL]);

  if (isError) {
    return <p>Erreur lors de la récupération des données</p>;
  }

  if (isReady) {
    const tempColor = getTempColor(parseFloat(weather.temp));

    return (
      <div className="App" style={{ backgroundColor: tempColor }}>
        <div className="InputContainer">
          <input
            type="text"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <input
            type="text"
            placeholder="Longitude"
            value={lon}
            onChange={(e) => setLong(e.target.value)}
          />
        </div>
        <p>Ville: {weather.city}</p>
        <p>Température : {weather.temp} °C</p>
        <p>Description : {weather.desc}</p>
        <img
          src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt="Icône météo"
        />
        <p>Humidité : {weather.humidity} %</p>
        <p>Vent : {weather.wind} km/h</p>
      </div>
    );
  } else {
    return <p>Chargement...</p>;
  }
}

export default App;
