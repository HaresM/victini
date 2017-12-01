const Discord = require("discord.js");
const client = new Discord.Client();
client.on("message", (message) => {
  if (message.content.startsWith("v.furret")) {
    return message.channel.send("Invite Link To Furret:\nhttps://discordapp.com/oauth2/authorize?&client_id=370889343843434497&scope=bot&permissions=8");
  }
  if (message.content.startsWith("v.")) {
    if (message.author.id === 311534497403371521) {
      message.channel.send("Hares to disable this mode change ur procfile to point back to index.js instead of botbroken.js")
    }
    message.channel.send("Victini is currently broken use furret for the time being.\nFor furret's invite link do v.furret");
  }
});
client.on("ready", () => {
  client.user.setGame("Victini is currently broken use furret for the time being");
  client.user.setStatus("dnd");
})
client.login(process.env.BOT_TOKEN);
