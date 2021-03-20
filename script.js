// SELECT ELEMENTS
const searchElement = document.querySelector(".search-btn");
const cityElement = document.querySelector(".city");
// const countryElement = document.querySelector(".country");
const dateElement = document.querySelector(".date");
const descElement = document.querySelector(".temp-description p");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temp-value p");
const feelsLikeElement = document.querySelector(".feels-like span");
const notificationElement = document.querySelector(".notification");
const windElement = document.querySelector(".wind-speed span");
const humidityElement = document.querySelector(".humidity span");

var input = document.getElementById("search");

let latitude = 0.0;
let longitude = 0.0;

input.addEventListener("keyup", function(event){
    let city;
    // Number 13 is the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        city = input.value;
        document.getElementById("search").value=""; 
        getSearchWeather(city)

        console.log(city)
    }
})
// App data
const weather = {}

weather.temperature = {
    unit : "celsius"
}
// APP CONSTS AND VARS
const KELVIN = 273.15;
// API KEY Moved to server side/Nodejs Application
const key = "";

//check if browser support geolocation
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesen't Support Geolocation</p>"
}
//set user's position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}
//show error when any issue with the geolocation service
function showError(error){
    notificationElement.style.display= "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}
searchElement.addEventListener("click", function(event){
    // console.log("hi")
if(input.value === "")
    navigator.geolocation.getCurrentPosition(setPosition, showError);
    //  getWeather(latitude, longitude);
else
    getSearchWeather(input.value);
})
function getSearchWeather(city){
   // var city = input.value;https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}

    let api = `https://project-weather-api-dk.herokuapp.com/getWeatherbyCity/?city=${city}`;
    let periodicData = "";
    let apiName = "city";
    fetch(api)
        .then(function(response){
            let data = response.json();
                return data;
        })
        .then (function(data){
            if(data.cod!="200"){
                notificationElement.style.display= "block";
                notificationElement.innerHTML = `<p>${data.message}</p>`;
                // weather = "";
                // clearVal();

            } else {
            periodicData = data;
            var resultsHTML = "";
            notificationElement.innerHTML = "";
            weather.temperature.val = Math.floor(data.list[0].main.temp - KELVIN);
            weather.feels= Math.floor(data.list[0].main.feels_like- KELVIN);
            weather.description = data.list[0].weather[0].description;
            weather.iconId = data.list[0].weather[0].icon;
            weather.city = data.city.name;
            weather.country = data.city.country;
            weather.wind = data.list[0].wind.speed;
            weather.humidity = data.list[0].main.humidity;
            var ts = data.list[0].dt;
            var now = new Date(ts * 1000);
            dateElement.innerHTML = dateBuilder(now);
            }
        })
        .then (function(){
            displayWeather(periodicData.list, apiName);
        });
}
function getWeather(latitude, longitude){
    let api = `https://project-weather-api-dk.herokuapp.com/getWeatherbyPosition/?lat=${latitude}&lon=${longitude}`;
    let periodicData = "";
    let apiName = "geoLoc";
    fetch(api)
        .then(function(response){
            let data = response.json();
            // console.log(data);
            return data;
        })
        .then (function(data){
            periodicData = data;
            var resultsHTML = "";
            // var ts= new Date(data.current.dt * 1000);
            weather.temperature.val = Math.floor(data.current.temp - KELVIN);
            console.log("geoloc initial temp value", weather.temperature.val);
            weather.feels= Math.floor(data.current.feels_like- KELVIN);
            weather.description = data.current.weather[0].description;
            weather.iconId = data.current.weather[0].icon;
            weather.city = data.timezone;
            weather.country = "";
            weather.wind = data.current.wind_speed;
            weather.humidity = data.current.humidity;
            let now = new Date();
            dateElement.innerHTML = dateBuilder(now);
        })
        .catch(err => {
            throw (`Sorry, An Error occured.  ${err}`);
        })
        .then (function(){
            displayWeather(periodicData, apiName);
        });
}
//display weather to UI
function displayWeather(periodicData, apiName){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.val}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    cityElement.innerHTML = ` ${weather.city} ${weather.country}`;
    // countryElement.innerHTML = ` ,`;
    feelsLikeElement.innerHTML = ` ${weather.feels}`;
    windElement.innerHTML = ` ${weather.wind}`;
    humidityElement.innerHTML = ` ${weather.humidity}`;
    if(apiName === "geoLoc"){
        document.getElementById("hourlyForecast").innerHTML = renderHourlyForecast(periodicData.hourly);
        document.getElementById("dailyForecast").innerHTML = renderDailyForecast(periodicData.daily);
    } else{
        document.getElementById("hourlyForecast").innerHTML = renderCityHourlyFc(periodicData);
        document.getElementById("dailyForecast").innerHTML = renderCityDailyForecast(periodicData);
    }
}
// function clearVal(){
//     iconElement.innerHTML = "";
//     tempElement.innerHTML = "";
//     descElement.innerHTML = "";
//     cityElement.innerHTML = "";
//     countryElement.innerHTML = ` ,`;
//     feelsLikeElement.innerHTML = "";
//     windElement.innerHTML = "";
//     humidityElement.innerHTML = "";
//     resultsHTML = "";
// }

