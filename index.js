const Discord = require("discord.js");
const client = new Discord.Client();
const weather = require('weather-js');
const yt = require('ytdl-core');
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
    client.user.setGame("Type v.help!");
});

client.on("guildCreate", guild => {
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
    var defaultChannel = member.guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = member.guild.channels.filter(channel => channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'));
    if (defaultChannel === null) {
        availableChannels.random().send(member.user + ' has joined the server. Welcome!');
    } else {
        defaultChannel.send(member.user + ' has joined the server. Welcome!');
    }
});

client.on("guildMemberRemove", member => {
    var defaultChannel = member.guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = member.guild.channels.filter(channel => channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'));
    if (defaultChannel === null) {
        availableChannels.random().send(member.user.username + ' has left the server. RIP...!');
    } else {
        defaultChannel.send(member.user.username + ' has left the server. RIP...!');
    }
});



client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;
    if (message.channel.type === "dm") return;

    const args = message.content.slice(prefix.toLowerCase().length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "help") {
        if (args[0] === "gen-info") {
            if (args[1] === "prefix") {
                message.channel.send("Victini's prefix is `v.`. Note that this is a *lower-case* \"v\"!");
            } else if (args[1] === "invite") {
                message.channel.send("You can invite Victini to you server by clicking on the following link. Please note that Victini is still *in Beta*, and is buggy at the moment. For further inquiries, please contact user `Hares#5947`.\nhttps://discordapp.com/oauth2/authorize?client_id=372037843574456342&scope=bot&permissions=2146958591");
            } else {
                message.channel.send("Type the following commands to get help on specific stuff:\n```v.help gen-info prefix\nv.help gen-info invite```");
            }
        } else if (args[0] === "commands") {
            if (args[1] === "8ball") {
                message.channel.send("The `v.8ball`-command sends a reply to a question that can be answered with yes or no. You use this command as follows: `v.8ball` `[your yes/no question]`.");
            } else if (args[1] === "helper") {
                message.channel.send("The `v.helper`-command sends a image of Victini made by `#Greedere Ganciel#3872`.");
            } else if (args[1] === "face") {
                if (args[2] === "lenny") {
                    message.channel.send("The `v.lenny`-command sends a lenny-face ( ( ͡° ͜ʖ ͡°) ). What more is there to say?");
                } else if (args[2] === "shrug") {
                    message.channel.send("The `v.shrug`-command sends a shrug emoticon ( ¯\\_(ツ)_/¯ ).");
                } else if (args[2] === "dead") {
                    message.channel.send("The `v.dead`-command sends a cute dead face ( ( ×ω× ) ).");
                } else if (args[2] === "angry") {
                    message.channel.send("The `v.angry`-command sends an emoticon that represents an angry face ( ヽ(#`Д´)ﾉ )");
                } else if (args[2] === "shocked") {
                    message.channel.send("The `v.shocked`-command sends an emoticon that represents an shocked face ( Σ(ﾟДﾟ；≡；ﾟдﾟ) )");
                } else if (args[2] === "superlenny") {
                    message.channel.send("The `v.superlenny`-command sends sends a buffed up version of a lenny-face ( ( ͡o ͜ʖ ͡o) )");
                } else {
                    message.channel.send("Type the following commands to get help on specific stuff:\n```v.help commands face lenny\nv.help commands face shrug\nv.help commands face superlenny\nv.help commands face dead\nv.help commands face angry\nv.help commands face shocked```");
                }
            } else if (args[1] === "victim") {
                message.channel.send("Use the `v.victim`-command to test how lucky you are... or misfortunate...");
            } else if (args[1] === "weather") {
                message.channel.send("The `v.weather`-command sends the weather of the location you specify. You use this command as follow: `v.weather` `[a real life location]`");
            } else if (args[1] === "convert") {
                message.channel.send("The `v.convert`-command converts a temperature to Degrees Celsius or Degrees Fahrenheit. If you want to convert `[a number]` to Degrees Fahrenheit, you use this command as follows: `v.convert` `f` `[a number]`. On the other hand, if you want to convert `[a number]` to Degrees Celsius, you use this command as follows: `v.convert` `c` `[a number]`.");
            } else if (args[1] === "hug") {
                message.channel.send("Use the `v.hug`-command to express your love to someone. Everytime this command is used, a number is given to the power of your hug. Can you hug with the most power? Use this command as follows: `v.hug` `@[user you want to hug]`");
            } else if (args[1] === "reminder") {
                message.channel.send("When using the `v.reminder`-command, you will receive a DM after the ammount of specified time *in minutes* of something you wanted to be reminded of. Use this command as follows: `v.reminder` `[time in minutes, a number]` `[thing you want to be reminded of]`");
            } else {
                message.channel.send("Type the following commands to get help on specific stuff:\n```v.help commands face\nv.help commands 8ball\nv.help commands helper\nv.help commands victim\nv.help commands weather\nv.help commands convert\nv.help commands hug\nv.help commands reminder```");
            }
        } else if (args[0] === "exec-only" && isBotExec(message.member)) {
            if (args[1] === "say") {
                message.channel.send("Use the `v.say`-command to let Victini mimmick what you say. Use this command as follows: `v.say` `[the sentence you want Victini to repeat]`");
            } else if (args[1] === "kick") {
                message.channel.send("The `v.kick`-command kicks a user. It's that straightforward. Use this command as follows: `v.kick` `@[user you want to kick]` `[reason as to why you want to kick this person]`");
            } else if (args[1] === "clear") {
                message.channel.send("The `v.clear`-command deletes the amount of specified messages. Note that the command itself counts as a message as well. Use this command as follows: `v.clear` `[ammount of messages you want to clear]`");
            } else {
                message.channel.send("Exec-only commands require the `Victini Exec`-role to be used. Type the following commands to get further help:\n```v.help exec-only say\nv.help exec-only kick\nv.help exec-only clear```");
            }
        } else {
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
        const victim = JSON.parse(fs.readFileSync('database/victim.json')).victim;
        message.channel.send(message.member.user + victim[rand(victim.length)]);
    }

    if (command === "hug") {
        const hugArray = ['1. You can do better.', '2. It\'s a start. ¯\\_(ツ)_/¯', '3. We\'re getting there.', '4. Now we\'re talking!', '5. This is getting spoopy.', '6. Your power is admirable.', '7. Simply... Amazing... o_0', '8. Everyone, evacuate this server!'];
        const randomReply = Math.floor(Math.random() * hugArray.length);
        let member = message.mentions.members.first();

        if (!member)
            return message.channel.send("Mention the user you want to hug.");

        message.channel.send(member + " recieved a hug from " + message.author + ", with power " + hugArray[randomReply]);
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
            message.channel.send(`\`${temperature}\` Degrees Fahrenheit is \`${celsius}\` Degrees Celsius.`);
        } else if (args[0] === "f") {
            message.channel.send(`\`${temperature}\` Degrees Celsius is \`${fahrenheit}\` Degrees Fahreinheit.`);
        } else {
            message.channel.send("Temperature could not be converted.")
        }
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

        if (!remindTime)
            return message.channel.send("Please provide the ammount of time *in minutes* after which you want to be reminded.");
        if (!remindText)
            return message.channel.send("Please provide something you want to be reminded of.");

        message.channel.send(`You will be reminded to \`${remindText}\`, after \`${args[0]}\` minutes.`);

        setTimeout(function() {
            message.author.sendMessage(`Reminder to: \`\`\`${remindText}\`\`\``);
        }, remindTime)
    }


    if (command === "play") {
        const voicechannel = message.member.voiceChannel;

        if (!voiceChannel) {
            return message.channel.sendMessage(":x: You must be in a voice channel first!");
        }

        voicechannel.join()
            .then(connection => console.log('Connected!'))
            .catch(console.error);
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
                    message.channel.send('Successfully added the role: `Spriter`.');
                    message.member.addRole(spriterRole);
                } else
                if (args[1] === "coder") {
                    message.channel.send('Successfully added the role: `Coder`.');
                    message.member.addRole(coderRole);
                } else
                if (args[1] === "composer") {
                    message.channel.send('Successfully added the role: `Composer`.');
                    message.member.addRole(composerRole);
                } else
                if (args[1] === "mapper") {
                    message.channel.send('Successfully added the role: `Mapper`.');
                    message.member.addRole(mapperRole);
                } else
                if (args[1] === "writer") {
                    message.channel.send('Successfully added the role: `Writer`.');
                    message.member.addRole(writerRole);
                } else
                if (args[1] === "red") {
                    message.channel.send('Successfully added the role: `red`.');
                    message.member.addRole(redRole);
                } else
                if (args[1] === "blue") {
                    message.channel.send('Successfully added the role: `blue`.');
                    message.member.addRole(blueRole);
                } else
                if (args[1] === "yellow") {
                    message.channel.send('Successfully added the role: `yellow`.');
                    message.member.addRole(yellowRole);
                } else
                if (args[1] === "lime") {
                    message.channel.send('Successfully added the role: `lime`.');
                    message.member.addRole(limeRole);
                } else
                if (args[1] === "purple") {
                    message.channel.send('Successfully added the role: `purple`.');
                    message.member.addRole(purpleRole);
                } else
                if (args[1] === "pink") {
                    message.channel.send('Successfully added the role: `pink`.');
                    message.member.addRole(pinkRole);
                } else
                if (args[1] === "orange") {
                    message.channel.send('Successfully added the role: `orange`.');
                    message.member.addRole(orangeRole);
                } else {
                message.channel.send("Please provide a valid role. You can choose to be a `mapper`, `composer`, `coder`, `writer` or `spriter`. Alternatively, you can add the following colours to yourself: `red`, `blue`, `yellow`, `lime`, `purple`, `pink` and `orange`.");
                }
            }
            if (args[0] === "remove") {
                if (args[1] === "spriter") {
                    message.channel.send('Successfully removeed the role: `Spriter`.');
                    message.member.removeRole(spriterRole);
                } else
                if (args[1] === "coder") {
                    message.channel.send('Successfully removeed the role: `Coder`.');
                    message.member.removeRole(coderRole);
                } else
                if (args[1] === "composer") {
                    message.channel.send('Successfully removeed the role: `Composer`.');
                    message.member.removeRole(composerRole);
                } else
                if (args[1] === "mapper") {
                    message.channel.send('Successfully removeed the role: `Mapper`.');
                    message.member.removeRole(mapperRole);
                } else
                if (args[1] === "writer") {
                    message.channel.send('Successfully removeed the role: `Writer`.');
                    message.member.removeRole(writerRole);
                } else
                if (args[1] === "red") {
                    message.channel.send('Successfully removeed the role: `red`.');
                    message.member.removeRole(redRole);
                } else
                if (args[1] === "blue") {
                    message.channel.send('Successfully removeed the role: `blue`.');
                    message.member.removeRole(blueRole);
                } else
                if (args[1] === "yellow") {
                    message.channel.send('Successfully removeed the role: `yellow`.');
                    message.member.removeRole(yellowRole);
                } else
                if (args[1] === "lime") {
                    message.channel.send('Successfully removeed the role: `lime`.');
                    message.member.removeRole(limeRole);
                } else
                if (args[1] === "purple") {
                    message.channel.send('Successfully removeed the role: `purple`.');
                    message.member.removeRole(purpleRole);
                } else
                if (args[1] === "pink") {
                    message.channel.send('Successfully removeed the role: `pink`.');
                    message.member.removeRole(pinkRole);
                } else
                if (args[1] === "orange") {
                    message.channel.send('Successfully removeed the role: `orange`.');
                    message.member.removeRole(orangeRole);
                } else {
                message.channel.send("Please provide a valid role. You can remove the roles: `mapper`, `composer`, `coder`, `writer` or `spriter`. Alternatively, you can remove the following colours to yourself: `red`, `blue`, `yellow`, `lime`, `purple`, `pink` and `orange`.");
                }
            }
        }
    }




});

//API3 key: AIzaSyCI60eA1U7KxxnEhVupUVtfTIZtT0TpgZQ



client.login(process.env.BOT_TOKEN)
