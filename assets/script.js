const apiKey = "d31df2b15d8794b32878041c2acc62e1";
// ^-- Please never do this IRL - especially if your credit card is attached to it
const input = document.getElementById("search-input");
const button = document.getElementById("search-button");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const currentTemp = document.getElementById("currentTemp");
const currentWind = document.getElementById("currentWind");
const currentHumidity = document.getElementById("currentHumidity");
const fiveDayContainer = document.getElementById("fiveDayForecast");
const previousSearchBtns = document.getElementById("previousSearchBtns");

// Getting city with latitude and longitude
function getGeo(city) {
  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
  fetch(geoURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      saveSearch(data[0].name);
      const latitude = data[0].lat;
      const longitude = data[0].lon;
      getCurrentWeather(latitude, longitude);
      getForecastWeather(latitude, longitude);
    });
}

function getCurrentWeather(lat, lon) {
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetch(currentWeatherURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      displayCurrentWeather(data); // Placed here instead of under 34, because it would fetch before it would be done
    });
}

function getForecastWeather(lat, lon) {
  const forecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetch(forecastWeatherURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      displayForecastWeather(data.list); // Placed here instead of under 34, because it would fetch before it would be done
    });
}

function displayCurrentWeather(data) {
  cityName.textContent =
    data.name + " " + new Date(data.dt * 1000).toLocaleDateString();
  weatherIcon.src =
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
  currentTemp.textContent = "Temp: " + data.main.temp + "°F";
  currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";
  currentWind.textContent = "Wind Speed: " + data.wind.speed + "mph";
}

function displayForecastWeather(list) {
  fiveDayContainer.innerHTML = "";
  for (let i = 7; i < list.length; i += 8) {
    const currentDay = list[i];
    fiveDayContainer.innerHTML += `
    <div class="col">
    <h3>${new Date(currentDay.dt * 1000).toLocaleDateString()}</h3>
    <img src="https://openweathermap.org/img/wn/${
      currentDay.weather[0].icon
    }.png" />
    <p>Temp: ${currentDay.main.temp}°F</p>
    <p>Humidity: ${currentDay.main.humidity}%</p>
    <p>Wind Speed: ${currentDay.wind.speed}mph</p>
    </div>
    `;
  }
}

function saveSearch(previousCity) {
  console.log(previousCity);
  const previousSearches =
    JSON.parse(localStorage.getItem("previousCitySearch")) || [];
  if (previousSearches.includes(previousCity)) {
    return;
  }
  previousSearches.push(previousCity);
  localStorage.setItem("previousCitySearch", JSON.stringify(previousSearches));
  renderPreviousBtns();
}

function renderPreviousBtns() {
  const previousSearches =
    JSON.parse(localStorage.getItem("previousCitySearch")) || [];
  previousSearchBtns.innerHTML = "";
  for (i = 0; i < previousSearches.length; i++) {
    const button = document.createElement("button");
    const currentCity = previousSearches[i];
    button.textContent = currentCity;
    button.addEventListener("click", function () {
      getGeo(currentCity);
    });
    previousSearchBtns.append(button);
  }
}

renderPreviousBtns();

button.addEventListener("click", function () {
  console.log("Search Button Clicked", input.value);
  getGeo(input.value);
});

// .value property // https://www.w3schools.com/jsref/prop_text_value.asp
// getting text inside of an 'input'
