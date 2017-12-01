const Discord = require("discord.js");
const client = new Discord.Client();
client.on("message", (message) => {
  if (message.content.startsWith("v.")) {
    message.channel.send("Victini is currently broken use furret for the time being.\nFor furret's invite link do v.furret");
  }
  if (message.content.startsWith("v.furret")) {
    message.channel.send("Invite Link To Furret:\nhttps://discordapp.com/oauth2/authorize?&client_id=370889343843434497&scope=bot&permissions=8");
  }
});
client.on("ready", () => {
  client.user.setGame("Victini is currently broken use furret for the time being");
  client.user.setStatus("dnd");
})
client.login(process.env.BOT_TOKEN);
