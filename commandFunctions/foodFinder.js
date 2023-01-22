require("dotenv/config");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: process.env.yelpKey,
  },
};

async function findFood(location, price, catergory, numResults) {
  var locationURL = "location=" + location;
  var priceURL = ""
  var categoryURL = "&term=" + catergory;
  var numResultsURL = "&limit=" + numResults
  var resultMsg = ""

  if (price != 0)
    priceURL = "&price=" + price;

  fetchURL =
    "https://api.yelp.com/v3/businesses/search?" +
    locationURL +
    categoryURL +
    priceURL +
    "&sort_by=best_match" +
    numResultsURL;


  return await fetch(fetchURL, options)
    .then((response) => response.json())
    .then((response) => {
      if(response.error)
        return response.error.description

        response.businesses.map((restaurant) => {
          var numStars = ""
          resultMsg += restaurant.name + " " + restaurant.price + " "
          for(var i = 0; i < Math.floor(restaurant.rating); i++)
             numStars += "★"
          while(numStars.length != 5)
            numStars += "☆"

          resultMsg += numStars + "\n"
          restaurant.location.display_address.forEach((address) => resultMsg += address + " ")
          resultMsg += "\n[Link](" + restaurant.url + ")\n\n" 
        })

        resultMsg += "Random choice: "

        let randNum = Math.floor(Math.random() * response.businesses.length)

        resultMsg += response.businesses[randNum].name
        return resultMsg
    })
    .catch((err) => console.log(err))

}


module.exports.findFood = findFood;