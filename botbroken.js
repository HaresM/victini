const Discord = require("discord.js");
const client = new Discord.Client();
client.on('ready', () => {
  client.user.setGame("Victini is currently broken use furret for the time being");
  client.user.setStatus("dnd");
})
client.login(process.env.BOT_TOKEN);
