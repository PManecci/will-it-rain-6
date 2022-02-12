//Variables 

var cityNames = [];

var citySearchForm = document.querySelector("#city-search");
var cityInput = document.querySelector("#city");
var currentCityName = document.querySelector("#city-name");
var currentWeather = document.querySelector("#current-weather-display");
var forecastTitle = document.querySelector("#forecast-title");
var forecastDisplay = document.querySelector("#forecast-display");
var pastSearchButtons = document.querySelector("#search-history");

//Search Form

var searchForm = function(event) {
    event.preventDefault();
    var city = cityInput.value.trim();
    if (city) {
        getCurrentWeather(city);
        getForecast(city);
        cityNames.unshift({city});
        cityInput.value = " ";
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
var displayWeather = function(weatherCity, searchCity) {

    //Clear Search
    currentWeather.textContent = " ";
    currentCityName.textContent = searchCity;

    //Current Date
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weatherCity.dt.value).format("MMM D, YYYY") + ") ";
    currentCityName.appendChild(currentDate);

    //Current Temperature
    var temp = document.createElement("span");
    temp.textContent = "temperature: " + weatherCity.main.temp + " °F";
    temp.classList = "list-group-item"

    //Current Humidity
    var humidity = document.createElement("span");
    humidity.textContent = "humidity: " + weatherCity.main.humidity + "%";
    humidity.classList = "list-group-item"

    //Weather Description
    var weatherDescription = document.createElement("span");
    weatherDescription.textContent = "weather conditions: " + weatherCity.weather[0].description;
    weatherDescription.classList = "list-group-item"

    //Current Wind Speed
    var windSpeed = document.createElement("span");
    windSpeed.textContent = "wind speed: " + weatherCity.wind.speed + " mph";
    windSpeed.classList = "list-group-item"

    //Append to single object container
    currentWeather.appendChild(temp);
    currentWeather.appendChild(humidity);
    currentWeather.appendChild(weatherDescription);
    currentWeather.appendChild(windSpeed);

    //Coordinates for UV
    var lat = weatherCity.coord.lat;
    var lon = weatherCity.coord.lon;
    getUvIndex (lat,lon)
};

// get uv index function

var getUvIndex = function(lat,lon) {
    var apiKey = "8e80a0f98579eb445d9f829dcd002983";
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
}
// uv index function
var displayUvIndex = function(index){
    var uvIndex = document.createElement("div");
    uvIndex.textContent = "UV Index is "
    uvIndex.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <= 2) {
        uvIndexValue.classList = "favorable"
    } else if(index.value > 2 && index.value <= 8){
        uvIndexValue.classList = "moderate"
    } else if(index.value > 8){
        uvIndexValue.classList = "severe"
    };

    uvIndex.appendChild(uvIndexValue);

    currentWeather.appendChild(uvIndex);
}

// Fetch 5-Day Forecast for Selected City
var getForecast = function(city) {
    var apiKey = "8e80a0f98579eb445d9f829dcd002983";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayForecast(data);
        });
    });
};

// display results for 5 day forecast
var displayForecast = function(weather) {
    forecastDisplay.textContent = " "
    forecastTitle.textContent = "Your 5-Day Forecast";

    var forecast = weather.list;
    for (var i=5; i < forecast.length; i=i+8){
    var dailyForecast = forecast[i];
        
    var forecastEl=document.createElement("div");
    forecastEl.classList = "card bg-info text-light m-2";
    

    // date element
    var forecastDate = document.createElement("h5")
    forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");       
    forecastDate.classList = "card-header text-center"
    forecastEl.appendChild(forecastDate);

    // temperture element
    var forecastTempEl=document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = "temp: " + dailyForecast.main.temp + " °F";      
    forecastEl.appendChild(forecastTempEl);
    
    // humidity element
    var forecastHumidityEl=document.createElement("span");
    forecastHumidityEl.classList = "card-body text-center";
    forecastHumidityEl.textContent = "humidity: " + dailyForecast.main.humidity + "%"
    forecastEl.appendChild(forecastHumEl);

    // wind speed
    var forecastWindEl = document.createElement("span");
    forecastWindEl.classList = "card-body text-center";
    forecastWindEl.textContent = "wind speed: " + dailyForecast.wind.speed + " MPH";
    forecastEl.appendChild(forecastWindEl);

    forecastDisplay.appendChild(forecastEl);
    }

}

// Creates Button for Past City Searches
var searchHistory = function(searchHistory){

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = searchHistory;
    pastSearchEl.classList = "d-flex w-100 btn-outline-secondary";
    pastSearchEl.setAttribute("data-city",searchHistory)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtons.prepend(pastSearchEl);
}

// when "past searches" are clicked on, show data for that city

var searchHistoryHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city) {
        getCurrentWeather(city);
        getForecast(city);
    }
}

citySearchForm.addEventListener("submit", searchForm);
pastSearchButtons.addEventListener("click", searchHistoryHandler);