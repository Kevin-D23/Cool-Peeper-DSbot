function pickGame(games){
    const rndInt = Math.floor(Math.random() * games.length)

    return "Play " + games[rndInt]
}

function pickHero(role) {
    const tanks = ['D.Va', 'Doomfist', 'Junker Queen', 'Orisa', 'Reinhardt', 'Roadhog', 'Sigma', 'Winston', 'Wrecking Ball', 'Zarya']
    const dps = ['Ashe', 'Bastion', 'Cassidy', 'Echo', 'Genji', 'Hanzo', 'Junkrat', 'Mei', 'Pharah', 'Reaper', 'Sojourn', 'Soldier: 76', 'Sombra', 'Symmetra', 'Torbjörn', 'Tracer', 'Widowmaker']
    const supports = ['Ana', 'Baptiste', 'Brigitte', 'Kiriko', 'Lúcio', 'Mercy', 'Moira', 'Zenyatta']

    if(role === 'tank') 
        return tanks[Math.floor(Math.random() * (tanks.length))]
    else if (role === 'dps') 
        return tanks[Math.floor(Math.random() * (dps.length))]
    else if (role === 'support')
        return tanks[Math.floor(Math.random() * (supports.length))]
}

module.exports.pickGame = pickGame;
module.exports.pickHero = pickHero