const Discord = require("discord.js");
const client = new Discord.Client();
const weather = require('weather-js');
var fs = require('fs');

const prefix = "v.";



function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

function defaultChannel(guild) {
    if (guild.defaultChannel && guild.defaultChannel.constructor && guild.defaultChannel.constructor.name == 'TextChannel') {
        return guild.defaultChannel
    } else {
        return guild.channels.map(c => c)[0];
    }
}

function hasRole(member, role) {
    var _role = member.guild.roles.find("name", role);
    try {
        return member.roles.has(_role.id);
    } catch (Error) {
        return false;
    }
}

function rand(int) {
    return Math.floor(Math.random() * parseInt(int));
}


function botExec(member) {
    return hasRole(member, "Victini Exec") || member.user.id == member.guild.ownerID || member.user.id == '311534497403371521';
}



client.on("guildCreate", guild => {

    defaultChannel(guild).send('Hey, I am Victini. Nice to meet you! I am here to make your life easier and more fun, with handy commands and text-based adventures! Use the `v.help`-command to get information of my commands, prefix, and much more, and if you face any problems or have any questions in general, contact my creator, `Hares#5947`!');

    var role = guild.roles.find("name", "Victini Exec");
    if (role == null || role == undefined) {
        guild.createRole({
            name: 'Victini Exec',
            color: '#ff9e30',
            permissions: [
                "ADD_REACTIONS", "READ_MESSAGES", "SEND_MESSAGES",
                "SEND_TTS_MESSAGES", "EMBED_LINKS", "ATTACH_FILES",
                "READ_MESSAGE_HISTORY", "EXTERNAL_EMOJIS", "CONNECT",
                "SPEAK", "CHANGE_NICKNAME"
            ],
            mentionable: true
        })
    }
});


client.on('guildMemberAdd', member => {

    client.channels.get('369507173937709056').send('Welcome to the official Pokémon Victorius server, ' + member.user + ' ! To proceed, please type in a separate message the number which corresponds the most to the reason you have come to this server. \n\n1)    I want to support the game but do not wish to contribute anything. (Type in `1`) \n2)   I want to help the game by contributing something, but do not want to be extremely commited. (Type in `2`) \n3)   I want to actively help the game and its development by providing aid in one particular field of which I am skilled at. (Type in `3`)\n\nFeel free to ask the <@&369499519794151425>, <@&369499281134059520>, or an <@&372096917611741184> for help!');
    var roleIntro = member.guild.roles.find('name', 'Intro');
    member.addRole(roleIntro);


});


client.on('guildMemberRemove', member => {

    defaultChannel(guild).send('Sadly, ' + member.user.username + ' has left the server. RIP...!');

});


