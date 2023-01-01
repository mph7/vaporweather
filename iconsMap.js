export const ICON_MAP = new Map();

addMapping([0, 1], "sunny");
addMapping([2, 3], "cloudy");
addMapping([45, 48], "foggy");
addMapping([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], "rainy");
addMapping([71, 73, 75, 77, 85, 86], "snowy");
addMapping([95, 96, 99], "thunderstorm");

function addMapping(values, icon) {
    values.forEach((value) => {
        ICON_MAP.set(value, icon);
    });
}
