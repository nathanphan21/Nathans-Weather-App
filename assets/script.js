var searchForm = document.getElementById("search-form");
var cityInput = document.getElementById("city-input");
var currentWeather = document.getElementById("current-weather");
var forecast = document.getElementById("forecast");
var searchHistory = document.getElementById("search-history");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var city = cityInput.value;


    fetchCityCoordinates(city)
        .then(coordinates => {
            if (coordinates) {

                fetchWeatherData(coordinates.lat, coordinates.lon);
            } else {
                console.error('City not found');
                currentWeather.innerHTML = '<p>City not found. Please try again.</p>';
            }
        });
    
    cityInput.value = "";
});

async function fetchCityCoordinates(city) {
    var apiKey = 'af01825efce7dfa7d7ed9c57c3f4c408';
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`; // Geocoding API URL

    try {
        var response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        var cityData = await response.json();
        
        if (cityData.coord) {
            return {
                lat: cityData.coord.lat,
                lon: cityData.coord.lon
            };
        } else {
            return null; 
        }
    } catch (error) {
        console.error('Error fetching city coordinates:', error);
        return null;
    }
}

async function fetchWeatherData(lat, lon) {
    var apiKey = 'af01825efce7dfa7d7ed9c57c3f4c408';
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`; // Weather API URL

    try {
        var response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        var weatherData = await response.json();

        var cityName = weatherData.city.name;
        var date = new Date(weatherData.list[0].dt * 1000).toLocaleDateString();
        var icon = weatherData.list[0].weather[0].icon;
        var temperature = `${weatherData.list[0].main.temp}°F`;
        var humidity = `${weatherData.list[0].main.humidity}%`;
        var windSpeed = `${weatherData.list[0].wind.speed} m/s`;

        currentWeather.innerHTML = `
            <h2>${cityName} - ${date}</h2>
            <p>Icon: <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon"></p>
            <p>Temperature: ${temperature}</p>
            <p>Humidity: ${humidity}</p>
            <p>Wind Speed: ${windSpeed}</p>
        `;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        currentWeather.innerHTML = '<p>Error fetching weather data. Please try again.</p>';
    }
}
