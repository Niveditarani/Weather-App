# Weather-App

Hey there!

I’ve created this functional weather web app purely using HTML5, CSS3 and vanilla JavaScript(No frameworks). The API provider is https://openweathermap.org/ and the beautiful icons being used is created by the Graphics Designer Ashley Jager. Link to her repo: https://github.com/manifestinteractive/weather-underground-icons
To prevent from exposing my API key resulting in unwanted use of my free monthly calls or having my app temporarily blocked or, worse yet, a larger than expected bill at the end of the month I’ve secured it by storing my API key credentials using node.js and calling the proxy of API key from the client JavaScript.
This app initially fetches the weather information using geolocation API. Displays the icon, weather status, temperature value in °C which can be toggle to Fahrenheit and user’s city & time zone.
For this Weather App, I’ve used cloud based services like Heroku & Netlify, that supports node.js and free web hosting. 
Challenges that I faced while developing this web app:
-->	Limitations in using free subscription APIs of Openweathermap. E:g- To fetch the weekly forecast data using search by city name details were omitted in the API documentation. Rather it was mentioned as 3hrs data for the next five days (i.e., forecast for every 3hrs in 24hrs * 5days). So, to fetch the data I had to write my own business logic to parse through the array count of 40. 
 ![image](https://user-images.githubusercontent.com/72278830/111210454-8f115600-85cd-11eb-8cfa-23013857716c.png)

What I learnt while developing this app:
1.	Foremost, the debugging skill.  Using breakpoints to understand the flow, googling the error and fixing the bug. Still a long way to go.
2.	API integration. Understanding basics of request and response. Fetch() method, endpoints, JSON objects. 
3.	Patience and perseverance in spite of making a lot of mistakes, writing bad codes and getting trapped into lots of logical labyrinths. I didn’t give up.
