const todayContainer = document.getElementById("today-container");
const weekdaysContainer = document.getElementById("weekdays");
const apiUrl =
  "http://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=ad72cba3e69f19b6bfee096375f2b3f9";
const apiFiveDaysUrl =
  "https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=ad72cba3e69f19b6bfee096375f2b3f9";
fetch(apiUrl)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw "Ups, something went wrong!";
    }
  })

  .then((json) => {
    const timezoneOffset = new Date().getTimezoneOffset() * 60;
    const sunset = new Date(
      (json.sys.sunset + json.timezone + timezoneOffset) * 1000
    ).toLocaleString("se-SE", {
      hour: "numeric",
      minute: "numeric",
    });
    const sunrise = new Date(
      (json.sys.sunrise + json.timezone + timezoneOffset) * 1000
    ).toLocaleString("se-SE", {
      hour: "numeric",
      minute: "numeric",
    });

    const hr = new Date().getHours();
    let isDay;
    if (hr > json.sys.sunrise || hr < json.sys.sunset) {
      isDay = true;
    } else {
      isDay = false;
    }

    todayContainer.innerHTML += `
      <div class="today-information">
        <div class="today-temp-container">
          <span class="today-temp">${Math.round(json.main.temp)}</span>
          <span class="temp-unit">&#8451;</span>
        </div>
        <div class="location">${json.name}</div>
        <div class="description">${json.weather[0].description}</div>
      </div>
      <div class="day-night">
        <img class="icon" src="./assets/images/${isDay ? "sun" : "moon"}.svg" />
      </div>
      <div class="sunrise-sunset">
        <span>sunrise</span>
        <span>${sunrise}</span>
        <span>sunset</span>
        <span>${sunset}</span>
      </div>
    `;
  })
  .catch((error) => (todayContainer.innerHTML += `${error}`));

fetch(apiFiveDaysUrl)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw "Ups, something went wrong!";
    }
  })
  .then((json) => {
    const filteredForecast = json.list.filter((item) =>
      item.dt_txt.includes("12:00")
    );
    filteredForecast.forEach((item) => {
      let iconSrc = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
      let weekday = new Date(item.dt_txt).toLocaleString("en-US", {
        weekday: "short",
      });

      weekdaysContainer.innerHTML += `
        <div class="weekdays-container">
          <span class="weekdays-name">${weekday}</span>
          <img src=${iconSrc} class="weekdays-icon" />
          <span class="weekdays-temp">
            <span>${Math.round(item.main.temp_max)}</span>
            /
            <span>${Math.round(item.main.temp_min)}</span>
            <span>&#8451;</span> 
          </span>
        </div>
      `;
    });
  })
  .catch((error) => (weekdaysContainer.innerHTML += `${error}`));
