

async function flipOffPlayer(client) {
    var date = new Date();
    if (date.getHours() === 0 && date.getMinutes() === 0) {
      const channel = await client.guilds.resolve(process.env.guildID);
      channel.members.fetch().then(async (members) => {
        const randNum = Math.floor(Math.random() * channel.memberCount);
        let user = members.at(randNum).id;
        const generalChannel = await client.channels.fetch(process.env.generalID);
        generalChannel.send({ content: `🖕fuck you <@${user}>🖕` });
      });
    }
  }

  module.exports.flipOffPlayer = flipOffPlayer