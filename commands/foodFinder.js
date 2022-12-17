require("dotenv/config");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: process.env.yelpKey,
  },
};

function findFood(location, price, catergory, distance) {
  var locationURL = "location=" + location;
  var priceURL = "&price=" + price;
  var categoryURL = "&term=" + catergory;
  var distanceURL = "&radius=" + distance;

  fetchURL =
    "https://api.yelp.com/v3/businesses/search?" +
    location +
    categoryURL +
    distanceURL +
    priceURL +
    "sort_by=best_match&limit=10";
    console.log(fetchURL)
  fetch(fetchURL, options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}

module.exports.findFood = findFood;
