const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");

const cityName = document.querySelector("#cityName");
const temperature = document.querySelector("#temperature");
const condition = document.querySelector("#condition");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");

const message = document.querySelector("#message");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();
    if (city === "") {
        message.innerText = "Please enter a city name.";
        return;
    }
    message.innerText = "Loading...";

    try {
        // Step 1: Get latitude and longitude of the city
        const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
    throw new Error("City not found");
}


         const latitude = locationData.results[0].latitude;
        const longitude = locationData.results[0].longitude;
        const name = locationData.results[0].name;

        // Step 2: Get weather using latitude and longitude

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );

        const weatherData = await weatherResponse.json();

        // Step 3: Get current weather data

        const currentWeather = weatherData.current;

        // Step 4: Display data

        cityName.innerText = name;

        temperature.innerText = currentWeather.temperature_2m;

        humidity.innerText = currentWeather.relative_humidity_2m;

        windSpeed.innerText = currentWeather.wind_speed_10m;

        condition.innerText = getWeatherCondition(
            currentWeather.weather_code
        );
      message.innerText = "";


    } catch (error) {

        message.innerText = "❌ City not found. Please try again.";

        console.log(error);
    }
}
//convert weather code to readable condition
function getWeatherCondition(code) {
    if (code==0) {
        return "Clear sky";
    }
    if (code>=1 && code<=3) {
        return "Partly cloudy";
    }
    if (code>=45 && code<=48) {
        return "Foggy";
    }
    if (code >= 51 && code <= 67) {
        return "Rainy";
    }

    if (code >= 71 && code <= 77) {
        return "Snowy";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }
    return "Unknown";
}




