function pickGame(games){
    const rndInt = Math.floor(Math.random() * 5)

    return "Play " + games[rndInt]
}

module.exports.pickGame = pickGame;