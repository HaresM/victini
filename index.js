const Discord = require("discord.js");
const client = new Discord.Client();
const weather = require('weather-js');
var fs = require('fs');

const prefix = "v.";

function isBotExec(member) {
    return hasRole(member, "Victini Exec") || member.user.id == member.guild.ownerID || member.user.id === "311534497403371521"
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



client.on("ready", () => {
    console.log("I'm online.");
    client.user.setGame("Type v.help!")
});

client.on("guildCreate", guild => {
    console.log(`Victini joined the ${guild.name} server, with ID ${guild.id.toString()}.`);
    var defaultChannel = guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = guild.channels.filter(channel => channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
    if (defaultChannel === null) {
        availableChannels.random().send('Hey, I am Victini. Nice to meet you! I am here to make your life easier and more fun, with handy commands and text-based adventures! Use the `v.help`-command to get information of my commands, prefix, and much more, and if you face any problems or have any questions in general, contact my creator, `Hares#5947`!')
    } else {
        defaultChannel.send('Hey, I am Victini. Nice to meet you! I am here to make your life easier and more fun, with handy commands and text-based adventures! Use the `v.help`-command to get information of my commands, prefix, and much more, and if you face any problems or have any questions in general, contact my creator, `Hares#5947`!')
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
    var defaultChannel = member.guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = member.guild.channels.filter(channel => channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'));
    if (defaultChannel === null) {
        availableChannels.random().send(member.user + ' has joined the server. Welcome!')
    } else {
        defaultChannel.send(member.user + ' has joined the server. Welcome!')
    }
});

client.on("guildMemberRemove", member => {
    var defaultChannel = member.guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = member.guild.channels.filter(channel => channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'));
    if (defaultChannel === null) {
        availableChannels.random().send(member.user.username + ' has left the server. RIP...!')
    } else {
        defaultChannel.send(member.user.username + ' has left the server. RIP...!')
    }
});



client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "help") {
        if (args[0] === "gen-info") {
            if (args[1] === "prefix") {
                message.channel.send("Victini's prefix is `v.`. Note that this is a *lower-case* \"v\"!")
            } else if (args[1] === "invite") {
                message.channel.send("You can invite Victini to you server by clicking on the following link. Please note that Victini is still *in Beta*, and is buggy at the moment. For further inquiries, please contact user `Hares#5947`.\nhttps://discordapp.com/oauth2/authorize?client_id=372037843574456342&scope=bot&permissions=2146958591")
            } else {
                message.channel.send("Type the following commands to get help on specific stuff:\n```v.help gen-info prefix\nv.help gen-info invite```")
            }
        } else if (args[0] === "commands") {
            if (args[1] === "8ball") {
                message.channel.send("The `v.8ball`-command sends a reply to a question that can be answered with yes or no. You use this command as follows: `v.8ball` `[your yes/no question]`.")
            } else if (args[1] === "helper") {
                message.channel.send("The `v.helper`-command sends a image of Victini made by `#Greedere Ganciel#3872`.")
            } else if (args[1] === "face") {
                if (args[2] === "lenny") {
                    message.channel.send("The `v.lenny`-command sends a lenny-face ( ( ͡° ͜ʖ ͡°) ). What more is there to say?")
                } else if (args[2] === "shrug") {
                    message.channel.send("The `v.shrug`-command sends a shrug emoticon ( ¯\\_(ツ)_/¯ ).")
                } else if (args[2] === "dead") {
                    message.channel.send("The `v.dead`-command sends a cute dead face ( ( ×ω× ) ).")
                } else if (args[2] === "angry") {
                    message.channel.send("The `v.angry`-command sends an emoticon that represents an angry face ( ヽ(#`Д´)ﾉ )")
                } else if (args[2] === "shocked") {
                    message.channel.send("The `v.shocked`-command sends an emoticon that represents an shocked face ( Σ(ﾟДﾟ；≡；ﾟдﾟ) )")
                } else if (args[2] === "superlenny") {
                    message.channel.send("The `v.superlenny`-command sends sends a buffed up version of a lenny-face ( ( ͡o ͜ʖ ͡o) )")
                } else {
                    message.channel.send("Type the following commands to get help on specific stuff:\n```v.help commands face lenny\nv.help commands face shrug\nv.help commands face superlenny\nv.help commands face dead\nv.help commands face angry\nv.help commands face shocked```")
                }
            } else if (args[1] === "victim") {
                message.channel.send("Use the `v.victim`-command to test how lucky you are... or misfortunate...")
            } else if (args[1] === "weather") {
                message.channel.send("The `v.weather`-command sends the weather of the location you specify. You use this command as follow: `v.weather` `[a real life location]`")
            } else if (args[1] === "convert") {
                message.channel.send("The `v.convert`-command converts a temperature to Degrees Celsius or Degrees Fahrenheit. If you want to convert `[a number]` to Degrees Fahrenheit, you use this command as follows: `v.convert` `f` `[a number]`. On the other hand, if you want to convert `[a number]` to Degrees Celsius, you use this command as follows: `v.convert` `c` `[a number]`.")
            } else {
                message.channel.send("Type the following commands to get help on specific stuff:\n```v.help commands face\nv.help commands 8ball\nv.help commands helper\nv.help commands victim\nv.help commands weather\nv.help commands convert```")
            }
        } else if (args[0] === "exec-only" && isBotExec(message.member)) {
            if (args[1] === "say") {
                message.channel.send("Use the `v.say`-command to let Victini mimmick what you say. Use this command as follows: `v.say` `[the sentence you want Victini to repeat]`")
            } else if (args[1] === "kick") {
                message.channel.send("The `v.kick`-command kicks a user. It's that straightforward. Use this command as follows: `v.kick` `@[user you want to kick]` `[eason as to why you want to kick this person]`")
            } else if (args[1] === "clear") {
                message.channel.send("The `v.clear`-command deletes the amount of specified messages. Note that the command itself counts as a message as well. Use this command as follows: `v.clear` `[ammount of messages you want to clear]`")
            } else {
                message.channel.send("Exec-only commands require the `Victini Exec`-role to be used. Type the following commands to get further help:\n```v.help exec-only say\nv.help exec-only kick\nv.help exec-only clear```")
            }
        } else {
            message.channel.send("Type the following commands to get help on specific stuff:\n```v.help gen-info\nv.help commands\nv.help exec-only```")
        }
    }
    
    if (command === "lenny") {
        message.delete();
        message.channel.send("( ͡° ͜ʖ ͡°)")
    }
    if (command === "shrug") {
        message.delete();
        message.channel.send("¯\\_(ツ)_/¯")
    }
    if (command === "dead") {
        message.delete();
        message.channel.send("( ×ω× )")
    }
    if (command === "angry") {
        message.delete();
        message.channel.send("ヽ(#`Д´)ﾉ")
    }
    if (command === "shocked") {
        message.delete();
        message.channel.send("Σ(ﾟДﾟ；≡；ﾟдﾟ)")
    }
    if (command === "superlenny") {
        message.delete();
        message.channel.send("( ͡o ͜ʖ ͡o)")
    }
    if (command === "thinking") {
        message.channel.send("https://cdn.discordapp.com/attachments/347376772951572490/364168246628188162/the_real_thinking_emoji.gif")
    }
    
    if (command === "victim") {
        const victim = JSON.parse(fs.readFileSync('database/victim.json')).victim;
        message.channel.send(message.member.user + victim[rand(victim.length)])
    }
    
    if (message.content.startsWith(prefix + 'weather')) {
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
            const embed = new Discord.RichEmbed().setDescription(`**${current.skytext}**`).setAuthor(`Weather for ${current.observationpoint}`).setThumbnail(current.imageUrl).setColor(0xff9e30).addField('Timezone', `UTC${location.timezone}`, !0).addField('Degree Type', location.degreetype, !0).addField('Temperature', `${current.temperature} Degrees`, !0).addField('Feels Like', `${current.feelslike} Degrees`, !0).addField('Winds', current.winddisplay, !0).addField('Humidity', `${current.humidity}%`, !0);
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
            message.channel.send(`\`${temperature}\` Degrees Fahrenheit is \`${celsius}\` Degrees Celsius.`)
        } else if (args[0] === "f") {
            message.channel.send(`\`${temperature}\` Degrees Celsius is \`${fahrenheit}\` Degrees Fahreinheit.`)
        } else {
            message.channel.send("Temperature could not be converted.")
        }
    }
    
    if (command === "helper") {
        message.channel.send("https://cdn.discordapp.com/attachments/320716421757927436/376351118449573909/sketch1509192675057.png")
    }
    
    if (command === "8ball") {
        if (message.content.startsWith(prefix + "8ball")) {
            const magicArray = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'I would not count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Are you done asking questions yet?', 'Why the fuck should I even know this?', 'The answer lies within yourself.', 'Why are you asking me?', 'Follow the seahorse.', 'Very doubtful.'];
            const randomReply = Math.floor(Math.random() * magicArray.length);
            message.channel.send(`${magicArray[randomReply]}`)
        }
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
            message.channel.send(sayMessage)
        }
        
        if (command === "kick") {
            let member = message.mentions.members.first();
            if (!member)
                return message.reply("Please mention a valid member of this server");
            if (!member.kickable || member.user.id === "311534497403371521")
                return message.reply("The specified user could not be kicked.");
            let reason = args.slice(1).join(' ');
            if (!reason)
                return message.reply("Please indicate a reason for the kick!");
            message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag}, because: of the following reason: \`\`\`${reason}\`\`\``)
        }
        
        if (command === "clear") {
            const deleteCount = args[0];
            if (!deleteCount || deleteCount < 2 || deleteCount > 100 || typeof value != "number")
                return message.channel.send("Please provide a number between 2 and 100 for the number of messages to delete.");
            message.channel.bulkDelete(deleteCount)
        }
    }
    
    if (message.guild.id === "265381707312660480") {
            var spriterRole = message.guild.roles.find('name', 'Spriter');
            var mapperRole = message.guild.roles.find('name', 'Mapper');
            var coderRole = message.guild.roles.find('name', 'Coder');
            var writerRole = message.guild.roles.find('name', 'Writer');
            var composerRole = message.guild.roles.find('name', 'Composer');
            var directorRole = message.guild.roles.find('name', 'Fangame Director');
            
            if (command === "role") {
                if (args[0] === "spriter") {
                    message.channel.send('Successfully added the role: `Spriter`.');
                    message.member.addRole(spriterRole);
                } else
                 if (args[0] === "coder") {
                    message.channel.send('Successfully added the role: `Coder`.');
                    message.member.addRole(coderRole);
                } else
                  if (args[0] === "composer") {
                    message.channel.send('Successfully added the role: `Composer`.');
                    message.member.addRole(composerRole);
                } else
                 if (args[0] === "mapper") {
                    message.channel.send('Successfully added the role: `Mapper`.');
                    message.member.addRole(mapperRole);
                } else
                 if (args[0] === "writer") {
                    message.channel.send('Successfully added the role: `Writer`.');
                    message.member.addRole(writerRole);
                 }
                 else {
                     message.channel.send("Please provide a valid role. You can choose to be a `mapper`, `composer`, `coder`, `writer` or `spriter`.");
                 }
            }
        }
    
    
});
client.login(process.env.BOT_TOKEN)
