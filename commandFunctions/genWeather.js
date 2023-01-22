const weatherURL = "https://api.openweathermap.org/data/2.5/weather?zip=";

async function genWeather(zip) {
    let weather = "";
    const response = await fetch(weatherURL + zip + process.env.weatherID);
    var data = await response.json();
    if (data.cod === "400") weather = "Invalid zip code";
    else if (data.cod === "404") weather = "City not found";
    else {
      weather =
        "Weather for " +
        data.name +
        "\n\nTemp: " +
        Math.round(data.main.temp) +
        "°F\nHigh/Low: " +
        Math.round(data.main.temp_max) +
        "°F/" +
        Math.round(data.main.temp_min) +
        "°F\nHumidity: " +
        Math.round(data.main.humidity) +
        "%\nWind: " +
        Math.round(data.wind.speed) +
        "mph";
    }
    return weather;
  }

  module.exports.genWeather = genWeather