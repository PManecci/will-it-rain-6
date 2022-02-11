//Variables 

var cityNames = [];

var citySearchFormEl = document.querySelector("#city-search");
var cityInputEl = document.querySelector("#city");
var currentCityNameEl = document.querySelector("#city-name");
var currentWeatherEl = document.querySelector("#current-weather-display");
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
        cityInputEl.value = " ";
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
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

    fetch(apiURL).then(function(response) {
        response.json().then(function(data){
            displayWeather(data,city);
        });
    });
};

//Display Data
var displayWeather = function(weather, searchCity) {

    //Clear Search
    currentWeatherEl.textContent = " ";
    currentCityNameEl.textContent = searchCity;

    //Current Date
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    currentCityNameEl.appendChild(currentDate);

    //Current Temperature
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"

    //Current Humidity
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "humidity: " + weather.main.humidity + "%";
    humidityEl.classList = "list-group-item"

    //Current Wind Speed
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "wind speed: " + weather.wind.speed + " mph";
    windSpeedEl.classList = "list-group-item"

    //Append to single object container
    currentWeatherEl.appendChild(temperatureEl);
    currentWeatherEl.appendChild(humidityEl);
    currentWeatherEl.appendChild(windSpeedEl);

    //Coordinates for UV
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUVIndex (lat,lon)
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
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index is "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <= 2) {
        uvIndexValue.classList = "favorable"
    } else if(index.value > 2 && index.value <= 8){
        uvIndexValue.classList = "moderate"
    } else if(index.value > 8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    currentWeatherEl.appendChild(uvIndexEl);
}

// fetch data for 5 day forecast
var get5Day = function(city) {
    var apiKey = "8e80a0f98579eb445d9f829dcd002983";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            display5Day(data);
        });
    });
};

// display results for 5 day forecast
var display5Day = function(weather) {
    forecastDisplayEl.textContent = ""
    forecastTitleEl.textContent = "Your 5 Day Forecast";

    var forecast = weather.list;
    for (var i=5; i < forecast.length; i=i+8){
    var dailyForecast = forecast[i];
        
    var forecastEl=document.createElement("div");
    forecastEl.classList = "card bg-secondary text-light m-2";
    

    // date element
    var forecastDate = document.createElement("h5")
    forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");       
    forecastDate.classList = "card-header text-center bg-primary"
    forecastEl.appendChild(forecastDate);
        
    // add an image to show weather icon
    var weatherIcon = document.createElement("img")
    weatherIcon.classList = "card-body text-center";
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`); 
    
    forecastEl.appendChild(weatherIcon);

    // temperture element
    var forecastTempEl=document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = "temp: " + dailyForecast.main.temp + " °F";
        
    forecastEl.appendChild(forecastTempEl);
    
    // humidity element
    var forecastHumEl=document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent = "humidity: " + dailyForecast.main.humidity + "%";

    forecastEl.appendChild(forecastHumEl);

    // wind speed
    var forecastWindEl = document.createElement("span");
    forecastWindEl.classList = "card-body text-center";
    forecastWindEl.textContent = "wind speed: " + dailyForecast.wind.speed + " MPH";

    forecastEl.appendChild(forecastWindEl);



    forecastDisplayEl.appendChild(forecastEl);
    }

}

// save searches in past search bar
var pastSearch = function(pastSearch){

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtons.prepend(pastSearchEl);
}

// when "past searches" are clicked on, show data for that city

var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city) {
        getCityWeather(city);
        get5Day(city);
    }
}

citySearchFormEl.addEventListener("submit", searchForm);
pastSearchButtons.addEventListener("click", pastSearchHandler);