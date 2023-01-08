import axios from "axios";
import { KEY } from "./config.js";

export async function getWeather(cityValue, timezone) {
    "strict mode";

    let cityCoords;
    try {
        cityCoords = await getCoordsFromCity(cityValue, KEY);
    } catch (err) {
        throw new Error(`RADICAL ERROR: ${err}`);
    }

    function getCoordsFromCity(city, key) {
        return axios
            .get("https://api.geoapify.com/v1/geocode/search?format=json", {
                params: { apiKey: key, text: city, limit: 1 },
            })
            .then(({ data: { results } }) => {
                return {
                    lat: results[0].lat,
                    lon: results[0].lon,
                    formatted: results[0].formatted,
                    country: results[0].country,
                    countryCode: results[0].country_code,
                    city: results[0].city,
                };
            });
    }

    return axios
        .get(
            "https://api.open-meteo.com/v1/forecast?latitude=-23.03&longitude=-49.15&hourly=relativehumidity_2m,precipitation&daily=weathercode,temperature_2m_max,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=America%2FSao_Paulo",
            {
                params: {
                    latitude: cityCoords.lat,
                    longitude: cityCoords.lon,
                    timezone: timezone,
                },
            },
        )
        .then(({ data }) => {
            return {
                current: parseCurrentWeather(data),
                daily: parseDailyWeather(data),
            };
        });

    function parseCurrentWeather(data) {
        return {
            currentTemp: Math.round(data.current_weather.temperature),
            time: data.current_weather.time * 1000,
            location: {
                city: cityCoords.city,
                country: cityCoords.country,
                countryCode: cityCoords.countryCode,
                formatted: cityCoords.formatted,
            },
            weatherCode: data.current_weather.weathercode,
            wind: Math.round(data.current_weather.windspeed),
            precip: Math.round(data.daily.precipitation_sum[0]),
            humidity: data.hourly.relativehumidity_2m[data.hourly.time.indexOf(data.current_weather.time)],
        };
    }

    function parseDailyWeather({ daily }) {
        let arr = [];
        for (let index = 1; index <= 4; index++) {
            arr.push({
                dailyTemp: Math.round(daily.temperature_2m_max[index]),
                timestamp: daily.time[index] * 1000,
                weatherCode: daily.weathercode[index],
            });
        }
        return arr;
    }
}
