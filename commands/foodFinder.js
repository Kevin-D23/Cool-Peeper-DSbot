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
  var priceURL = ""
  var categoryURL = "&term=" + catergory;
  var distanceURL = ""

  if (price != 0)
    priceURL = "&price=" + price;

  if (distance != 0) 
    distanceURL = "&radius=" + toMiles(distance)

  fetchURL =
    "https://api.yelp.com/v3/businesses/search?" +
    locationURL +
    categoryURL +
    distanceURL +
    priceURL +
    "&sort_by=best_match&limit=10";
    console.log(fetchURL)
  fetch(fetchURL, options)
    .then((response) => response.json())
    .then((response) => {
        
    })
    .catch((err) => console.error(err));
}

function toMiles(distanceMeters){
    return distanceMeters * 1609;
}

module.exports.findFood = findFood;