//render the hourly forecast-1
function renderHourlyForecast(fcData) {

    let resultsHTML = "<tr><th>Time</th><th>Condition</th><th>Temp</th></tr>";
    let rowcount = "";
    rowcount = fcData.length;
    if (rowcount > 5) {
        rowcount = 5;
    }

    for (i = 0; i < rowcount; i++) {

        let ts = new Date(fcData[i].dt * 1000);
        let wIcon = "";
        let summary = "";
        let tempVal = 0;
        let timeValue;
        let windSpeed = "";

        //unix time needs to be formatted for display
        let hours = ts.getHours();
        if (hours > 0 && hours <= 12) {
            timeValue = "" + hours;
        } else if (hours > 12) {
            timeValue = "" + (hours - 12);
        } else if (hours == 0) {
            timeValue = "12";
        }
        timeValue += (hours >= 12) ? " PM" : " AM"; // get AM/PM
        weather.temperature.value = Math.floor(fcData[i].temp - KELVIN);
        wIcon = fcData[i].weather[0].icon;
        pic = `<img src="icons/${wIcon}.png" width= "18px" height = "18px"/>`
        summary = fcData[i].weather[0].description;
        tempVal = `${weather.temperature.value}°C`;
        windSpeed = `${fcData[i].wind_speed}m/s`;
        resultsHTML += renderRow(timeValue, pic, tempVal);

    }

    return resultsHTML;
}
//render the City hourly forecast-2
function renderCityHourlyFc(fcData) {

    let resultsHTML = "<tr><th>Time</th><th>Condition</th><th>Temp</th></tr>";
    let rowcount = "";
    rowcount = fcData.length;
    if (rowcount > 5) {
        rowcount = 5;
    }

    for (i = 0; i < rowcount; i++) {

        let ts = new Date(fcData[i].dt * 1000);
        let wIcon = "";
        let summary = "";
        let tempVal = 0;
        let timeValue;
        let windSpeed = "";

        //unix time needs to be formatted for display
        let hours = ts.getHours();
        if (hours > 0 && hours <= 12) {
            timeValue = "" + hours;
        } else if (hours > 12) {
            timeValue = "" + (hours - 12);
        } else if (hours == 0) {
            timeValue = "12";
        }
        timeValue += (hours >= 12) ? " PM" : " AM"; // get AM/PM
        weather.temperature.value = Math.floor(fcData[i].main.temp - KELVIN);
        wIcon = fcData[i].weather[0].icon;
        pic = `<img src="icons/${wIcon}.png" width= "18px" height = "18px"/>`
        // summary = fcData[i].weather[0].description;
        tempVal = `${weather.temperature.value}°C`;
        windSpeed = `${fcData[i].wind_speed}m/s`;
        resultsHTML += renderRow(timeValue, pic, tempVal);

    }

    return resultsHTML;
}
//render the weekly forecast-1
function renderDailyForecast(fcData) {

    let resultsHTML = "<tr><th>Day</th><th>Condition</th><th>Temp</th></tr>";
    let rowcount = "";
    rowcount = fcData.length;
    if (rowcount > 5) {
        rowcount = 6;
    }

    for (i = 1; i < rowcount; i++) {

        let ts = new Date(fcData[i].dt * 1000);
        let tempVal = 0;
        let wIcon = "";
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let dayTime = days[ts.getDay()];
        wIcon = fcData[i].weather[0].icon;
        pic = `<img src="icons/${wIcon}.png" width= "18px" height = "18px"/>`
        // let summary = fcData.data[i].summary;
        weather.temperature.value = Math.floor(fcData[i].temp.max - KELVIN);
        tempVal = `${weather.temperature.value}°C`;
        // let tempHigh = `${Math.round(fcData.data[i].temperatureHigh)}&deg`;
        // let tempLow = `${Math.round(fcData.data[i].temperatureLow)}&deg`;

        resultsHTML += renderRow(dayTime, pic, tempVal);
    }

    return resultsHTML;
}
//render the city's weekly forecast-2
function renderCityDailyForecast(fcData) {

    let resultsHTML = "<tr><th>Day</th><th>Condition</th><th>Temp</th></tr>";
    let rowcount = "";
    rowcount = fcData.length;
    if (rowcount > 5) {
        rowcount = 40;
    }
    let firstItem = 0;
    for (i = 0; i < rowcount; i++) {
        let prevDate = i===0?fcData[i].dt_txt.substring(0, 10):fcData[i-1].dt_txt.substring(0, 10);
        if(prevDate!=fcData[i].dt_txt.substring(0, 10)){
            firstItem = 1;
            let ts = new Date(fcData[i].dt * 1000);
            let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            let dayTime = days[ts.getDay()];
            wIcon = fcData[i].weather[0].icon;
            pic = `<img src="icons/${wIcon}.png" width= "18px" height = "18px"/>`
            // let summary = fcData.data[i].summary;
            weather.temperature.value = Math.floor(fcData[i].main.temp - KELVIN);
            tempVal = `${weather.temperature.value}°C`;
            // let tempHigh = `${Math.round(fcData.data[i].temperatureHigh)}&deg`;
            // let tempLow = `${Math.round(fcData.data[i].temperatureLow)}&deg`;    
           resultsHTML += renderRow(dayTime, pic, tempVal);
        }
        
    }

    return resultsHTML;
}

//function to render grid colums
function renderRow(timeValue, wIcon, tempVal) {
    return `<tr><td>${timeValue}</td><td>${wIcon}</td><td>${tempVal}</td></tr>`
}

function dateBuilder (d) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day}, ${date} ${month} ${year}`;
  }
//convert C to F
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) +32;
}
//when user clicks on temperature element
tempElement.addEventListener("click", function(){
    if(weather.temperature.val === undefined) return;

    if(weather.temperature.unit == "celsius"){
        console.log("geoloc before F temp value", weather.temperature.val);
        let fahrenheit = celsiusToFahrenheit(weather.temperature.val);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.val}°<span>C</span>`;
        weather.temperature.unit = "celsius"
        
    }
})