client.on("message", (message) => {

    if (message.author.bot) return;

    if (message.content.indexOf(prefix) !== 0) return;


    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();



    // Help command
    if (command === "help") {
        // Commands
        if (args[0] === "commands") {
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
                }
                else {
                    message.channel.send("Type the following commands to get help on specific stuff:\n```v.help commands face lenny\nv.help commands face shrug\nv.help commands face superlenny\nv.help commands face dead\nv.help commands face angry\nv.help commands face shocked```");
                }
            }
            else if (args[1] === "victim") {
                    message.channel.send("Use the `v.victim`-command to test how lucky you are... or misfortunate...");
            } 
            else if (args[1] === "weather") {
                    message.channel.send("The `v.weather`-command sends the weather of the location you specify. You use this command as follow: `v.weather` `[a real life location]`");
            } 
            else {
                    message.channel.send("Type the following commands to get help on specific stuff:\n```v.help face\nv.help 8ball\nv.help helper\nv.help victim\nv.help weather```");
                }
        }
        // Exec-only
        else if (args[0] === "exec-only" && botExec(message.member)) {
            if (args[1] === "say") {
                message.channel.send("Use the `v.say`-command to let Victini mimmick what you say. Use this command as follows: `v.say` `[the sentence you want Victini to repeat]`");
            } else if (args[1] === "eval") {
                message.channel.send("Use the `v.eval`-command to test code out. Though, this command requires extensive knowledge of `JavaScript`");
            } else {
                message.channel.send("Exec-only commands require the `Victini Exec`-role to be used. Type the following commands to get further help:\n```v.help exec-only say\nv.help exec-only eval```");
            }
        }
        // General info
        else if (args[0] === "gen-info") {
            if (args[1] === "prefix") {
                message.channel.send("Victini's prefix is `v.`. Note that this is a *lower-case* \"v\"!");
            } else if (args[1] === "invite") {
                message.channel.send("You can invite Victini to you server by clicking on the following link. Please note that Victini is still *in Beta*, and is buggy at the moment. For further inquiries, please contact user `Hares#5947`.\nhttps://discordapp.com/oauth2/authorize?client_id=372037843574456342&scope=bot&permissions=2146958591");
            } else {
                message.channel.send("Type the following commands to get help on specific stuff:\n```v.help gen-info prefix\nv.help gen-info invite```");
            }
        }
        // Help text
        else {
            message.channel.send("Type the following commands to get help on specific stuff:\n```v.help gen-info\nv.help commands\nv.help exec-only```");
        }
    }



    // Helper command
    if (command === "helper") {
        message.channel.send("https://cdn.discordapp.com/attachments/320716421757927436/376351118449573909/sketch1509192675057.png");
    }

    // 8ball command
    if (command === "8ball") {
        if (message.content.startsWith(prefix + "8ball")) {
            var magicArray = [
                'It is certain.',
                'It is decidedly so.',
                'Without a doubt.',
                'Yes - definitely.',
                'You may rely on it.',
                'As I see it, yes.',
                'Most likely.',
                'Outlook good.',
                'Yes.',
                'Signs point to yes.',
                'Reply hazy, try again.',
                'Ask again later.',
                'Better not tell you now.',
                'Cannot predict now.',
                'Concentrate and ask again.',
                'I would not count on it.',
                'My reply is no.',
                'My sources say no.',
                'Outlook not so good.',
                'Are you done asking questions yet?',
                'Why the fuck should I even know this?',
                'The answer lies within yourself.',
                'Why are you asking me?',
                'Follow the seahorse.',
                'Very doubtful.'
            ];
            var randomReply = Math.floor(Math.random() * magicArray.length);
            message.channel.send(`${magicArray[randomReply]}`);
        }
    }

    // Face command
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
    // Thinking command
    if (command === "thinking") {
        message.channel.send("https://cdn.discordapp.com/attachments/347376772951572490/364168246628188162/the_real_thinking_emoji.gif");
    }

    // Victim command
    if (command === "victim") {
        var victim = JSON.parse(fs.readFileSync('database/victim.json')).victim;
        message.channel.sendMessage(message.member.user + victim[rand(victim.length)]);
    }


    // Weather command
    if (message.content.startsWith(prefix + 'weather')) {

        weather.find({
            search: args.join(" "),
            degreeType: 'C'
        }, function(err, result) {
            if (err) message.channel.send(err);


            if (result.length === 0) {
                message.channel.send('Location not found! Please check whether you have entered a valid location.')
                return;
            }


            var current = result[0].current;
            var location = result[0].location;

            const embed = new Discord.RichEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Weather for ${current.observationpoint}`)
                .setThumbnail(current.imageUrl)
                .setColor(0xFF9E30)
                .addField('Timezone', `UTC${location.timezone}`, true)
                .addField('Degree Type', location.degreetype, true)
                .addField('Temperature', `${current.temperature} Degrees`, true)
                .addField('Feels Like', `${current.feelslike} Degrees`, true)
                .addField('Winds', current.winddisplay, true)
                .addField('Humidity', `${current.humidity}%`, true)

            message.channel.send({
                embed
            });
        });
    }




    // Exec only commands
    if (botExec(message.member)) {

        //Say command
        if (command === "say") {
            message.delete();
            message.channel.send(args.join(" "));
        }


        // Eval command
        const evalArgs = message.content.split(" ").slice(1);

        if (message.content.startsWith(prefix + "eval")) {
            try {
                const code = evalArgs.join(" ");
                let evaled = eval(code);

                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);

                message.channel.send(clean(evaled), {
                    code: "xl"
                });
            } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
        } else {
            return;
        }
    }


});




client.login(process.env.BOT_TOKEN);
