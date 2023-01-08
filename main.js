import { ICON_MAP } from "./iconsMap";
import { getWeather } from "./request";

import "./style.css";
import "./responsive.css";

(function () {
    "strict mode";

    const $container = document.querySelector(".container");
    const $subContainer = document.querySelector(".sub-container");
    const $searchButton = document.querySelector(".search-button");
    const $changeLocationButton = document.querySelector(".change-location-btn");
    const $cityValue = document.querySelector(".search-location input");

    setTimeout(function () {
        document.body.className = "";
    }, 1);

    let isSearching = false;
    $searchButton.addEventListener("click", handleSearchButtonClick, false);
    $changeLocationButton.addEventListener("click", handleChangeLocationClick, false);

    function handleChangeLocationClick() {
        isSearching = false;
        changeDisplayMode();
    }

    function handleSearchButtonClick(e) {
        e.preventDefault();
        if (isSearching) return;
        isSearching = true;
        startLoading();
        getWeather($cityValue.value, Intl.DateTimeFormat().resolvedOptions().timeZone)
            .then(renderWeather)
            .catch((e) => {
                console.error(e);
                alert("Error getting weather.");
            });
    }

    function startLoading() {
        document.querySelector("[data-loading-spinner]").classList.add("visible");
        document.querySelector(".background-image").classList.add("loading");
    }

    function stopLoading() {
        document.querySelector("[data-loading-spinner]").classList.remove("visible");
        document.querySelector(".background-image").classList.remove("loading");
    }

    function renderWeather({ current, daily }) {
        renderCurrentWeather(current);
        renderDailyWeather(daily);
        changeColorscheme(current.weatherCode);
        changeDisplayMode();
        stopLoading();
        document.querySelector(".search-location").reset();
    }

    const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    const DAY_FORMATTER = new Intl.DateTimeFormat("en-gb", { weekday: "long" });
    const $currentIcon = document.querySelector("[data-current-icon]");
    function renderCurrentWeather(current) {
        $currentIcon.src = getIconUrl(current.weatherCode);
        setValue("current-day", DAY_FORMATTER.format(current.time));
        setValue("current-full-date", FULL_DATE_FORMATTER.format(current.time));
        setValue("current-temp", current.currentTemp);
        setValue("current-weather", ICON_MAP.get(current.weatherCode));
        setValue("local", current.location.formatted);
        setValue("precip", current.precip);
        setValue("humidity", current.humidity);
        setValue("wind", current.wind);
    }

    const SHORT_DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "short" });
    const $dailyTemplate = document.getElementById("daily-template");
    const $dailyCardGroup = document.querySelector(".daily-card-group");
    function renderDailyWeather(daily) {
        $dailyCardGroup.innerHTML = "";
        daily.forEach((day) => {
            const element = $dailyTemplate.content.cloneNode(true);
            element.querySelector("[data-daily-icon]").src = getIconUrl(day.weatherCode);
            setValue("daily-day", SHORT_DAY_FORMATTER.format(day.timestamp), { parent: element });
            setValue("daily-temp", day.dailyTemp, { parent: element });
            $dailyCardGroup.appendChild(element);
        });
    }

    function getIconUrl(code) {
        return `img/${ICON_MAP.get(code)}-icon.svg`;
    }

    function setValue(selector, value, { parent = document } = {}) {
        parent.querySelector(`[data-${selector}]`).textContent = value;
    }

    function changeDisplayMode() {
        changeBetweenOriginalAndAlternative($container);
        changeBetweenOriginalAndAlternative($subContainer);
    }

    function changeBetweenOriginalAndAlternative(element) {
        if (element.classList.contains("alternative")) {
            element.classList.remove("alternative");
        } else {
            element.classList.add("alternative");
        }
    }

    const $root = document.querySelector(":root");
    const $cardBackground = document.querySelector(".background-image");

    const themes = {
        sunny: {
            "grad-color1": "#DDDD00",
            "grad-color2": "#FFA500",
            "main-color1": "#FFA500",
            "main-color2": "#DDDD00",
        },
        cloudy: {
            "grad-color1": "#432765",
            "grad-color2": "#321560",
            "main-color1": "#9C51B6",
            "main-color2": "#DDA0DD",
        },
        rainy: {
            "grad-color1": "#99FFFF",
            "grad-color2": "#00BBBB",
            "main-color1": "#00BBBB",
            "main-color2": "#99FFFF",
        },
        foggy: {
            "grad-color1": "#8F8F8F",
            "grad-color2": "#D3D3D3",
            "main-color1": "#BFBFBF",
            "main-color2": "#F5F5F5",
        },
        snowy: {
            "grad-color1": "#6666CC",
            "grad-color2": "#6699CC",
            "main-color1": "#9999CC",
            "main-color2": "#CCCCFF",
        },
        thunderstorm: {
            "grad-color1": "#00CC33",
            "grad-color2": "#33CC00",
            "main-color1": "#66CC99",
            "main-color2": "#99CC66",
        },
    };

    function setTheme(code) {
        const theme = themes[code];
        Object.entries(theme).forEach(([name, value]) => {
            $root.style.setProperty(`--${name}`, value);
        });
        $cardBackground.src = getBackgroundUrl(code);
    }

    function changeColorscheme(code) {
        const weatherCode = ICON_MAP.get(code);
        setTheme(weatherCode);
    }

    function getBackgroundUrl(code) {
        return `img/${code}-background.png`;
    }
})();
