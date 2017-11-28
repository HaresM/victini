const Discord = require("discord.js");
const client = new Discord.Client();
const weather = require('weather-js');
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
var fs = require('fs');
var config = {};
let points = JSON.parse(fs.readFileSync("database/levels.json", "utf8"));

const prefix = "v.";



function clean(text) {
	if (typeof(text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
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

(member.guild.id === "383287520118702100") {
		member.send("Welcome to the official Pokémon Equality server! You have to wait 10 minutes to post something in the server, but please read the rules and FAQ-channels. Enjoy your stay!");

client.on('guildMemberAdd', member => {
	if (member.guild.id === "383287520118702100") {
		member.send("Welcome to the official Pokémon Equality server! You have to wait 10 minutes to post something in the server, but please read the rules and FAQ-channels. Enjoy your stay!");
	} 
	else if (member.guild.id === "369492433060364300") {
		client.channels.get("369507173937709056").send('Welcome to the official Pokémon Victorius server, ' + member.user + ' ! To proceed, please type in a separate message the number which corresponds the most to the reason you have come to this server. \n\n1)    I want to support the game but do not wish to contribute anything. (Type in `1`) \n2)   I want to help the game by contributing something, but do not want to be extremely commited. (Type in `2`) \n3)   I want to actively help the game and its development by providing aid in one particular field of which I am skilled at. (Type in `3`)\n\nFeel free to ask the <@&369499519794151425>, <@&369499281134059520>, or an <@&372096917611741184> for help!');
		var roleIntro = member.guild.roles.find('name', 'Intro');
		member.addRole(roleIntro);
	} 
	else {
		const defaultChannel = getDefaultChannel(member.guild);
		defaultChannel.send(member + ' has joined the server. Welcome!');
	}
});


client.on("guildCreate", guild => {
	const defaultChannel = getDefaultChannel(member.guild);
	var role = guild.roles.find("name", "Victini Exec");
	if (role === null || role === undefined) {
		guild.createRole({
			name: 'Victini Exec',
			color: '#ff9e30',
			permissions: ["ADD_REACTIONS", "READ_MESSAGES", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "EXTERNAL_EMOJIS", "CONNECT", "SPEAK", "CHANGE_NICKNAME"],
			mentionable: true
		});
	}
	console.log(`New guild joined: \`${guild.name}\`, with id: \`${guild.id}\`. This guild has \`${guild.memberCount}\``);
	defaultChannel.send('Hey, I am Victini. Nice to meet you! I am here to make your life easier and more fun, with handy commands and text-based adventures! Use the `v.help`-command to get information of my commands, prefix, and much more, and if you face any problems or have any questions in general, contact my creator, `Hares#5947`!');
});

client.on("guildMemberRemove", (member, message) => {
	const defaultChannel = getDefaultChannel(member.guild);
	defaultChannel.send('Sadly, ' + member.user.username + ' has left the server. RIP...!');
});



client.on("message", (message) => {
	if (message.content.indexOf(prefix) !== 0) return;
	if (message.author.bot) return;

	if (!points[message.author.id]) points[message.author.id] = {
		points: 0,
		level: 0
	};
	let userData = points[message.author.id];
	userData.points++;

	let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
	if (curLevel > userData.level) {
		userData.level = curLevel;
		message.reply(`congrats, you have leveled up to level **${curLevel}**!`);
	}
	
	  if (message.content.startsWith(prefix + "level")) {
    message.reply(`you are currently level ${userData.level}, with ${userData.points} EXP.`);
  }
  fs.writeFile("database/levels.json", JSON.stringify(points), (err) => {
    if (err) console.error(err)
  });
	
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "help") {
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
				} else {
					message.channel.send("Type the following commands to get help on specific stuff:\n```v.help commands face lenny\nv.help commands face shrug\nv.help commands face superlenny\nv.help commands face dead\nv.help commands face angry\nv.help commands face shocked```");
				}
			} else if (args[1] === "victim") {
				message.channel.send("Use the `v.victim`-command to test how lucky you are... or misfortunate...");
			} else if (args[1] === "weather") {
				message.channel.send("The `v.weather`-command sends the weather of the location you specify. You use this command as follow: `v.weather` `[a real life location]`");
			} else if (args[1] === "convert") {
				message.channel.send("The `v.convert`-command converts a temperature to Degrees Celsius or Degrees Fahrenheit. If you want to convert `[a number]` to Degrees Fahrenheit, you use this command as follows: `v.convert` `f` `[a number]`. On the other hand, if you want to convert `[a number]` to Degrees Celsius, you use this command as follows: `v.convert` `c` `[a number]`.");
			} else {
				message.channel.send("Type the following commands to get help on specific stuff:\n```v.help commands face\nv.help commands 8ball\nv.help commands helper\nv.help commands victim\nv.help commands weather\nv.help commands convert```");
			}
		} else if (args[0] === "exec-only" && botExec(message.member)) {
			if (args[1] === "say") {
				message.channel.send("Use the `v.say`-command to let Victini mimmick what you say. Use this command as follows: `v.say` `[the sentence you want Victini to repeat]`");
			} else if (args[1] === "kick") {
				message.channel.send("The `v.kick`-command kicks a user. It's that straightforward. Use this command as follows: `v.kick` `@[user you want to kick]` `[eason as to why you want to kick this person]`");
			} else if (args[1] === "clear") {
				message.channel.send("The `v.clear`-command deletes the amount of specified messages. Note that the command itself counts as a message as well. Use this command as follows: `v.clear` `[ammount of messages you want to clear]`");
			} else {
				message.channel.send("Exec-only commands require the `Victini Exec`-role to be used. Type the following commands to get further help:\n```v.help exec-only say\nv.help exec-only kick\nv.help exec-only clear```");
			}
		} else if (args[0] === "gen-info") {
			if (args[1] === "prefix") {
				message.channel.send("Victini's prefix is `v.`. Note that this is a *lower-case* \"v\"!");
			} else if (args[1] === "invite") {
				message.channel.send("You can invite Victini to you server by clicking on the following link. Please note that Victini is still *in Beta*, and is buggy at the moment. For further inquiries, please contact user `Hares#5947`.\nhttps://discordapp.com/oauth2/authorize?client_id=372037843574456342&scope=bot&permissions=2146958591");
			} else {
				message.channel.send("Type the following commands to get help on specific stuff:\n```v.help gen-info prefix\nv.help gen-info invite```");
			}
		} else {
			message.channel.send("Type the following commands to get help on specific stuff:\n```v.help gen-info\nv.help commands\nv.help exec-only```");
		}
	}
	if (command === "helper") {
		message.channel.send("https://cdn.discordapp.com/attachments/320716421757927436/376351118449573909/sketch1509192675057.png");
	}
	if (command === "8ball") {
		if (message.content.startsWith(prefix + "8ball")) {
			var magicArray = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'I would not count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Are you done asking questions yet?', 'Why the fuck should I even know this?', 'The answer lies within yourself.', 'Why are you asking me?', 'Follow the seahorse.', 'Very doubtful.'];
			var randomReply = Math.floor(Math.random() * magicArray.length);
			message.channel.send(`${magicArray[randomReply]}`);
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
		var victim = JSON.parse(fs.readFileSync('database/victim.json')).victim;
		message.channel.send(message.member.user + victim[rand(victim.length)]);
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
				return;
			}

			var current = result[0].current;
			var location = result[0].location;

			const embed = new Discord.RichEmbed()
				.setDescription(`**${current.skytext}**`)
				.setAuthor(`Weather for ${current.observationpoint}`)
				.setThumbnail(current.imageUrl)
				.setColor(0xff9e30)
				.addField('Timezone', `UTC${location.timezone}`, true)
				.addField('Degree Type', location.degreetype, true)
				.addField('Temperature', `${current.temperature} Degrees`, true)
				.addField('Feels Like', `${current.feelslike} Degrees`, true)
				.addField('Winds', current.winddisplay, true)
				.addField('Humidity', `${current.humidity}%`, true);

			message.channel.send({
				embed
			});
		});
	}
	if (command === "convert") {
		var temperature = args[1];
		var celsius = (temperature - 32) * (5 / 9);
		var fahrenheit = (temperature * (9 / 5)) + 32;
		if (!args[0]) {
			message.channel.send("Please provide the type of conversion.");
			return;
		}
		if (!args[1]) {
			message.channel.send("Please enter the ammount that you want to convert.");
			return;
		}
		if (args[0] === "c") {
			message.channel.send(`\`${temperature}\` Degrees Fahrenheit is \`${celsius}\` Degrees Celsius.`);
		} else if (args[0] === "f") {
			message.channel.send(`\`${temperature}\` Degrees Celsius is \`${fahrenheit}\` Degrees Fahreinheit.`);
		} else {
			message.channel.send("Temperature could not be converted.");
		}
	}
	if (message.guild.id === '383287520118702100') {
		if (command === "equality") {
			if (args[0] === "demo") {
				message.channel.send("While we haven't confirmed anything, we are aiming to release a demo around February\March 2018!");
			} else
			if (args[0] === "story") {
				message.channel.send("```Welcome to your new adventure! Travel across the beautiful landscape of Scaniola with your Pokemon, uncovering secrets about the region and what lies above. Scaniola is home to more than just tourist hotspots; it has a vast history intertwined with ancient cities and new pokemon. Rivalry and friendship will follow on this journey, as you travel alongside two trainers-in-the-making, Zeak and Lisa. Conquer gyms and challenge the Elite Four, before facing the Champion of Scaniola. Professor Aspen recruits your help when strange anomalies threaten the natural order of things! And don’t forget to stop the bad guys!```");
			} else
			if (args[0] === "help") {
				message.channel.send("You can use the following commands on this sever:\n\n    `v.equality story`: Sends a pocket-version of the story.\n    `v.equaltiy demo`: Sends a rough estimate for the release of the demo.");
			} else
			if (args[0] === "dex") {
				if (args[1] === "pyruff") {
					message.channel.send("**Pyruff**\n`It is loyal, and will flare up its tail if it is in trouble. It takes good care of its claws, and sometimes avoids fighting with them.`\n\n\n*Type:* `Fire`\n\n*Abilities:* `Blaze`\n\n*Gender ratio:* `12.5% ♀ 87.5% ♂`\n\n*Base stats:*\n   HP: `45`\n   Defense: `45`\n   Sp Defense: `45`\n   Attack: `60`\n   Sp Attack: `60`\n   Speed: `60`\n\nhttps://cdn.discordapp.com/attachments/383287520118702102/383317612807061505/004.png");
				} else {
					message.channel.send("Please specify a Pokémon.");
				}
			}
		}
	}
	if (message.guild.id === '369492433060364300') {
		if (command === "victorius") {
			if (args[0] === "story") {
				message.channel.send("```Fated boy/girl who happens to live next to the pokemon lab gets tangled up with an evil organization after receiving a starter pokemon with a very rare genetic condition called \"Alium Syndrome\", works with professor and friends to prevent world annihilation from happening due to some evil dude taking advantage of this pokemon condition and abusing their power for his own gains. Using his newfound power he convinces a few renowned evil team leaders from around the pokemon world to help him create the perfect pokemon and rule over the world and its fate. However, the main character has the power to raise the odd pokemon to their full potential and use their power to foil the last part of the perfect pokemon, his creation, by obtaining victini, and then with the power of the victory pokemon is able to defeat the imperfect pokemon and restore peace.```");
			}
		}
	}
	if (botExec(message.member)) {
		if (command === "count") {
			if (args[0] === "members") {
				message.channel.send(`This server has \`${message.guild.memberCount}\` members.`);
			} else
			if (args[0] === "servers") {
				message.channel.send(`I am in \`${client.guilds.size.toLocaleString()}\` servers.`);
			} else
			if (args[0] === "channels") {
				message.channel.send(`This server has \`${message.guild.channels.size.toLocaleString()}\` channels.`);
			} else {
				message.channel.send("Type the following commands to make me count stuff:\n```v.count members\nv.count channels\nv.count servers\`\`\`");
			}
		}
		if (command === "clear") {
			var index = args.join(" ");
			if (index < 2)
				return message.channel.send('Please specify a larger ammount of messages to be cleared.');
			if (index > 100)
				return message.channel.send('Only 100 messages can be cleared at a time. Please specify a smaller ammount of message.');
			if (index < 2)
				return message.channel.send('Sorry but the minimum number of msgs you can bulk delete is 2');
			message.channel.bulkDelete(index);
			if (message.channel.bulkDelete(index)) {
				return;
			} else {
				message.channel.send("Messages could not be cleared.");
			}
		}
		if (command === "kick") {
			let member = message.mentions.members.first();
			if (!member)
				return message.channel.send("Please mention a member.");
			if (!member.kickable)
				var reason = args.slice(1).join(" ");
			if (!reason)
				return message.channel.send("Please indicate a reason for the kick.");
			if (member.kick(reason)) {
				message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag} due to the follwing reason:\n\`\`\`$(reason}\`\`\``);
			} else {
				message.channel.send(`${member.user.tag} could not be kicked due to the following error:\n\`\`\`${error}\`\`\``);
			}
		}
		if (command === "say") {
			if (args.length === 0)
				return message.channel.send('Specify something you want me to say.');
			message.delete();
			message.channel.send(args.join(" "));
		}
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
				message.channel.send(`\`ERROR\`\`\`\`xl\n${clean(err)}\n\`\`\``);
			}
		}
	}
});



client.login(process.env.BOT_TOKEN);
