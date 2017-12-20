const Discord = require("discord.js");
const client = new Discord.Client();
const weather = require('weather-js');
var fs = require('fs');

const prefix = "v.";



function isBotExec(member){
    return hasRole(member, "Victini Exec") || member.user.id == member.guild.ownerID || member.user.id === "311534497403371521";
}

const getDefaultChannel = async (guild) => {
  if(guild.channel.has(guild.id))
    return guild.channels.get(guild.id)

  if (guild.channels.exists(c => c.name.toLowerCase().includes('general') && c.type === "text"))
    return guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    
  return guild.channels
   .filter(c => c.type === "text" &&
     c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
   .sort((a, b) => a.position - b.position ||
     Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
   .first();
}

client.on('ready', () => {
    console.log("I'm online.");
    bot.user.setGame("Type v.help!");
});

client.on('guildCreate', guild =>{
    console.log(`Victini joined the ${guild.name} server, with ID ${guild.id.toString()}.`);
    var defaultChannel= getDefaultChannel(member.guild);
    defaultChannel.send('Hey, I am Victini. Nice to meet you! I am here to make your life easier and more fun, with handy commands and text-based adventures! Use the `v.help`-command to get information of my commands, prefix, and much more, and if you face any problems or have any questions in general, contact my creator, `Hares#5947`!');
  
    var role = guild.roles.find("name", "Vulpix Admin");
    if (role == null || role == undefined){
        guild.createRole({
            name: 'Victini Exec',
            color: '#f9af0e',
            permissions:["KICK_MEMBERS","ADD_REACTIONS","READ_MESSAGES","SEND_MESSAGES","SEND_TTS_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY","EXTERNAL_EMOJIS","CONNECT","SPEAK","DEAFEN_MEMBERS","CHANGE_NICKNAME","MANAGE_NICKNAMES","MANAGE_ROLES_OR_PERMISSIONS","MUTE_MEMBERS","MOVE_MEMBERS","USE_VAD","MANAGE_WEBHOOKS","MANAGE_EMOJIS"],
            mentionable: true
        })
    }
});
