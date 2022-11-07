function pickGame(games){
    const rndInt = Math.floor(Math.random() * games.length)

    return "Play " + games[rndInt]
}

module.exports.pickGame = pickGame;