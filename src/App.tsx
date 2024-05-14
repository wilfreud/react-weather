import { useState, useEffect } from "react";
import "./App.css";
import { WEATHER_API_KEY } from "./environment";
import axios from "axios";
import { toast } from "react-hot-toast";

interface WeatherData {
  temp: string;
  desc: string;
  icon: string;
  humidity: string;
  wind: string;
  city: string;
  sunrise: string;
  sunset: string;
}

function App() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: "",
    desc: "",
    icon: "",
    humidity: "",
    wind: "",
    city: "",
    sunrise: "",
    sunset: "",
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
          lat: lat || 0,
          lon: lon || 0,
          appid: WEATHER_API_KEY,
        },
      })
      .then((response) => {
        const temp = (response.data.main.temp - 273.15).toFixed(2);
        const desc = response.data.weather[0].description;
        const icon = response.data.weather[0].icon;
        const humidity = response.data.main.humidity;
        const wind = (response.data.wind.speed * 3.6).toFixed(2);
        const city = response.data.name;
        console.log(response.data.name);

        const sunrise = new Date(
          response.data.sys.sunrise * 1000
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const sunset = new Date(
          response.data.sys.sunset * 1000
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        setWeather({
          temp,
          desc,
          icon,
          humidity: humidity.toString(),
          wind: wind.toString(),
          city,
          sunrise,
          sunset,
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
    toast.error("Erreur lors de la récupération des données météo", {
      duration: 1500,
    });
    setError(false);
  }

  if (isReady) {
    const tempColor = getTempColor(parseFloat(weather.temp));

    return (
      <div className="App" style={{ backgroundColor: tempColor }}>
        <div className="InputContainer">
          <h3>Coordonnées</h3>
          <label htmlFor="lat">Latitude</label>
          <input
            id="lat"
            type="number"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <label htmlFor="lon">Longitude</label>
          <input
            id="lon"
            type="number"
            placeholder="Longitude"
            value={lon}
            onChange={(e) => setLong(e.target.value)}
          />
        </div>

        <p>Ville: {weather.city || "???"}</p>
        <p>Température : {weather.temp} °C</p>
        <p>Description : {weather.desc}</p>
        <img
          src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt="Icône météo"
        />
        <p>Humidité : {weather.humidity} %</p>
        <p>Vent : {weather.wind} km/h</p>

        <p>Lever du soleil: {weather.sunrise}</p>
        <p>Coucher du soleil: {weather.sunset}</p>
      </div>
    );
  } else {
    return <p>Chargement...</p>;
  }
}

export default App;
