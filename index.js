const Discord = require("discord.js");
const client = new Discord.Client();
const weather = require('weather-js');
var fs = require('fs');

const prefix = "v.";



function isBotExec(member) {
    return hasRole(member, "Victini Exec") || member.user.id == member.guild.ownerID || member.user.id === "311534497403371521";
}



client.on("ready", () => {
    console.log("I'm online.");
    client.user.setGame("Type v.help!");
});

client.on("guildCreate", guild => {
    console.log(`Victini joined the ${guild.name} server, with ID ${guild.id.toString()}.`);

    var defaultChannel = guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = guild.channels.filter(channel => channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
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
            mentionable: true
        })
    }
});

client.on("guildMemberAdd", member => {
    var defaultChannel = member.guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = member.guild.channels.filter(channel => channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'))
    if (defaultChannel === null) {
        availableChannels.random().send(member.user + ' has joined the server. Welcome!');
    } else {
        defaultChannel.send(member.user + ' has joined the server. Welcome!');
    }
});

client.on("guildMemberRemove", member => {
    var defaultChannel = member.guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = member.guild.channels.filter(channel => channel.permissionsFor(member.guild.me).has('SEND_MESSAGES'))
    if (defaultChannel === null) {
        availableChannels.random().send(member.user.username + ' has left the server. RIP...!');
    } else {
        defaultChannel.send(member.user.username + ' has left the server. RIP...!');
    }
});



client.on("message", async message => {

    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();



    if (isBotExec(message.member)) {
        if (command === "say") {
            const sayMessage = args.join(" ");
            message.delete().catch(O_o => {});
            message.channel.send(sayMessage);
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

            await member.kick(reason)
                .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
            message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

        }

        if (command === "clear") {
            const deleteCount = parseInt(args[0], 10);

            if (!deleteCount || deleteCount < 2 || deleteCount > 100 || isNan(deleteCount) === True)
                return message.channel.send("Please provide a number between 2 and 100 for the number of messages to delete.");

            const fetched = deleteCount
            message.channel.bulkDelete(fetched)
                .catch(error => message.channel.send(`Couldn't delete messages because of: \`\`\`${error}\`\`\``));
        }

    }

});



client.login(process.env.BOT_TOKEN);
