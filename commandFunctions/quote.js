const qotdURL = "https://zenquotes.io/api/today/";

async function genQuote() {
    var qotd = ""

      const response = await fetch(qotdURL);
      var data = await response.json();
      qotd = '"' + data[0].q + '" - ' + data[0].a;

    return qotd
  }

  module.exports.genQuote = genQuote