const express = require('express');
const app = express();
app.get("/", (request, response) => {
  // console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);

// discord.js libary and client setup
const Discord = require("discord.js");
const client = new Discord.Client();

// Dependancies
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");

require("./modules/functions.js")(client);

client.logger = require("./modules/logger");
client.config = require("./config/config.js");
client.commands = new Enmap();
client.aliases = new Enmap();
client.settings = new Enmap({name: "settings"});

const init = async () => {

  const commands = await readdir("./commands/");
  client.logger.log(`Loading a total of ${commands.length} commands.`);
  commands.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });
  
  const events = await readdir("./events/");
  client.logger.log(`Loading a total of ${events.length} events.`);
  events.forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  });
  
    client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(process.env.TOKEN);

};

init();