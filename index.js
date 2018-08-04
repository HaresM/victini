const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  //console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 200000);
// Dependancies
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const weather = require("weather-js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./database/db.sqlite');
const ytdl = require('ytdl-core');
const google = require('googleapis')
const opus = require("opusscript");
const Enmap = require('enmap');
const Set = require("es6-set");
var Long = require("long");
let prefix = "v.";
const talkedRecently = new Set();
var userInventory = JSON.parse(fs.readFileSync('database/inventory.json', 'utf8'));
//client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
//client.on("debug", (e) => console.info(e));
// Functions
function isBotExec(member) {
  return hasRole(member, "Victini Exec") || member.user.id == member.guild.ownerID || member.user.id === "311534497403371521";
}

function hasRole(member, role) {
  var _role = member.guild.roles.find("name", role);
  try {
    return member.roles.has(_role.id)
  } catch (Error) {
    return !1
  }
}

function rand(int) {
  return Math.floor(Math.random() * parseInt(int));
}
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function getAbility(ability) {
  return `[${ability.replace(`_`, ` `)}](https://bulbapedia.bulbagarden.net/wiki/${ability}_(Ability\\))`;
}

function createtable(tableinfo, indexname, tablename, indexeditem) {
  sql.prepare(tableinfo).run();
  sql.prepare(`CREATE UNIQUE INDEX ${indexname} ON ${tablename} (${indexeditem});`).run();
  sql.pragma("synchronous = 1");
  sql.pragma("journal_mode = wal");
}
client.on("ready", () => {
  console.log("I'm online.");
  client.user.setActivity("Type v.help!");
  // Database
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
  const settings = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'settings';").get();
  const victimGameTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'victimGameScores';").get();
  if (!table['count(*)']) {
    createtable("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);", "idx_scores_id", "scores", "id");
  }
  if (!settings['count(*)']) {
    createtable("CREATE TABLE settings (guild TEXT PRIMARY KEY, levelsys INTEGER, welcomemsg INTEGER, farewellmsg INTEGER);", "idx_settings_id", "settings", "guild");
  }
  if (!victimGameTable['count(*)']) {
    createtable("CREATE TABLE victimGameScores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, lives INTEGER, currency INTEGER);", "idx_victimGameScores_id", "victimGameScores", "id");
  }
  client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
  client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
  client.getSettings = sql.prepare("SELECT * FROM settings WHERE guild = ?");
  client.setSettings = sql.prepare("INSERT OR REPLACE INTO settings (guild, levelsys, welcomemsg, farewellmsg, prefix) VALUES (@guild, @levelsys, @welcomemsg, @farewellmsg, @prefix);");
  client.getVictimGameScore = sql.prepare("SELECT * FROM victimGameScores WHERE user = ? AND guild = ?");
  client.setVictimGameScore = sql.prepare("INSERT OR REPLACE INTO victimGameScores (id, user, guild, lives, currency) VALUES (@id, @user, @guild, @lives, @currency);");
});
client.on("guildCreate", guild => {
  const settings = {
    guild: guild.id,
    levelsys: 1,
    welcomemsg: 1,
    farewellmsg: 1,
    prefix: "v."
  }
  client.setSettings.run(settings)
  console.log(`Victini joined the ${guild.name} server, with ID ${guild.id.toString()}.`);
  var defaultChannel = guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
  var availableChannels = guild.channels.filter(channel => channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
  if (defaultChannel === null) {
    availableChannels.random().send('Hey, I am Victini. Nice to meet you! I am here to make your life easier and more fun, with handy commands and text-based adventures! Use the `v.help`-command to get information of my commands, prefix, and much more, and if you face any problems or have any questions in general, contact my creator, `Hares#5947`!');
  } else {
    defaultChannel.send('Hey, I am Victini. Nice to meet you! I am here to make your life easier and more fun, with handy commands and text-based adventures! Use the `v.help`-command to get information of my commands, prefix, and much more, and if you face any problems or have any questions in general, contact my creator, `Hares#5947`!');
  }
  var role = guild.roles.find("name", "Victini Exec");
  if (!role || role === undefined) {
    guild.createRole({
      name: 'Victini Exec',
      color: '#f9af0e',
      permissions: ["ADMINISTRATOR"],
      mentionable: !0
    })
  }
});
client.on("guildMemberAdd", member => {
  const settings = client.getSettings.get(member.guild.id);
  if (settings.welcomemsg == 1) {
    var defaultChannel = member.guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = member.guild.channels.filter(channel => channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'));
    if (defaultChannel === null) {
      availableChannels.random().send(member.user + ' has joined the server. Welcome!');
    } else {
      defaultChannel.send(member.user + ' has joined the server. Welcome!');
    }
  } else {
    console.log("Welcome msgs have been disabled in " + member.guild.name)
  }
});
client.on("guildMemberRemove", member => {
  const settings = client.getSettings.get(member.guild.id);
  if (settings.farewellmsg == 1) {
    var defaultChannel = member.guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = member.guild.channels.filter(channel => channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'));
    if (defaultChannel === null) {
      availableChannels.random().send(member.user.username + ' has left the server. RIP...!');
    } else {
      defaultChannel.send(member.user.username + ' has left the server. RIP...!');
    }
  } else {
    console.log("Farewell msgs have been disabled in " + member.guild.name)
  }
});
client.on("message", message => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;
  let score = client.getScore.get(message.author.id, message.guild.id);
  let settings = client.getSettings.get(message.guild.id);
  let victimGameScore = client.getVictimGameScore.get(message.author.id, message.guild.id);
  if (!score) {
    score = {
      id: `${message.guild.id}-${message.author.id}`,
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1
    }
  }
  if (!settings) {
    settings = {
      guild: message.guild.id,
      levelsys: 1,
      welcomemsg: 1,
      farewellmsg: 1,
      prefix: "v."
    }
    client.setSettings.run(settings)
  }
  prefix = settings.prefix
  if (settings.levelsys === 1) {
    if (message.content.indexOf(prefix) !== 0) {
      score.points++;
      const curLevel = Math.floor(0.5 * Math.sqrt(score.points));
      if (score.level < curLevel) {
        message.channel.send(`Congrats, ${message.author}! You've leveled up to level **${curLevel}**!`);
        score.level = curLevel;
      }
      if (score.level > curLevel) {
        if (score.level === 1)
          return
        const msg = message.channel.send("Your level doesn't match up with the level you are supposed to have at your amount of xp. Please wait a moment while I recalculate your level.").then(score.level = curLevel).then(msg => {
          msg.edit(`Congrats, ${message.author}! You've leveled up to level **${curLevel}**!`)
        });
      }
      client.setScore.run(score);
    }
  };
  if (!victimGameScore) {
    victimGameScore = {
      id: `${message.guild.id}-${message.author.id}`,
      user: message.author.id,
      guild: message.guild.id,
      lives: 10,
      currency: 0
    }
  }
  if (!userInventory[message.author.id]) {
    userInventory[message.author.id] = {
      inventory: []
    }
  }
  if (victimGameScore.lives < 10) {
    setTimeout(() => {
      victimGameScore.lives++;
      client.setVictimGameScore.run(victimGameScore);
    }, 7200000);
  } else {
    victimGameScore.lives = victimGameScore.lives;
  }
  if (isBotExec(message.member)) {
    if (message.content.startsWith("v.resetprefix")) {
      settings.prefix = "v.";
      client.setSettings.run(settings);
      message.channel.send(`Prefix has successfully been reset back to ${settings.prefix}`);
    }
  }
  if (message.content === "(╯°□°）╯︵ ┻━┻") {
    message.channel.send("┬─┬ ノ( ゜-゜ノ)")
    score.tableflips++
    if (score.tableflips > 50)
      message.reply("STOP FLIPPING THE GOD DAMN TABLES")
  }
  if (message.content.toLowerCase().indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.toLowerCase().length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "help") {
    const helpfile = require('./help.js');
    helpfile(args[0], args, message, isBotExec);
  }
  if (command === "invite")
    message.channel.send("You can invite Victini to you server by clicking on the following link. Please note that Victini is still *in Beta*, and is buggy at the moment. For further inquiries, please contact user `Hares#5947`.\nhttps://discordapp.com/oauth2/authorize?client_id=372037843574456342&scope=bot&permissions=2146958591");
  if (command === "prefix")
    message.channel.send(`\`\`\`The default prefix of victini is v.\n\nYour server's prefix is ${settings.prefix}\nNote that this is case insensitive.\`\`\``);
  if (command === "lenny") {
    message.delete();
    message.channel.send("( ͡° ͜ʖ ͡°)");
  }
  if (command === "shrug") {
    message.delete();
    message.channel.send("¯\\_(ツ)_/¯");
  }
  if (command === "dead") {
    message.delete();
    message.channel.send("( ×ω× )");
  }
  if (command === "angry") {
    message.delete();
    message.channel.send("ヽ(#`Д´)ﾉ");
  }
  if (command === "shocked") {
    message.delete();
    message.channel.send("Σ(ﾟДﾟ；≡；ﾟдﾟ)");
  }
  if (command === "superlenny") {
    message.delete();
    message.channel.send("( ͡o ͜ʖ ͡o)");
  }
  if (command === "thinking")
    message.channel.send("https://cdn.discordapp.com/attachments/347376772951572490/364168246628188162/the_real_thinking_emoji.gif");
  if (command === "victim") {
    //lose a life
    const victim1 = JSON.parse(fs.readFileSync('database/victim.json')).victim1;
    //gain a life
    const victim2 = JSON.parse(fs.readFileSync('database/victim.json')).victim2;
    //gain 10 credits
    const victim3 = JSON.parse(fs.readFileSync('database/victim.json')).victim3;
    //lose 10 credits
    const victim4 = JSON.parse(fs.readFileSync('database/victim.json')).victim4;
    //neutral
    const victim5 = JSON.parse(fs.readFileSync('database/victim.json')).victim5;
    const outcomes = [1, 2, 3, 4, 5];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    const lives = victimGameScore.lives
    //autospacing
    function victim(victimnum) {
      if (victimnum === 1)
        victim = victim1[rand(victim1.length)]
      if (victimnum === 2)
        victim = victim2[rand(victim2.length)]
      if (victimnum === 3)
        victim = victim3[rand(victim3.length)]
      if (victimnum === 4)
        victim = victim4[rand(victim4.length)]
      if (victimnum === 5)
        victim = victim5[rand(victim5.length)]
      if (victim.charAt(0) === "'" || victim.charAt(0) === ",")
        return victim
      else
        return " " + victim
    }
    if (lives === 0) {
      message.channel.send(`You have 0 lives left!`);
      return;
    } else
    if (outcome === 1) {
      victimGameScore.lives -= 1;
      client.setVictimGameScore.run(victimGameScore);
      message.channel.send(message.member.user + victim(1) + ". You lost a life!");
    } else
    if (outcome === 2) {
      victimGameScore.lives++;
      client.setVictimGameScore.run(victimGameScore);
      message.channel.send(message.member.user + victim(2) + ". You gained a life!");
    } else
    if (outcome === 3) {
      victimGameScore.currency += 10;
      client.setVictimGameScore.run(victimGameScore);
      message.channel.send(message.member.user + victim(3) + ". You gained Ꝟ10!");
    }
    if (outcome === 4) {
      victimGameScore.currency -= 10;
      client.setVictimGameScore.run(victimGameScore);
      message.channel.send(message.member.user + victim(4) + ". You lost Ꝟ10!");
    }
    if (outcome === 5) {
      message.channel.send(message.member.user + victim(5) + ". And nothing happened.");
    }
  }
  if (command === "wheel") {
    const outcomes = [1, 2];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    var time = 21600000;
    var startTime = (new Date()).getTime();
    if (!talkedRecently.has(message.author.id)) {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, time);
      if (outcome === 1) {
        const prizes = [100, 100, 100, 100, 100, 200, 200, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 5000, 10000];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        message.channel.send(`You received **Ꝟ${prize}**!`);
        victimGameScore.currency += prize;
        client.setVictimGameScore.run(victimGameScore);
      } else
      if (outcome === 2) {
        const prizes = [1, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1000];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        if (prize == 1)
          message.channel.send(`You received **${prize} life**!`);
        if (prize === 1000)
          message.channel.send(`Here have **${prize} lives**! I have no idea what you will do with that many lives though victim possibly? ¯\\_(ツ)_/¯`);
        else
          message.channel.send(`You received **${prize} lives**!`);
        victimGameScore.lives = victimGameScore.lives + prize;
        client.setVictimGameScore.run(victimGameScore);
      }
    } else {
      var remainingTime = time - ((new Date()).getTime() - startTime);
      message.channel.send(`You can only use this command every 6 hours. Please try again later.`);
      return;
    }
  }
  if (command === "shop") {
    let itemInventory = userInventory[message.author.id].inventory;
    if (!args[0]) {
      const embed = new Discord.RichEmbed()
        .setTitle("Shop:")
        .setDescription(`Your current currency: Ꝟ${victimGameScore.currency}`)
        .setColor(0xf9af0e);
      if (score.level < 5) {
        embed.addField(`You need to be at least **level 5** in order to be able to purchase something from the shop!`);
      } else
      if (score.level >= 5 && score.level < 10) {
        embed.addField(`1`, `1 :heartpulse: \`(Ꝟ200)\``, true);
        embed.addField(`2`, `3 :heartpulse: \`(Ꝟ500)\``, true);
        embed.addField(`3`, `10 :heartpulse: \`(Ꝟ800)\``, true);
        embed.addField(`4`, `Golden Idol of Midas \`(Ꝟ1100)\``, true);
      } else
      if (score.level >= 10 && score.level < 35) {
        embed.addField(`1`, `1 :heartpulse: \`(Ꝟ200)\``, true);
        embed.addField(`2`, `3 :heartpulse: \`(Ꝟ500)\``, true);
        embed.addField(`3`, `10 :heartpulse: \`(Ꝟ800)\``, true);
        embed.addField(`4`, `Golden Idol of Midas \`(Ꝟ1100)\``, true);
        embed.addField(`5`, `The Golden Poop Emoji \`(Ꝟ1500)\``, true);
        embed.addField(`6`, `PokéBall of holiness \`(Ꝟ1700)\``, true);
        embed.addField(`7`, `Kirby's Yo-yo \`(Ꝟ2000)\``, true);
      } else {
        embed.addField(`1`, `1 :heartpulse: \`(Ꝟ200)\``, true);
        embed.addField(`2`, `3 :heartpulse: \`(Ꝟ500)\``, true);
        embed.addField(`3`, `10 :heartpulse: \`(Ꝟ800)\``, true);
        embed.addField(`4`, `Golden Idol of Midas \`(Ꝟ1100)\``, true);
        embed.addField(`5`, `The Golden Poop Emoji \`(Ꝟ1500)\``, true);
        embed.addField(`6`, `PokéBall of holiness \`(Ꝟ1700)\``, true);
        embed.addField(`7`, `Kirby's Yo-yo \`(Ꝟ2000)\``, true);
        embed.addField(`8`, `Cluster of Magical Rats \`(Ꝟ2500)\``, true);
        embed.addField(`9`, `Easter Islans Statue \`(Ꝟ6000)\``, true);
        embed.addField(`10`, `Preserved Loaf Of Bread from Pompeii \`(Ꝟ10000)\``, true);
      }
      return message.channel.send({
        embed
      });
    }
    if (victimGameScore.currency <= 0) {
      message.channel.send(`You don't have enough currency!`);
      return;
    } else
    if (score.level < 5) {
      return message.channel.send(`You need to be at least **level 5** in order to be able to purchase something from the shop!`);
    } else
    if (score.level >= 5 && score.level < 10) {
      const embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor(0xf9af0e);
      if (args[0] == 1 && victimGameScore.currency >= 200) {
        embed.addField(`Purchased Item`, `1 :heartpulse:`, true);
        embed.addField(`Cost`, `Ꝟ200`, true);
        victimGameScore.lives = victimGameScore.lives + 1;
        client.setVictimGameScore.run(victimGameScore);
        victimGameScore.currency -= 200;
        client.setVictimGameScore.run(victimGameScore);
      } else
      if (args[0] == 2 && victimGameScore.currency >= 500) {
        embed.addField(`Purchased Item`, `3 :heartpulse:`, true);
        embed.addField(`Cost`, `Ꝟ500`, true);
        victimGameScore.lives = victimGameScore.lives + 3;
        client.setVictimGameScore.run(victimGameScore);
        victimGameScore.currency -= 500;
        client.setVictimGameScore.run(victimGameScore);
      } else
      if (args[0] == 3 && victimGameScore.currency >= 700) {
        embed.addField(`Purchased Item`, `10 :heartpulse:`, true);
        embed.addField(`Cost`, `Ꝟ800`, true);
        victimGameScore.lives = victimGameScore.lives + 10;
        client.setVictimGameScore.run(victimGameScore);
        victimGameScore.currency -= 700;
        client.setVictimGameScore.run(victimGameScore);
      } else
      if (args[0] == 4 && victimGameScore.currency >= 1100 && itemInventory.indexOf("Golden Idol of Midas") == -1) {
        itemInventory.push("Golden Idol of Midas");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency -= 1100;
        client.setVictimGameScore.run(victimGameScore);
        embed.addField(`Purchased Item`, `Golden Idol of Midas`, true);
        embed.addField(`Cost`, `Ꝟ1100`, true);
      } else {
        return message.channel.send("You can't purchase this item.");
      }
      embed.setTimestamp();
      return message.channel.send({
        embed
      });
    } else
    if (score.level >= 10 && score.level < 35) {
      const embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor(0xf9af0e);
      if (args[0] == 1 && victimGameScore.currency >= 200) {
        embed.addField(`Purchased Item`, `1 :heartpulse:`, true);
        embed.addField(`Cost`, `Ꝟ200`, true);
        victimGameScore.lives = victimGameScore.lives + 1;
        client.setVictimGameScore.run(victimGameScore);
        victimGameScore.currency -= 200;
        client.setVictimGameScore.run(victimGameScore);
      } else
      if (args[0] == 2 && victimGameScore.currency >= 500) {
        embed.addField(`Purchased Item`, `3 :heartpulse:`, true);
        embed.addField(`Cost`, `Ꝟ500`, true);
        victimGameScore.lives = victimGameScore.lives + 3;
        client.setVictimGameScore.run(victimGameScore);
        victimGameScore.currency -= 500;
        client.setVictimGameScore.run(victimGameScore);
      } else
      if (args[0] == 3 && victimGameScore.currency >= 700) {
        embed.addField(`Purchased Item`, `10 :heartpulse:`, true);
        embed.addField(`Cost`, `Ꝟ800`, true);
        victimGameScore.lives = victimGameScore.lives + 10;
        client.setVictimGameScore.run(victimGameScore);
        victimGameScore.currency -= 700;
        client.setVictimGameScore.run(victimGameScore);
      } else
      if (args[0] == 4 && victimGameScore.currency >= 1100 && itemInventory.indexOf("Golden Idol of Midas") == -1) {
        itemInventory.push("Golden Idol of Midas");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency -= 1100;
        client.setVictimGameScore.run(victimGameScore);
        embed.addField(`Purchased Item`, `Golden Idol of Midas`, true);
        embed.addField(`Cost`, `Ꝟ1100`, true);
      } else
      if (args[0] == 5 && victimGameScore.currency >= 1500 && itemInventory.indexOf("The Golden Poop Emoji") == -1) {
        itemInventory.push("The Golden Poop Emoji");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency -= 1500;
        client.setVictimGameScore.run(victimGameScore);
        embed.addField(`Purchased Item`, `The Golden Poop Emoji`, true);
        embed.addField(`Cost`, `Ꝟ1500`, true);
      } else
      if (args[0] == 6 && victimGameScore.currency >= 1700 && itemInventory.indexOf("PokéBall of holiness") == -1) {
        itemInventory.push("PokéBall of holiness");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency -= 1700;
        client.setVictimGameScore.run(victimGameScore);
        embed.addField(`Purchased Item`, `PokéBall of holiness`, true);
        embed.addField(`Cost`, `Ꝟ1700`, true);
      } else
      if (args[0] == 7 && victimGameScore.currency >= 2000 && itemInventory.indexOf("Kirdby's Yo-yo") == -1) {
        itemInventory.push("Kirby's Yo-yo");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency -= 2000;
        client.setVictimGameScore.run(victimGameScore);
        embed.addField(`Purchased Item`, `Kirby's Yo-yo"`, true);
        embed.addField(`Cost`, `Ꝟ2000`, true);
      } else {
        return message.channel.send("You can't purchase this item.");
      }
      embed.setTimestamp();
      return message.channel.send({
        embed
      });
    } else {
      const embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor(0xf9af0e);
      if (args[0] == 1 && victimGameScore.currency >= 200) {
        embed.addField(`Purchased Item`, `1 :heartpulse:`, true);
        embed.addField(`Cost`, `Ꝟ200`, true);
        victimGameScore.lives = victimGameScore.lives + 1;
        client.setVictimGameScore.run(victimGameScore);
        victimGameScore.currency -= 200;
        client.setVictimGameScore.run(victimGameScore);
      } else
      if (args[0] == 2 && victimGameScore.currency >= 500) {
        embed.addField(`Purchased Item`, `3 :heartpulse:`, true);
        embed.addField(`Cost`, `Ꝟ500`, true);
        victimGameScore.lives = victimGameScore.lives + 3;
        client.setVictimGameScore.run(victimGameScore);
        victimGameScore.currency -= 500;
        client.setVictimGameScore.run(victimGameScore);
      } else
      if (args[0] == 3 && victimGameScore.currency >= 700) {
        embed.addField(`Purchased Item`, `10 :heartpulse:`, true);
        embed.addField(`Cost`, `Ꝟ800`, true);
        victimGameScore.lives = victimGameScore.lives + 10;
        client.setVictimGameScore.run(victimGameScore);
        victimGameScore.currency -= 700;
        client.setVictimGameScore.run(victimGameScore);
      } else
      if (args[0] == 4 && victimGameScore.currency >= 1100 && itemInventory.indexOf("Golden Idol of Midas") == -1) {
        itemInventory.push("Golden Idol of Midas");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency -= 1100;
        client.setVictimGameScore.run(victimGameScore);
        embed.addField(`Purchased Item`, `Golden Idol of Midas`, true);
        embed.addField(`Cost`, `Ꝟ1100`, true);
      } else
      if (args[0] == 5 && victimGameScore.currency >= 1500 && itemInventory.indexOf("The Golden Poop Emoji") == -1) {
        itemInventory.push("The Golden Poop Emoji");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency -= 1500;
        client.setVictimGameScore.run(victimGameScore);
        embed.addField(`Purchased Item`, `The Golden Poop Emoji`, true);
        embed.addField(`Cost`, `Ꝟ1500`, true);
      } else
      if (args[0] == 6 && victimGameScore.currency >= 1700 && itemInventory.indexOf("Holy PokéBall") == -1) {
        itemInventory.push("Holy PokéBall");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency -= 1700;
        client.setVictimGameScore.run(victimGameScore);
        embed.addField(`Purchased Item`, `Holy`, true);
        embed.addField(`Cost`, `Ꝟ1700`, true);
      } else
      if (args[0] == 7 && victimGameScore.currency >= 2000 && itemInventory.indexOf("Kirdby's Yo-yo") == -1) {
        itemInventory.push("Kirby's Yo-yo");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency = victimGameScore.currency - 2000;
        client.setVictimGameScore.run(victimGameScore);
        embed.addField(`Purchased Item`, `Kirby's Yo-yo"`, true);
        embed.addField(`Cost`, `Ꝟ2000`, true);
      } else
      if (args[0] == 8 && victimGameScore.currency >= 2500 && itemInventory.indexOf("Cluster of Rats (Divine Edition)") == -1) {
        itemInventory.push("Cluster of Rats (Divine Edition)");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency = victimGameScore.currency - 2500;
        client.setVictimGameScore.run(victimGameScore);
        embed.addField(`Purchased Item`, `Cluster of Rats (Divine Edition)`, true);
        embed.addField(`Cost`, `Ꝟ2500`, true);
      } else
      if (args[0] == 9 && victimGameScore.currency >= 6000 && itemInventory.indexOf("Magical Eastern Island Statue") == -1) {
        itemInventory.push("Magical Easter Island Statue");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency -= 6000;
        embed.addField(`Purchased Item`, `Magical Easter Islans Statue`, true);
        embed.addField(`Cost`, `Ꝟ6000`, true);
      } else
      if (args[0] == 10 && victimGameScore.currency >= 10000 && itemInventory.indexOf("Preserved Load of Bread from Pompeii") == -1) {
        itemInventory.push("Preserved Loaf of Bread from Pompeii");
        fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
          if (err) console.log(err);
        });
        victimGameScore.currency -= 10000;
        client.setVictimGameScore.run(victimGameScore);
        embed.addField(`Purchased Item`, `Preserved Loaf Of Bread from Pompeii`, true);
        embed.addField(`Cost`, `Ꝟ10000`, true);
      } else {
        return message.channel.send("You can't purchase this item.");
      }
      embed.setTimestamp();
      return message.channel.send({
        embed
      });
    }
  }
  if (command === "inventory") {
    var itemDescs = [{
        "item": "Golden Idol of Midas",
        "desc": "This statue is incrusted with incomprehensible writings all over its solid, golden surface. It shines superbly bright when exposed to sunlight and most likely used to trigger a death boulder somewhere inside a jungle temple."
      },
      {
        "item": "The Golden Poop Emoji",
        "desc": "This artifact of modern culture is truly the masterpiece binding together every era of mankind, it is the epitome of artistic accomplishments, the peak of virtuosity, a monument for years to come dedicated to the art of sculpture. You look into its eyes and its smile absolutely blinds and baffles you."
      },
      {
        "item": "Holy PokéBall",
        "desc": "This majestic PokéBall is even more powerful than the MasterBall. It can only be used by people who's heart is made out of pure Uranium."
      },
      {
        "item": "Kirby's Yo-yo",
        "desc": "Using this special yo-yo will instantly give you special yo-yo skils, and a purple baseball cap, as well as a bandage magically appear on your face as well."
      },
      {
        "item": "Cluster of Rats (Divine Edition)",
        "desc": "When Doraemon's tears accidentally fell on the original Japanese sculpture of rats, it began radiating a mystical light. It is said to grant superpowers to anyone who dares to lick it's surface."
      },
      {
        "item": "Magical Easter Island Statue",
        "desc": "This special Easter Island statue will follow you around wherever you go, even in your dreams, and will always be loyal to you. Its face has an odly disturbing smile on it. Rumors suggest that it has seen things it cannot unsee."
      },
      {
        "item": "Preserved Loaf of Bread from Pompeii",
        "desc": "This piece of bread is said to be around since the dawn of time. One bite of it will provide enough kinetic energy to shoot you to infinity and beyond. It is said that its core consists of all the secrets of the universe."
      }
    ];
    let itemInventory = userInventory[message.author.id].inventory;
    var searchItem = itemInventory[args[0] - 1];

    function getDescription(item) {
      return itemDescs.filter(
        function (itemDescs) {
          return itemDescs.item == item
        }
      );
    }
    var getDesc = function (item) {
      var i = null;
      for (i = 0; itemDescs.length > i; i += 1) {
        if (itemDescs[i].item === item) {
          return itemDescs[i].desc;
        }
      }
    };
    var description = getDesc(searchItem);
    if (args[0] > itemInventory.length || args[0] < 0) return message.channel.send("You do not own this item.");
    if (!args[0]) {
      const embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle("Your inventory")
        .setColor(0xf9af0e)
        .setDescription("To get information on an item, do `v.inventory [number in front of item]`");
      for (var i = 0; i < itemInventory.length; i++) {
        embed.addField(`${i + 1}:`, `${itemInventory[i]}`, true);
      }
      embed.setTimestamp();
      return message.channel.send({
        embed
      });
    }
    if (args[0]) {
      const embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`${itemInventory[args[0] - 1]}`)
        .setColor(0xf9af0e);
      embed.addField(`Description:`, `${description}`);
      return message.channel.send({
        embed
      });
    }
  }
  if (command === "hug") {
    const hugArray = ['1. You can do better.', '2. It\'s a start. ¯\\_(ツ)_/¯', '3. We\'re getting there.', '4. Now we\'re talking!', '5. This is getting spoopy.', '6. Your power is admirable.', '7. Simply... Amazing... o_0', '8. Everyone, evacuate this server!'];
    const randomReply = Math.floor(Math.random() * hugArray.length);
    let member = message.mentions.members.first();
    if (!member)
      return message.channel.send("Mention the user you want to hug.");
    message.channel.send(member + " recieved a hug from " + message.author + ", with power " + hugArray[randomReply]);
  }
  if (command === "weather") {
    if (args.length === 0) return message.channel.send('Please specify a location.');
    weather.find({
      search: args.join(" "),
      degreeType: 'C'
    }, function (err, result) {
      if (err) message.channel.send(err);
      if (result.length === 0) {
        message.channel.send('Location not found! Please specify a valid location.');
        return
      }
      const current = result[0].current;
      const location = result[0].location;
      if (location.timezone > 0)
        var timezone = "+" + location.timezone;
      if (location.timezone <= 0)
        timezone = location.timezone;
      var tmp = fs.readFileSync('database/colors.json');
      var colours = JSON.parse(tmp);
      var colour = colours[current.skytext];
      if (!colour) {
        colour = 0xff9e30;
      }
      const embed = new Discord.RichEmbed().setDescription(`**${current.skytext}**`).setAuthor(`Weather for ${current.observationpoint}`).setThumbnail(current.imageUrl).setColor(colour).addField('Timezone', `UTC ${timezone}`, !0).addField('Degree Type', location.degreetype, !0).addField('Temperature', `${current.temperature} Degrees`, !0).addField('Feels Like', `${current.feelslike} Degrees`, !0).addField('Winds', current.winddisplay, !0).addField('Humidity', `${current.humidity}%`, !0);
      message.channel.send({
        embed
      })
    })
  }
  if (command === "convert") {
    const temperature = args[1];
    const celsius = (temperature - 32) * (5 / 9);
    const fahrenheit = (temperature * (9 / 5)) + 32;
    if (!args[0]) {
      message.channel.send("Please provide the type of conversion.");
      return
    }
    if (!args[1]) {
      message.channel.send("Please enter the ammount that you want to convert.");
      return
    }
    if (args[0] === "c") {
      message.channel.send(`\`${temperature}\` Degrees Fahrenheit is \`${celsius}\` Degrees Celsius.`);
    } else if (args[0] === "f") {
      message.channel.send(`\`${temperature}\` Degrees Celsius is \`${fahrenheit}\` Degrees Fahreinheit.`);
    } else {
      message.channel.send("Temperature could not be converted.")
    }
  }
  if (command === "dex") {
    if (args[0] == undefined) {
      message.channel.send(`Specify what Pokémon you want information for.`);
      return;
    }
    var file = fs.readFileSync('database/pokemon.json');
    var dat = JSON.parse(file);
    var poke = dat[args[0].capitalize()];
    var i;
    if (poke == undefined || poke == null) return;
    var tmp = fs.readFileSync('database/colors.json');
    var colors = JSON.parse(tmp);
    var color = colors[poke.type1.toLowerCase()];
    var types = `**Types:** ${poke.type1} ${poke.type2 != "Unknown" && poke.type2 != undefined ? `| ${poke.type2}` : ""}`;
    var s = poke.stats
    var stats = `**Base Stats**: ${s[0]} | ${s[1]} | ${s[2]} | ${s[3]} | ${s[4]} | ${s[5]}`;
    var abilities = `Normal: ${getAbility(poke.ability1)} ${poke.ability2 != undefined ? "| " + getAbility(poke.ability2) : ""}`;
    var height = `**Height**: ${poke.height}`;
    var weight = `**Weight**: ${poke.weight}`;
    var genderratio = `**Gender Ratio**: `
    if (poke.genderratio == "Genderless") {
      genderratio += `Genderless`;
    } else {
      var female = parseFloat(poke.genderratio.split('%')[0]);
      var male = parseFloat(parseFloat(100) - female);
      genderratio += `\nMale: ${male}%\nFemale: ${female}%`
    }
    var growthrate = `**Growth Rate**: ${poke.levelingrate}`;
    var exp = `**Base EXP**: ${poke.base_exp}`;
    var catchrate = `**Catch Rate**: ${poke.catchrate}`;
    var evyield = `**EV Yield**: `;
    var evs = [];
    var _stats = [`HP`, `Atk`, `Def`, `SpAtk`, `SpDef`, `Speed`]
    for (i = 0; i < poke.evyield.length; i++) {
      if (poke.evyield[i] > 0) {
        evs.push(`${poke.evyield[i]} ${_stats[i]}`);
      }
    }
    evyield += evs.join(', ');
    evyield.split(',')
      .splice(-1, 1)
      .join(',');
    var hatchtime = `${poke.hatchtime} steps`
    var shuffle = poke.shuffle;
    var image = poke.url;
    var evolutions = "";
    if (poke.evolutions != undefined && poke.evolutions.length > 0) {
      evolutions = poke.evolutions.join("\n");
      evolutions += "\n";
    }
    var kind = `${args[0].capitalize() == "Type:" ? "Type: Null" : args[0].capitalize()}, the ${poke.kind} Pokémon.`;
    var desc = poke.desc;
    var embed = {
      embed: {
        color: color,
        title: `🡒${poke.species}: ${args[0].capitalize()}`,
        url: `https://bulbapedia.bulbagarden.net/wiki/${args[0].capitalize()}_(Pok%C3%A9mon)`,
        description: `${types}\n${stats}\n**Abilities:**\n${abilities}${poke.hiddenability != undefined ? `\nHidden: ${getAbility(poke.hiddenability)}` : ""}\n${height}\n${weight}\n${genderratio}\n${growthrate}\n${exp}\n${catchrate}\n${evyield}\n${hatchtime}\n**Evolutions:**\n${evolutions}\n${kind}\n\`\`\`${desc}\`\`\``,
        image: {
          "url": `https://` + image
        }
      }
    }
    if (shuffle != undefined && shuffle != null && shuffle != "") {
      embed["embed"]["thumbnail"] = {
        "url": `https://` + shuffle
      }
    }
    message.channel.send(embed);
  }
  if (command === "helper") {
    message.channel.send("https://cdn.discordapp.com/attachments/320716421757927436/376351118449573909/sketch1509192675057.png");
  }
  if (command === "8ball") {
    if (!args[0])
      return message.channel.send("Please pose a question to the 8ball");
    const magicArray = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful.", "Follow the seahorse."];
    const randomReply = Math.floor(Math.random() * magicArray.length);
    message.channel.send(`${magicArray[randomReply]}`)
  }
  if (command === "reminder") {
    var remindTime = args[0] * 60 * 1000;
    var remindText = args.slice(1).join(" ");
    if (remindTime < 0)
      return message.channel.send("Please provide a number equal to or larger than 0.");
    if (!remindTime)
      return message.channel.send("Please provide the amount of time *in minutes* after which you want to be reminded.");
    if (!remindText)
      return message.channel.send("Please provide something you want to be reminded of.");
    message.channel.send(`You will be reminded to \`${remindText}\`, after \`${args[0]}\` minutes.`);
    setTimeout(function () {
      message.author.send(`Reminder to: \`\`\`${remindText}\`\`\``);
    }, remindTime)
  }
  if (settings.levelsys === 1) {
    if (command === "top" || command === "lead" || command === "leaderboard") {
      const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC;").all(message.guild.id);
      const embed = new Discord.RichEmbed()
        .setTitle("__Leaderboard__")
        .setDescription("**Top 10 users (ranked by level):**")
        .setColor(0xf9af0e);
      let i = 0;
      for (const data of top10) {
        i++
        if (i <= 10) {
          embed.addField(`${i}: ${client.users.get(data.user).username}`, `Level ${data.level} (${data.points} EXP)`);
        }
        if (data.user === message.author.id && i > 10) {
          embed.addField(`${i}: ${client.users.get(data.user).username}`, `Level ${data.level} (${data.points} EXP)`);
        }
      }
      return message.channel.send({
        embed
      });
    }
    if (command === "score" || command === "scores" || command === "points") {
      const rank = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC;").all(message.guild.id);
      const levelup = Math.pow((score.level + 1) * 2, 2) - score.points;
      const embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor(0xf9af0e);
      embed.addField(`Level:`, `Level ${score.level}`, true);
      embed.addField(`Experience:`, `${score.points} EXP *(${levelup} EXP away from leveling up)*`, true);
      let i = 0;
      for (const data of rank) {
        i++;
        if (data.user === message.author.id) {
          embed.addField(`Rank:`, `#${i}`, true);
        }
      }
      embed.addField(`Lives:`, `${victimGameScore.lives} :heartpulse:`, true);
      embed.addField(`Currency:`, `Ꝟ${victimGameScore.currency}`, true);
      embed.setTimestamp()
      return message.channel.send({
        embed
      });
    }
  }
  if (settings.levelsys === 0 && command === "score" || command === "top" || command === "scores" || command === "points" || command === "lead" || command === "leaderboard") {
    message.channel.send("The level system has been disabled in this server")
  }
  if (isBotExec(message.member)) {
    if (command === "count") {
      if (args[0] === "members") {
        message.channel.send(`This server has \`${message.guild.memberCount}\` members.`);
      } else if (args[0] === "servers") {
        message.channel.send(`I am in \`${client.guilds.size.toLocaleString()}\` servers.`);
      } else if (args[0] === "channels") {
        message.channel.send(`This server has \`${message.guild.channels.size.toLocaleString()}\` channels.`);
      } else {
        message.channel.send("Type the following commands to make me count stuff:\n```v.count members\nv.count channels\nv.count servers\`\`\`");
      }
    }
    if (command === "say") {
      const sayMessage = args.join(" ");
      message.delete()
      message.channel.send(sayMessage);
    }
    if (command === "kick") {
      let member = message.mentions.members.first();
      if (!member)
        return message.channel.send("Please mention a valid member of this server");
      if (!member.kickable)
        return message.channel.send("The specified user could not be kicked.");
      let reason = args.slice(1).join(' ');
      if (!reason)
        return message.channel.send("Please indicate a reason for the kick!");
      member.kick(reason).then(message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag}, because: of the following reason: \`\`\`${reason}\`\`\``))
    }
    if (command === "ban") {
      let member = message.mentions.members.first();
      if (!member)
        return message.channel.send("Please mention a valid member of this server");
      if (!member.bannable)
        return message.channel.send("The specified user could not be banned.");
      let reason = args.slice(1).join(' ');
      if (!reason)
        return message.channel.send("Please indicate a reason for the ban!");
      message.guild.ban(member, reason).then(message.channel.send(`${member.user.tag} has been banned by ${message.author.tag}, because: of the following reason: \`\`\`${reason}\`\`\``))
    }
    if (command === "unban") {
      let member = args[0];
      if (!member)
        return message.channel.send("Please specify a valid user id.");
      let reason = args.slice(1).join(' ');
      if (!reason)
        return message.channel.send("Please indicate a reason for the unban!");
      message.guild.unban(member, reason).then(message.channel.send(`${member} has been unbanned by ${message.author.tag}, because: of the following reason: \`\`\`${reason}\`\`\``))
    }
    if (command === "clear") {
      const deleteCount = args[0];
      if (!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.channel.send("Please provide a number between 2 and 100 for the number of messages to delete.");
      message.channel.bulkDelete(deleteCount);
    }
    if (command === "settings") {
      if (settings.levelsys === 1) {
        var levelsysstatus = "Enabled";
      }
      if (settings.levelsys === 0) {
        var levelsysstatus = "Disabled";
      }
      if (settings.welcomemsg === 1) {
        var welcomemsgstatus = "Enabled";
      }
      if (settings.welcomemsg === 0) {
        var welcomemsgstatus = "Disabled";
      }
      if (settings.farewellmsg === 1) {
        var farewellmsgstatus = "Enabled";
      }
      if (settings.farewellmsg === 0) {
        var farewellmsgstatus = "Disabled";
      }
      if (!args[0]) {
        message.channel.send(`Server status:\`\`\`Leveling System [levels]: ${levelsysstatus}\nWelcome messages [welcomemsg]: ${welcomemsgstatus}\nFarewell messages [farewellmsg]: ${farewellmsgstatus}\nPrefix: ${settings.prefix}\n\nTo disable a setting, do v.settings disable [levels/farewellmsg/welcomemsg].\nTo enable a setting, do v.settings enable [levels/farewellmsg/welcomemsg].\nTo change the prefix do v.settings prefix "your new prefix".\`\`\``);
      }
      if (args[0] === "enable") {
        if (args[1] === "levels") {
          if (settings.levelsys === 0) {
            settings.levelsys = 1;
            client.setSettings.run(settings);
            message.channel.send("Leveling system successfully enabled.");
          } else if (settings.levelsys === 1) {
            message.channel.send("Leveling system is already enabled.");
          }
        }
        if (args[1] === "welcomemsg") {
          if (settings.welcomemsg === 0) {
            settings.welcomemsg = 1;
            client.setSettings.run(settings);
            message.channel.send("Welcome message successfully enabled.");
          } else if (settings.welcomemsg === 1) {
            message.channel.send("Welcome messages are already enabled.");
          }
        }
        if (args[1] === "farewellmsg") {
          if (settings.farewellmsg === 0) {
            settings.farewellmsg = 1;
            client.setSettings.run(settings);
            message.channel.send("Farewell message successfully enabled.")
          } else if (settings.farewellmsg === 1) {
            message.channel.send("Farewell messages are already enabled.");
            console.log(settings.farewellmsg);
            settings.farewellmsg = 1;
            client.setSettings.run(settings);
          }
        } else {
          message.channel.send("You can enable: ```v.settings enable levels\nv.settings enable welcomemsg\nv.settings enable farewellmsg```");
        }
      } else
      if (args[0] === "disable") {
        if (args[1] === "levels") {
          if (settings.levelsys === 1) {
            settings.levelsys = 0;
            client.setSettings.run(settings);
            message.channel.send("Leveling system successfully disabled.")
          } else if (settings.levelsys == 0) {
            message.channel.send("Leveling system is already disabled.");
          }
        }
        if (args[1] === "welcomemsg") {
          if (settings.welcomemsg === 1) {
            settings.welcomemsg = 0;
            client.setSettings.run(settings)
            message.channel.send("Welcome message successfully disabled.");
          } else if (settings.welcomemsg === 0) {
            message.channel.send("Welcome messages are already disabled.");
          }
        }
        if (args[1] === "farewellmsg") {
          if (settings.farewellmsg === 1) {
            settings.farewellmsg = 0;
            client.setSettings.run(settings);
            message.channel.send("Farewell message successfully disabled.");
          } else if (settings.farewellmsg === 0) {
            message.channel.send("Farewell messages are already disabled.");
          }
        } else {
          message.channel.send("You can disable: ```v.settings disable levels\nv.settings disable welcomemsg\nv.settings disable farewellmsg```");
        }
      }
      if (args[0] === "prefix") {
        settings.prefix = args[1].toLowerCase();
        client.setSettings.run(settings);
        message.channel.send(`Prefix has successfully been changed to ${settings.prefix}`);
      }
    }
    if (command === "give") {
      var user = message.mentions.members.first();
      if (!user) {
        return message.channel.send("Mention the user you want to give something to.");
      }
      let score = client.getScore.get(user.id, message.guild.id);
      if (!score) {
        score = {
          id: `${message.guild.id}-${user.id}`,
          user: user.id,
          guild: message.guild.id,
          points: 0,
          level: 1
        }
      }
      const toAdd = parseInt(args[2], 10);
      if (!args[1])
        return message.channel.send("State what you want to give the user. You can choose between: ```v.give [@user] levels\nv.give [@user] exp\nv.give [@user] currency```");
      if (!toAdd)
        return message.channel.send("Specify the amount you want to give.");
      if (args[1] === "levels") {
        score.level += toAdd;
        client.setScore.run(score);
        message.channel.send(`Successfully gave user ${user} \`${toAdd}\` Level(s)`);
      } else
      if (args[1] === "exp") {
        score.points += toAdd;
        score.level = Math.floor(0.5 * Math.sqrt(score.points));
        client.setScore.run(score);
        message.channel.send(`Successfully gave user ${user} \`${toAdd}\` EXP.`);
      } else
      if (args[1] === "currency") {
        victimGameScore.currency += toAdd;
        client.setVictimGameScore.run(victimGameScore);
        message.channel.send(`Successfully gave user ${user} \`${toAdd}\` currency.`);
      } else {
        return message.channel.send("State what you want to give the user. You can choose between: ```v.give [@user] levels\nv.give [@user] exp\nv.give [@user] currency```");
      }
    }
  }
  // Not working for some unknown reason.
  // if (command === "reset") {
  //   var user = message.mentions.members.first();
  //   if (!user) {
  //     return message.channel.send("Mention the user you want to reset.");
  //   }
  //   score = client.getScore.get(user.id, message.guild.id);
  //   score.points = 0;
  //   score.level = 1;
  //   client.setScore.run(score);
  //   message.channel.send(`Successfully reset user ${user}`);
  // }
  if (message.author.id === "311534497403371521" || message.author.id === "272986016242204672") {
    if (command === "restart") {
      const embed = new Discord.RichEmbed()
        .setTitle('Done.')
        .setDescription(`Restarted in **${Math.floor(client.ping)}**ms`);
      message.channel.send(embed).then(() => {
        process.exit(1);
      })
    }
    if (command === "announce") {
      const announcement = args.join(" ");
      if (!announcement) return message.channel.send(`Please enter a message that you would like to send to all servers the bot is a part of.`);
      client.guilds.forEach(guild => {
        var defaultChannel = guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
        var availableChannels = guild.channels.filter(channel => channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
        if (!defaultChannel) {
          availableChannels.random().send(announcement);
        } else {
          defaultChannel.send(announcement);
        }
      });
    }
  }
  if (message.guild.id === "265381707312660480") {
    const guildspecific = require('./guildspecific.js');
    guildspecific(command, args, message);
  }
});
client.login(process.env.TOKEN);