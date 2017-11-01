const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "v.";


//client.on("ready", () => {
//    var role = guild.roles.find("name", "Victini Exec");
//
//    if (role == null || role == undefined) {
//        guild.createRole({
//            name: 'Victini Exec',
//           color: '#e59239',
//            permissions: [
//                "ADD_REACTIONS", "READ_MESSAGES", "SEND_MESSAGES",
//                "SEND_TTS_MESSAGES", "EMBED_LINKS", "ATTACH_FILES",
//               "READ_MESSAGE_HISTORY", "EXTERNAL_EMOJIS",
//               "CONNECT", "SPEAK", "CHANGE_NICKNAME",
//                "USE_VAD", "MANAGE_WEBHOOKS"
//            ],
//            mentionable: true
//        })
//    }
//});


client.on('guildMemberAdd', member => {


    if (guild.id == "369492433060364300") {
    client.channels.get('369507173937709056').send('Welcome to the official Pokémon Victorius server, ' + member.user + ' ! To proceed, please type in a separate message the number which corresponds the most to the reason you have come to this server. \n\n1)    I want to support the game but do not wish to contribute anything. (Type in `1`) \n2)   I want to help the game by contributing something, but do not want to be extremely commited. (Type in `2`) \n3)   I want to actively help the game and its development by providing aid in one particular field of which I am skilled at. (Type in `3`)\n\nFeel free to ask the <@&369499519794151425>, <@&369499281134059520>, or an <@&372096917611741184> for help!');

    var roleIntro = member.guild.roles.find('name', 'Intro');
    member.addRole(roleIntro);
    }
  else {
        send('Welcome to the server, ' + member.user + '!');
}

});


client.on('guildMemberRemove', member => {

    client.channels.get('369492433592909844').send('Sadly, ' + member.user.username + ' has left the server. RIP...!');

});


client.on("message", (message) => {

    if (message.author.bot) return;

    if (message.content.indexOf(prefix) !== 0) return;


    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

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
            message.channel.sendMessage(`${magicArray[randomReply]}`);
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
});

client.login(process.env.BOT_TOKEN);
