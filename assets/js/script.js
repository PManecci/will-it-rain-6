//Variables 

var cityNames = [];

var citySearchFormEl = document.querySelector("#city-search");
var cityInputEl = document.querySelector("#city-name-input");
var currentCityNameEl = document.querySelector("#city-name");
var currentWeatherEl = document.querySelector("#curent-weather-display");
var forecastTitleEl = document.querySelector("#forecast-title");
var forecastDisplayEL = document.querySelector("#forecast-display");
var pastSearchButtons = document.querySelector("#search-history");

//Search Form

var searchForm = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getCurrentWeather(city);
        getForecast(city);
        cityNames.unshift({city});
        cityInputEl.value = "";
    } else {
        alert("Please enter a valid city name!");
    }
    saveSearch();
    searchHistory(city);
};

//Save Search History
var saveSearch = function() {
    localStorage.setItem("cityNames", JSON.stringify(cityNames));
};

//Fetch Data from Open Weather
var getCurrentWeather = function(city) {
    var apiKey = "8e80a0f98579eb445d9f829dcd002983";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL).then(function(response) {
        response.json().then(function(data){
            displayWeather(data,city);
        });
    });
};

//Display Data
var displayWeather = function(weather, searchCity) {

    we


}

citySearchFormEl.addEventListener("submit", searchForm);
//pastSearchButtonEl.addEventListener("click", pastSearchHandler);