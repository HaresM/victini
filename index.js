const Discord = require("discord.js");
const client = new Discord.Client();
const weather = require('weather-js');
var fs = require('fs');

const prefix = "v.";



function isBotExec(member){
    return hasRole(member, "Victini Exec") || member.user.id == member.guild.ownerID || member.user.id === "311534497403371521";
}



client.on("ready", () => {
    console.log("I'm online.");
    client.user.setGame("Type v.help!");
});

client.on("guildCreate", guild =>{
    console.log(`Victini joined the ${guild.name} server, with ID ${guild.id.toString()}.`);
    
    var defaultChannel = guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = guild.channels.filter(channel => channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
    if (defaultChannel === null) {
        availableChannels.random().send('Hey, I am Victini. Nice to meet you! I am here to make your life easier and more fun, with handy commands and text-based adventures! Use the `v.help`-command to get information of my commands, prefix, and much more, and if you face any problems or have any questions in general, contact my creator, `Hares#5947`!');
    }
    else {
        defaultChannel.send('Hey, I am Victini. Nice to meet you! I am here to make your life easier and more fun, with handy commands and text-based adventures! Use the `v.help`-command to get information of my commands, prefix, and much more, and if you face any problems or have any questions in general, contact my creator, `Hares#5947`!');
    }
  
    var role = guild.roles.find("name", "Victini Exec");
    if (!role || role === undefined){
        guild.createRole({
            name: 'Victini Exec',
            color: '#f9af0e',
            permissions:["ADMINISTRATOR"],
            mentionable: true
        })
    }
});

client.on("guildMemberAdd", (member) => {
    var defaultChannel = guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = guild.channels.filter(channel => channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
    if (defaultChannel === null) {
        availableChannels.random().send(member.user + ' has joined the server. Welcome!');
    }
    else {
        defaultChannel.send(member.user + ' has joined the server. Welcome!');
    }
});

client.on("guildMemberRemove", (member) => {
    var defaultChannel = guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = guild.channels.filter(channel => channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
    if (defaultChannel === null) {
        availableChannels.random().send(member.user.username + ' has left the server. RIP...!');
    }
    else {
        defaultChannel.send(member.user.username + ' has left the server. RIP...!');
    }
});



client.login(process.env.BOT_TOKEN);
