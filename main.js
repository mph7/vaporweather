import { ICON_MAP } from "./iconsMap";
import { getWeather } from "./request";

import "./style.css";

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

    $searchButton.addEventListener("click", handleSearchButtonClick, false);
    $changeLocationButton.addEventListener("click", handleChangeLocationClick, false);

    function handleChangeLocationClick() {
        changeDisplayMode();
    }

    function handleSearchButtonClick(e) {
        e.preventDefault();
        getWeather($cityValue.value, Intl.DateTimeFormat().resolvedOptions().timeZone)
            .then(renderWeather)
            .catch((e) => {
                console.log(e);
                alert("Error getting weather.");
            });
    }

    function renderWeather({ current, daily }) {
        renderCurrentWeather(current);
        renderDailyWeather(daily);
        changeDisplayMode();
    }

    const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
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
})();
