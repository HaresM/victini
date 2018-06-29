const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
    //console.log(Date.now() + " Just got pinged!");
    response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 300000);

// Dependancies

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const weather = require("weather-js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');
const ytdl = require('ytdl-core');
const google = require('googleapis')
const opus = require("opusscript");
const Enmap = require('enmap');
const Set = require("es6-set");
var Long = require("long");

const prefix = "v.";

const talkedRecently = new Set();
var userInventory = JSON.parse(fs.readFileSync('database/inventory.json', 'utf8'));

client.on("error", (e) => console.error(e));
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

String.prototype.capitalize = function() {
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
    const wheelTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'wheelScores';").get();

    if (!table['count(*)']) {
        createtable("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);", "idx_scores_id", "scores", "id");
    }
    if (!settings['count(*)']) {
        createtable("CREATE TABLE settings (guild TEXT PRIMARY KEY, levelsys INTEGER, welcomemsg INTEGER, farewellmsg INTEGER);", "idx_settings_id", "settings", "guild");
    }
    if (!victimGameTable['count(*)']) {
        sql.prepare("CREATE TABLE victimGameScores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, lives INTEGER);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_victimGameScores_id ON victimGameScores (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    if (!wheelTable['count(*)']) {
        sql.prepare("CREATE TABLE wheelScores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, currency INTEGER);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_wheelScores_id ON wheelScores (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }

    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
    client.getSettings = sql.prepare("SELECT * FROM settings WHERE guild = ?");
    client.setSettings = sql.prepare("INSERT OR REPLACE INTO settings (guild, levelsys, welcomemsg, farewellmsg) VALUES (@guild, @levelsys, @welcomemsg, @farewellmsg);");
    client.getVictimGameScore = sql.prepare("SELECT * FROM victimGameScores WHERE user = ? AND guild = ?");
    client.setVictimGameScore = sql.prepare("INSERT OR REPLACE INTO victimGameScores (id, user, guild, lives) VALUES (@id, @user, @guild, @lives);");
    client.getWheelScore = sql.prepare("SELECT * FROM wheelScores WHERE user = ? AND guild = ?");
    client.setWheelScore = sql.prepare("INSERT OR REPLACE INTO wheelScores (id, user, guild, currency) VALUES (@id, @user, @guild, @currency);");
});



client.on("guildCreate", guild => {
    const settings = {
        guild: guild.id,
        levelsys: 1,
        welcomemsg: 1,
        farewellmsg: 1
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
    if (settings.welcomemsg === 1) {
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
    if (settings.farewellmsgs === 1) {
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
    let wheelScore = client.getWheelScore.get(message.author.id, message.guild.id);
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
            farewellmsg: 1
        }
        client.setSettings.run(settings)
    }
    if (settings.levelsys === 1) {
        if (message.content.indexOf(prefix) !== 0) {

            score.points++;

            const curLevel = Math.floor(0.5 * Math.sqrt(score.points));

            if (score.level < curLevel) {

                message.channel.send(`Congrats, ${message.author}! You've leveled up to level **${curLevel}**!`);
                score.level++;
            }
            client.setScore.run(score);
        }
    };
    if (!victimGameScore) {
        victimGameScore = {
            id: `${message.guild.id}-${message.author.id}`,
            user: message.author.id,
            guild: message.guild.id,
            lives: 10
        }
    }
    if (!wheelScore) {
        wheelScore = {
            id: `${message.guild.id}-${message.author.id}`,
            user: message.author.id,
            guild: message.guild.id,
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

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.toLowerCase().length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();



    if (command === "help") {

        switch (args[0]) {
            case "gen-info":
                switch (args[1]) {
                    case "prefix":
                        message.channel.send("Victini's prefix is `v.`. Note that this is a *lower-case* \"v\"!");
                        break;
                    case "invite":
                        message.channel.send("You can invite Victini to you server by clicking on the following link. Please note that Victini is still *in Beta*, and is buggy at the moment. For further inquiries, please contact user `Hares#5947`.\nhttps://discordapp.com/oauth2/authorize?client_id=372037843574456342&scope=bot&permissions=2146958591");
                        break;
                    default:
                        message.channel.send("Type the following commands to get help on specific stuff:\n```v.help gen-info prefix\nv.help gen-info invite```");
                }
                break;
            case "commands":
                switch (args[1]) {
                    case "8ball":
                        message.channel.send("The `v.8ball`-command sends a reply to a question that can be answered with yes or no. You use this command as follows: `v.8ball` `[your yes/no question]`.");
                        break;
                    case "helper":
                        message.channel.send("The `v.helper`-command sends a image of Victini made by `#Greedere Ganciel#3872`.");
                        break;
                    case "face":
                        switch (args[2]) {
                            case "lenny":
                                message.channel.send("The `v.lenny`-command sends a lenny-face ( ( ͡° ͜ʖ ͡°) ). What more is there to say?");
                                break;
                            case "shrug":
                                message.channel.send("The `v.shrug`-command sends a shrug emoticon ( ¯\\_(ツ)_/¯ ).");
                                break;
                            case "dead":
                                message.channel.send("The `v.dead`-command sends a cute dead face ( ( ×ω× ) ).");
                                break;
                            case "angry":
                                message.channel.send("The `v.angry`-command sends an emoticon that represents an angry face ( ヽ(#`Д´)ﾉ )");
                                break;
                            case "shocked":
                                message.channel.send("The `v.shocked`-command sends an emoticon that represents an shocked face ( Σ(ﾟДﾟ；≡；ﾟдﾟ) )");
                                break;
                            case "superlenny":
                                message.channel.send("The `v.superlenny`-command sends sends a buffed up version of a lenny-face ( ( ͡o ͜ʖ ͡o) )");
                                break;
                            default:
                                message.channel.send("Type the following commands to get help on specific stuff:\n```v.help commands face lenny\nv.help commands face shrug\nv.help commands face superlenny\nv.help commands face dead\nv.help commands face angry\nv.help commands face shocked```");
                        }
                        break;
                    case "victim":
                        message.channel.send("Use the `v.victim`-command to test how lucky you are... or misfortunate... You can either lose a life, gain a life, or gain Ꝟ-currency by using this command. Simply type in `v.victim` and see what happens!");
                        break;
                    case "weather":
                        message.channel.send("The `v.weather`-command sends the weather of the location you specify. You use this command as follow: `v.weather` `[a real life location]`");
                        break;
                    case "convert":
                        message.channel.send("The `v.convert`-command converts a temperature to Degrees Celsius or Degrees Fahrenheit. If you want to convert `[a number]` to Degrees Fahrenheit, you use this command as follows: `v.convert` `f` `[a number]`. On the other hand, if you want to convert `[a number]` to Degrees Celsius, you use this command as follows: `v.convert` `c` `[a number]`.");
                        break;
                    case "hug":
                        message.channel.send("Use the `v.hug`-command to express your love to someone. Everytime this command is used, a number is given to the power of your hug. Can you hug with the most power? Use this command as follows: `v.hug` `@[user you want to hug]`");
                        break;
                    case "reminder":
                        message.channel.send("When using the `v.reminder`-command, you will receive a DM after the amount of specified time *in minutes* of something you wanted to be reminded of. Use this command as follows: `v.reminder` `[time in minutes, a number]` `[thing you want to be reminded of]`");
                        break;
                    case "score":
                        message.channel.send("Use the `v.score`-command to check your current level, your EXP and the amount of EXP needed to level up, your rank in the server (according to level), the amount of lives you have and the amount of Ꝟ-currency you have.");
                        break;
                    case "top":
                        message.channel.send("The `v.top`-command shows the top users in the server you use the command in, according to level. You can check your current level with the `v.level`-command!");
                        break;
                    case "wheel":
                        message.channel.send("Use the `v.wheel`-command to gain goodies such as extra lives and Ꝟ-currency every 6 hours!");
                        break;
                    case "shop":
                        message.channel.send("Use the `v.shop` command to buy goodies such as additional lives and collectibles, in exhange for Ꝟ-currency! Note that you can unlock items by leveling up. Use this command as follows: `v.shop` `[number in front of item you want to purchase`.");
                        break;
                    default:
                        message.channel.send("Type the following commands to get help on specific stuff:\n```v.help commands face\nv.help commands 8ball\nv.help commands helper\nv.help commands victim\nv.help commands wheel\nv.help commands weather\nv.help commands convert\nv.help commands hug\nv.help commands reminder\nv.help commands score\nv.help commands top```");
                }
                break;
            case "exec-only":
                if (isBotExec(message.member)) {
                    switch (args[1]) {
                        case "say":
                            message.channel.send("Use the `v.say`-command to let Victini mimic what you say. Use this command as follows: `v.say` `[the sentence you want Victini to repeat]`");
                            break;
                        case "kick":
                            message.channel.send("The `v.kick`-command kicks a user. It's that straightforward. Use this command as follows: `v.kick` `@[user you want to kick]` `[reason as to why you want to kick this person]`");
                            break;
                        case "clear":
                            message.channel.send("The `v.clear`-command deletes the amount of specified messages. Note that the command itself counts as a message as well. Use this command as follows: `v.clear` `[amount of messages you want to clear]`");
                            break;
                        case "give":
                            message.channel.send("The `v.give`-command allows Execs to give either `levels`, `exp` or `currency` to users in a server. Use this command as follows: `v.give` `@[user you want to give something to] `[level/exp/currency (choose 1)]` `[amount you want to give]`");
                            break;
                        default:
                            message.channel.send("Type the following commands to get further help:\n```v.help exec-only say\nv.help exec-only kick\nv.help exec-only clear```");
                    }
                } else
                    message.channel.send("Exec-only commands require the `Victini Exec`-role to be used.");
                break;
            default:
                message.channel.send("Type the following commands to get help on specific stuff:\n```v.help gen-info\nv.help commands\nv.help exec-only```")
        }
    }

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
    if (command === "thinking") {
        message.channel.send("https://cdn.discordapp.com/attachments/347376772951572490/364168246628188162/the_real_thinking_emoji.gif");
    }

    if (command === "victim") {
        const victim1 = JSON.parse(fs.readFileSync('database/victim1.json')).victim1;
        const victim2 = JSON.parse(fs.readFileSync('database/victim2.json')).victim2;
        const victim3 = JSON.parse(fs.readFileSync('database/victim3.json')).victim3;
        const outcomes = [1, 1, 2, 3, 3];
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        const lives = victimGameScore.lives

        if (lives === 0) {
            message.channel.send(`You have 0 lives left!`);
            return;
        } else
        if (outcome === 1) {
            victimGameScore.lives = victimGameScore.lives - 1;
            client.setVictimGameScore.run(victimGameScore);
            message.channel.send(message.member.user + " " + victim1[rand(victim1.length)] + ". You lost a life!");
        } else
        if (outcome === 2) {
            victimGameScore.lives++;
            client.setVictimGameScore.run(victimGameScore);
            message.channel.send(message.member.user + " " + victim2[rand(victim2.length)] + ". You gained a life!");
        } else
        if (outcome === 3) {
            wheelScore.currency = wheelScore.currency + 10;
            client.setWheelScore.run(wheelScore);
            message.channel.send(message.member.user + " " + victim3[rand(victim3.length)] + ". You gained Ꝟ10!");
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
                wheelScore.currency = wheelScore.currency + prize;
                client.setWheelScore.run(wheelScore);
            } else
            if (outcome === 2) {
                const prizes = [1, 3, 5];
                const prize = prizes[Math.floor(Math.random() * prizes.length)];
                message.channel.send(`You received **${prize} live(s)**!`);
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
                .setDescription(`Your current currency: Ꝟ${wheelScore.currency}`)
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
        if (wheelScore.currency <= 0) {
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
            if (args[0] == 1 && wheelScore.currency >= 200) {
                embed.addField(`Purchased Item`, `1 :heartpulse:`, true);
                embed.addField(`Cost`, `Ꝟ200`, true);
                victimGameScore.lives = victimGameScore.lives + 1;
                client.setVictimGameScore.run(victimGameScore);
                wheelScore.currency = wheelScore.currency - 200;
                client.setWheelScore.run(wheelScore);
            } else
            if (args[0] == 2 && wheelScore.currency >= 500) {
                embed.addField(`Purchased Item`, `3 :heartpulse:`, true);
                embed.addField(`Cost`, `Ꝟ500`, true);
                victimGameScore.lives = victimGameScore.lives + 3;
                client.setVictimGameScore.run(victimGameScore);
                wheelScore.currency = wheelScore.currency - 500;
                client.setWheelScore.run(wheelScore);
            } else
            if (args[0] == 3 && wheelScore.currency >= 700) {
                embed.addField(`Purchased Item`, `10 :heartpulse:`, true);
                embed.addField(`Cost`, `Ꝟ800`, true);
                victimGameScore.lives = victimGameScore.lives + 10;
                client.setVictimGameScore.run(victimGameScore);
                wheelScore.currency = wheelScore.currency - 700;
                client.setWheelScore.run(wheelScore);
            } else
            if (args[0] == 4 && wheelScore.currency >= 1100) {
                itemInventory.push("Golden Idol of Midas");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 1500;
                client.setWheelScore.run(wheelScore);
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
            if (args[0] == 1 && wheelScore.currency >= 200) {
                embed.addField(`Purchased Item`, `1 :heartpulse:`, true);
                embed.addField(`Cost`, `Ꝟ200`, true);
                victimGameScore.lives = victimGameScore.lives + 1;
                client.setVictimGameScore.run(victimGameScore);
                wheelScore.currency = wheelScore.currency - 200;
                client.setWheelScore.run(wheelScore);
            } else
            if (args[0] == 2 && wheelScore.currency >= 500) {
                embed.addField(`Purchased Item`, `3 :heartpulse:`, true);
                embed.addField(`Cost`, `Ꝟ500`, true);
                victimGameScore.lives = victimGameScore.lives + 3;
                client.setVictimGameScore.run(victimGameScore);
                wheelScore.currency = wheelScore.currency - 500;
                client.setWheelScore.run(wheelScore);
            } else
            if (args[0] == 3 && wheelScore.currency >= 700) {
                embed.addField(`Purchased Item`, `10 :heartpulse:`, true);
                embed.addField(`Cost`, `Ꝟ800`, true);
                victimGameScore.lives = victimGameScore.lives + 10;
                client.setVictimGameScore.run(victimGameScore);
                wheelScore.currency = wheelScore.currency - 700;
                client.setWheelScore.run(wheelScore);
            } else
            if (args[0] == 4 && wheelScore.currency >= 1100) {
                itemInventory.push("Golden Idol of Midas");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 1500;
                client.setWheelScore.run(wheelScore);
                embed.addField(`Purchased Item`, `Golden Idol of Midas`, true);
                embed.addField(`Cost`, `Ꝟ1100`, true);
            } else
            if (args[0] == 5 && wheelScore.currency >= 1500) {
                itemInventory.push("The Golden Poop Emoji");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 1500;
                client.setWheelScore.run(wheelScore);
                embed.addField(`Purchased Item`, `The Golden Poop Emoji`, true);
                embed.addField(`Cost`, `Ꝟ1500`, true);
            } else
            if (args[0] == 6 && wheelScore.currency >= 1700) {
                itemInventory.push("PokéBall of Holiness");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 1700;
                client.setWheelScore.run(wheelScore);
                embed.addField(`Purchased Item`, `PokéBall of holiness`, true);
                embed.addField(`Cost`, `Ꝟ1700`, true);
            } else
            if (args[0] == 7 && wheelScore.currency >= 2000) {
                itemInventory.push("Kirby's Yo-yo");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 2000;
                client.setWheelScore.run(wheelScore);
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
            if (args[0] == 1 && wheelScore.currency >= 200) {
                embed.addField(`Purchased Item`, `1 :heartpulse:`, true);
                embed.addField(`Cost`, `Ꝟ200`, true);
                victimGameScore.lives = victimGameScore.lives + 1;
                client.setVictimGameScore.run(victimGameScore);
                wheelScore.currency = wheelScore.currency - 200;
                client.setWheelScore.run(wheelScore);
            } else
            if (args[0] == 2 && wheelScore.currency >= 500) {
                embed.addField(`Purchased Item`, `3 :heartpulse:`, true);
                embed.addField(`Cost`, `Ꝟ500`, true);
                victimGameScore.lives = victimGameScore.lives + 3;
                client.setVictimGameScore.run(victimGameScore);
                wheelScore.currency = wheelScore.currency - 500;
                client.setWheelScore.run(wheelScore);
            } else
            if (args[0] == 3 && wheelScore.currency >= 700) {
                embed.addField(`Purchased Item`, `10 :heartpulse:`, true);
                embed.addField(`Cost`, `Ꝟ800`, true);
                victimGameScore.lives = victimGameScore.lives + 10;
                client.setVictimGameScore.run(victimGameScore);
                wheelScore.currency = wheelScore.currency - 700;
                client.setWheelScore.run(wheelScore);
            } else
            if (args[0] == 4 && wheelScore.currency >= 1100) {
                itemInventory.push("Golden Idol of Midas");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 1100;
                client.setWheelScore.run(wheelScore);
                embed.addField(`Purchased Item`, `Golden Idol of Midas`, true);
                embed.addField(`Cost`, `Ꝟ1100`, true);
            } else
            if (args[0] == 5 && wheelScore.currency >= 1500) {
                itemInventory.push("The Golden Poop Emoji");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 1500;
                client.setWheelScore.run(wheelScore);
                embed.addField(`Purchased Item`, `The Golden Poop Emoji`, true);
                embed.addField(`Cost`, `Ꝟ1500`, true);
            } else
            if (args[0] == 6 && wheelScore.currency >= 1700) {
                itemInventory.push("PokéBall of holiness");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 1700;
                client.setWheelScore.run(wheelScore);
                embed.addField(`Purchased Item`, `PokéBall of holiness`, true);
                embed.addField(`Cost`, `Ꝟ1700`, true);
            } else
            if (args[0] == 7 && wheelScore.currency >= 2000) {
                itemInventory.push("Kirby's Yo-yo");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 2000;
                client.setWheelScore.run(wheelScore);
                embed.addField(`Purchased Item`, `Kirby's Yo-yo"`, true);
                embed.addField(`Cost`, `Ꝟ2000`, true);
            } else
            if (args[0] == 8 && wheelScore.currency >= 2500) {
                itemInventory.push("Cluster of Magical Rats");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 2500;
                client.setWheelScore.run(wheelScore);
                embed.addField(`Purchased Item`, `Cluster of Magical Rats`, true);
                embed.addField(`Cost`, `Ꝟ2500`, true);
            } else
            if (args[0] == 9 && wheelScore.currency >= 6000) {
                itemInventory.push("Easter Islans Statue");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 6000;
                embed.addField(`Purchased Item`, `Easter Islans Statue`, true);
                embed.addField(`Cost`, `Ꝟ6000`, true);
            } else
            if (args[0] == 10 && wheelScore.currency >= 10000) {
                itemInventory.push("Preserved Loaf Of Bread from Pompeii");
                fs.writeFile('database/inventory.json', JSON.stringify(userInventory), (err) => {
                    if (err) console.log(err);
                });
                wheelScore.currency = wheelScore.currency - 10000;
                client.setWheelScore.run(wheelScore);
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
        let itemInventory = userInventory[message.author.id].inventory;
        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle("Your inventory")
            .setColor(0xf9af0e);
        for (var i = 0; i < itemInventory.length; i++) {
            embed.addField(`${i + 1}: ${userInventory[message.author.id].inventory[i]}`, `[Desc]`, true);
        }
        embed.setTimestamp();
        return message.channel.send({
            embed
        });
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
        }, function(err, result) {
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
            switch (current.skytext) {
                case 
                    colour = ;
                    break;
                case "Blowing Dust":
                    colour = 0x999999;
                    break;
                case "Mostly Clear":
                    colour = 0x66ccff;
                    break;
                case "Mostly Sunny":
                    colour = 0xffee42;
                    break;
                case "Partly Sunny":
                    colour = 0x3498db;
                    break;
                case "Cloudy":
                    colour = 0xc6c6cc;
                    break;
                case "T-Storms":
                    colour = 0x76767a;
                    break;
                default:
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
        if (message.content.startsWith(prefix + "8ball")) {
            const magicArray = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'I would not count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Are you done asking questions yet?', 'Why the fuck should I even know this?', 'The answer lies within yourself.', 'Why are you asking me?', 'Follow the seahorse.', 'Very doubtful.'];
            const randomReply = Math.floor(Math.random() * magicArray.length);
            message.channel.send(`${magicArray[randomReply]}`)
        }
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

        setTimeout(function() {
            message.author.send(`Reminder to: \`\`\`${remindText}\`\`\``);
        }, remindTime)
    }

    if (settings.levelsys === 1) {
        if (command === "top") {
            const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);

            const embed = new Discord.RichEmbed()
                .setTitle("__Leaderboard__")
                .setDescription("**Top 10 users (ranked by level):**")
                .setColor(0xf9af0e);
            let i = 0;
            for (const data of top10) {
                i++
                embed.addField(`${i}: ${client.users.get(data.user).username}`, `Level ${data.level} (${data.points} EXP)`);
            }
            return message.channel.send({
                embed
            });
        }
      
      if (command === "score") {
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
        embed.addField(`Currency:`, `Ꝟ${wheelScore.currency}`, true);
        embed.setTimestamp()
        return message.channel.send({
            embed
        });
    }
    }

    if (settings.levelsys === 0 && command === "score" || command === "top") {
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
            if (!member.kickable || member.user.id === "311534497403371521")
                return message.channel.send("The specified user could not be kicked.");
            let reason = args.slice(1).join(' ');
            if (!reason)
                return message.channel.send("Please indicate a reason for the kick!");
            message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag}, because: of the following reason: \`\`\`${reason}\`\`\``)
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
            if (args[0] === "status") {
                message.channel.send(`Server status:\`\`\`Leveling System: ${levelsysstatus}\nWelcome messages: ${welcomemsgstatus}\nFarewell messages: ${farewellmsgstatus}\`\`\``);
            } else
            if (args[0] === "enable") {
                if (args[1] === "levels") {
                    if (settings.levelsys === 0) {
                        settings.levelsys = 1;
                        client.setSettings.run(settings);
                        message.channel.send("Leveling system successfully enabled.");
                    } else if (settings.levelsys === 1) {
                        message.channel.send("Leveling system is already enabled.");
                    }
                } else
                if (args[1] === "welcomemsg") {
                    if (settings.welcomemsg === 0){
                        settings.welcomemsg = 1;
                        client.setSettings.run(settings);
                        message.channel.send("Welcome message successfully enabled.");
                    } else if (settings.welcomemsg === 1) {
                        message.channel.send("Welcome messages are already enabled.");
                    }
                } else
                if (args[1] === "farewellmsg") {
                    if (settings.farewellmsg === 0) {
                        settings.farewellmsg = 1;
                        client.setSettings.run(settings);
                      message.channel.send("Farewell message successfully enabled.")
                       
                    } else if (settings.farewellmsg === 1) {
                        message.channel.send("Farewell messages are already enabled.");
                    }
                } else {
                    message.channel.send("You can enable: ```v.settings enable levels\nv.settings enable welcomemsg\nv.settings.enable farewellmsg```");
                }
            } else
            if (args[0] === "disable") {
                if (args[1] === "levels") {
                    if (settings.levelsys === 1) {
                        settings.levelsys = 0;
                        client.setSettings.run(settings);
                      message.channel.send("Leveling system successfully disabled.")
                    } else if (settings.levelsys === 0) {
                        message.channel.send("Leveling system is already disabled.");
                    }
                } else
                if (args[1] === "welcomemsg") {
                    if (settings.welcomemsg === 1) {
                        settings.welcomemsg = 0;
                        client.setSettings.run(settings)
                      message.channel.send("Welcome message successfully disabled.");
                    } else if (settings.welcomemsg === 0) {
                        message.channel.send("Welcome messages are already disabled.");
                    }
                } else
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
            } else {
                message.channel.send("You can change the following settings: ```v.settings status\nv.settings enable\nv.settings.disable```");
            }
        }

        if (command === "give") {
            var user = message.mentions.members.first();

            const toAdd = parseInt(args[2], 10);
            if (!user) {
                return message.channel.send("Mention the user you want to give something to.");
            } else {
                let userCurrency = client.getWheelScore.get(user.id, message.guild.id);
                if (!score) {
                    score = {
                        id: `${message.guild.id}-${user.id}`,
                        user: user.id,
                        guild: message.guild.id,
                        points: 0,
                        level: 1
                    }
                }
                if (!wheelScore) {
                    wheelScore = {
                        id: `${message.guild.id}-${user.id}`,
                        user: user.id,
                        guild: message.guild.id,
                        currency: 0
                    }
                }
                if (!args[1]) {
                    return message.channel.send("State what you want to give the user. You can choose between: ```v.give [@user] levels\nv.give [@user] exp\nv.give [@user] currency```");
                }
                if (!toAdd) {
                    return message.channel.send("Specify the amount you want to give.");
                }
                if (args[1] === "levels") {
                    score.level += toAdd;
                    client.setScore.run(score);
                } else
                if (args[1] === "exp") {
                    score.points += toAdd;
                    score.level = Math.floor(0.5 * Math.sqrt(toAdd));
                    client.setScore.run(score);
                } else
                if (args[1] === "currency") {
                    wheelScore.currency += toAdd;
                    client.setWheelScore.run(wheelScore);
                } else {
                    return message.channel.send("State what you want to give the user. You can choose between: ```v.give [@user] levels\nv.give [@user] exp\nv.give [@user] currency```");
                }
            }
        }
    }

    if (message.author.id === "311534497403371521") {

        if (command === "restart") {
            const embed = new Discord.RichEmbed()
                .setTitle('Done.')
                .setDescription(`Restarted in **${Math.floor(client.ping)}**ms`);
            if (message.author.id !== '311534497403371521') return;
            message.channel.send(embed).then(() => {
                process.exit(1);
            })
        }

        if (command === "announce") {
            var announcement = args.join(" ");
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
        var spriterRole = message.guild.roles.find('name', 'Spriter');
        var mapperRole = message.guild.roles.find('name', 'Mapper');
        var coderRole = message.guild.roles.find('name', 'Coder');
        var writerRole = message.guild.roles.find('name', 'Writer');
        var composerRole = message.guild.roles.find('name', 'Composer');
        var redRole = message.guild.roles.find('name', 'red');
        var blueRole = message.guild.roles.find('name', 'blue');
        var yellowRole = message.guild.roles.find('name', 'yellow');
        var limeRole = message.guild.roles.find('name', 'lime');
        var purpleRole = message.guild.roles.find('name', 'purple');
        var pinkRole = message.guild.roles.find('name', 'pink');
        var orangeRole = message.guild.roles.find('name', 'orange');

        if (command === "role") {
            if (args[0] === "add") {
                if (args[1] === "spriter") {
                    message.member.addRole(spriterRole).then(message.channel.send('Successfully added the role: `Spriter`.'));
                } else
                if (args[1] === "coder") {
                    message.member.addRole(coderRole).then(message.channel.send('Successfully added the role: `Coder`.'));
                } else
                if (args[1] === "composer") {
                    message.member.addRole(composerRole).then(message.channel.send('Successfully added the role: `Composer`.'));
                } else
                if (args[1] === "mapper") {
                    message.member.addRole(mapperRole).then(message.channel.send('Successfully added the role: `Mapper`.'));
                } else
                if (args[1] === "writer") {
                    message.member.addRole(writerRole).then(message.channel.send('Successfully added the role: `Writer`.'));
                } else
                if (args[1] === "red") {
                    message.member.addRole(redRole).then(message.channel.send('Successfully added the role: `red`.'));
                } else
                if (args[1] === "blue") {
                    message.member.addRole(blueRole).then(message.channel.send('Successfully added the role: `blue`.'));
                } else
                if (args[1] === "yellow") {
                    message.member.addRole(yellowRole).then(message.channel.send('Successfully added the role: `yellow`.'));
                } else
                if (args[1] === "lime") {
                    message.member.addRole(limeRole).then(message.channel.send('Successfully added the role: `lime`.'));
                } else
                if (args[1] === "purple") {
                    message.member.addRole(purpleRole).then(message.channel.send('Successfully added the role: `purple`.'));
                } else
                if (args[1] === "pink") {
                    message.member.addRole(pinkRole).then(message.channel.send('Successfully added the role: `pink`.'));
                } else
                if (args[1] === "orange") {
                    message.member.addRole(orangeRole).then(message.channel.send('Successfully added the role: `orange`.'));
                } else {
                    message.channel.send("Please provide a valid role. You can choose to be a `mapper`, `composer`, `coder`, `writer` or `spriter`. Alternatively, you can add the following colours to yourself: `red`, `blue`, `yellow`, `lime`, `purple`, `pink` and `orange`.");
                }
            }
            if (args[0] === "remove") {
                if (args[1] === "spriter") {
                    message.member.removeRole(spriterRole).then(message.channel.send('Successfully removed the role: `Spriter`.'));
                } else
                if (args[1] === "coder") {
                    message.member.removeRole(coderRole).then(message.channel.send('Successfully removed the role: `Coder`.'));
                } else
                if (args[1] === "composer") {
                    message.member.removeRole(composerRole).then(message.channel.send('Successfully removed the role: `Composer`.'));
                } else
                if (args[1] === "mapper") {
                    message.member.removeRole(mapperRole).then(message.channel.send('Successfully removed the role: `Mapper`.'));
                } else
                if (args[1] === "writer") {
                    message.member.removeRole(writerRole).then(message.channel.send('Successfully removed the role: `Writer`.'));
                } else
                if (args[1] === "red") {
                    message.member.removeRole(redRole).then(message.channel.send('Successfully removed the role: `red`.'));
                } else
                if (args[1] === "blue") {
                    message.member.removeRole(blueRole).then(message.channel.send('Successfully removed the role: `blue`.'));
                } else
                if (args[1] === "yellow") {
                    message.member.removeRole(yellowRole).then(message.channel.send('Successfully removed the role: `yellow`.'));
                } else
                if (args[1] === "lime") {
                    message.member.removeRole(limeRole).then(message.channel.send('Successfully removed the role: `lime`.'));
                } else
                if (args[1] === "purple") {
                    message.member.removeRole(purpleRole).then(message.channel.send('Successfully removed the role: `purple`.'));
                } else
                if (args[1] === "pink") {
                    message.member.removeRole(pinkRole).then(message.channel.send('Successfully removed the role: `pink`.'));
                } else
                if (args[1] === "orange") {
                    message.member.removeRole(orangeRole).then(message.channel.send('Successfully removed the role: `orange`.'));
                } else {
                    message.channel.send("Please provide a valid role. You can remove the roles: `mapper`, `composer`, `coder`, `writer` or `spriter`. Alternatively, you can remove the following colours to yourself: `red`, `blue`, `yellow`, `lime`, `purple`, `pink` and `orange`.");
                }
            }
        }
    }

});

//API3 key: AIzaSyCI60eA1U7KxxnEhVupUVtfTIZtT0TpgZQ

client.login(process.env.TOKEN);