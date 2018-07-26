const Discord = require("discord.js");
const client = new Discord.Client();
client.on("ready", () => {
  client.user.setActivity("Victini is down for maintainance.");
  client.user.setStatus("dnd");
});
client.login(process.env.TOKEN);