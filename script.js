//api key: 2e2402e031527e1ced45dbbe88d99f0a

// SELECT ELEMENTS
const searchElement = document.querySelector(".search-btn");
const cityElement = document.querySelector(".city");
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
const KELVIN = 273;
// API KEY
const key = "2e2402e031527e1ced45dbbe88d99f0a";

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
    console.log("hi")
if(input.value === "")
    navigator.geolocation.getCurrentPosition(setPosition, showError);
    //  getWeather(latitude, longitude);
else
    getSearchWeather(input.value);
})
function getSearchWeather(city){
   // var city = input.value;

    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then (function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.feels= Math.floor(data.main.feels_like- KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.wind = data.wind.speed;
            weather.humidity = data.main.humidity;
        })
        .then (function(){
            displayWeather();
        });
}
function getWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then (function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.feels= Math.floor(data.main.feels_like- KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.wind = data.wind.speed;
            weather.humidity = data.main.humidity;
        })
        .then (function(){
            displayWeather();
        });
}
//display weather to UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    cityElement.innerHTML = `${weather.city}, ${weather.country} `;
    feelsLikeElement.innerHTML = ` ${weather.feels}`;
    windElement.innerHTML = ` ${weather.wind}`;
    humidityElement.innerHTML = ` ${weather.humidity}`;
    let now = new Date();
    dateElement.innerHTML = dateBuilder(now);
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
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
})
