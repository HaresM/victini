const Discord = require("discord.js");
const client = new Discord.Client();
client.on("message", (message) => {
  if (message.content.startsWith("v.")) {
    message.channel.send("Victini is currently broken use furret for the time being");
  }
});
client.on("ready", () => {
  client.user.setGame("Victini is currently broken use furret for the time being");
  client.user.setStatus("dnd");
})
client.login(process.env.BOT_TOKEN);
