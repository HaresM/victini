const Discord = require("discord.js");
const client = new Discord.Client();
var fs = require('fs');

const prefix = "v.";



function jsonToString(json){
    if (!json) return '---';
    if (json.constructor == Array){
        return `[\n    "${json.join('",\n    "')}"\n]`
    }
    else{
        return JSON.stringify(json, null, 4);
    }
}

function getDate(date = null){
    var d = date ? date : new Date();
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var dt = d.getDate();
    var hr = d.getHours() + 1;
    var mnts = d.getMinutes() + 1;
    if (m < 10) { m = '0'+m.toString(); }
    if (dt < 10) { dt = '0'+dt.toString(); }
    if (hr < 10) { hr = '0'+hr.toString(); }
    if (mnts < 10) { mnts = '0'+mnts.toString(); }
    y = y.toString();
    m = m.toString();
    dt = dt.toString();
    hr = hr.toString();
    mnts = mnts.toString();
    return y + '-' + m + '-' + dt + '__' + hr + ':' + mnts;
}

function getChannelMembers(channel){
	var total = channel.members.map(m => m).length;
	var members;
	if (total == 0){
		members = "---";
	}
	else if (total <= 10){
		members = channel.members.map(m => m.user.username).join('\n');
	}
	else{
		members = total;
	}
	return members;
}

function getGuildMembers(guild){
	var total = guild.memberCount;
	var members;
	if (total == 0){
		members = "---";
	}
	else if (total <= 10){
		members = guild.members.map(m => m.user.username).join('\n');
	}
	else{
		members = guild.memberCount;
	}
	return members;
}

function getAbility(ability){
    return `[${ability.replace(`_`, ` `)}](https://bulbapedia.bulbagarden.net/wiki/${ability}_(Ability\\))`;
}

function hasRole(member, role){
    var _role = member.guild.roles.find("name", role);
    try{
        return member.roles.has(_role.id);
    }
    catch (Error){
        return false;
    }
}

function getRank(guild, user){
    var sortable = [];
    for (var id in config[guild.id].ranks) {
        sortable.push([id, config[guild.id].ranks[id]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    for (i = 0; i < sortable.length; i++){
        if (sortable[i][0] == user.id){
            return i + 1;
        }
    }
}

function isBotAdmin(member){
    return hasRole(member, "Vulpix Admin") || member.user.id == member.guild.ownerID || member.user.id == '270175313856561153';
}

function isDeveloper(member){
    return isBotAdmin(member) || hasRole(member, "Developers");
}

function defaultChannel(guild){
    if (guild.defaultChannel && guild.defaultChannel.constructor && guild.defaultChannel.constructor.name == 'TextChannel'){
        return guild.defaultChannel;
    }
    else{
        return guild.channels.map(c => c)[0];
    }
}

function setDefaults(guild){
    var g = guild.id; // Default Config settings.
    config[g] = {
        "prefix": "?",
        "servername": guild.name,
        "ranks": {

        },
        "users": {

        },
        "channels": {

        },
        "suggestions": [

        ],
        "commands": {

        },
        "messages": {
            "welcome": {
                "msg": "Welcome to the server, (user)!",
                "status": "on",
                "role": "Member",
                "channel": defaultChannel(guild).name
            },
            "levelup": {
                "msg": "Congrats, (@user)! You leveled up to level (level)!",
                "status": "on"
            },
            "goodbye": {
                "msg": "(user) has just left the server. Rest in peace!",
                "status": "on",
                "channel": defaultChannel(guild).name
            },
            "news": {
                "status": "on",
                "channel": defaultChannel(guild).name
            }
        },
        "bot_log": {
            "channel": defaultChannel(guild).name,
            "status": "on"
        },
        "roles": {

        },
        "quotes": {

        },
        "bugs": {

        },
        "commandlog": [

        ]
    }

    saveConfig();
    var role = guild.roles.find("name", "Vulpix Admin");
    if (role == null || role == undefined){
        guild.createRole({
            name: 'Vulpix Admin',
            color: '#C6C6C6',
            permissions: [
                "KICK_MEMBERS", "ADD_REACTIONS",
                "READ_MESSAGES", "SEND_MESSAGES",
                "SEND_TTS_MESSAGES", "MANAGE_MESSAGES",
                "EMBED_LINKS", "ATTACH_FILES",
                "READ_MESSAGE_HISTORY", "EXTERNAL_EMOJIS",
                "CONNECT", "SPEAK", "DEAFEN_MEMBERS",
                "CHANGE_NICKNAME", "MANAGE_NICKNAMES",
                "MANAGE_ROLES_OR_PERMISSIONS", "MUTE_MEMBERS",
                "MOVE_MEMBERS", "USE_VAD", "MANAGE_WEBHOOKS",
                "MANAGE_EMOJIS"
            ],
            mentionable: true
        })
    }
}

function getSingleChannel(arg, arg2){
    if (arg && arg.constructor && arg.constructor.name == 'TextChannel') return arg;
    var chnl = arg2.channels.find(c => c.name == arg && c.type == 'text');
    if (!chnl){
        chnl = arg2.channels.get(arg);
    }
    if (!chnl){
        try{ chnl = arg2.channels.find(c => c.name.toLowerCase() == arg.toLowerCase() && c.type == 'text'); } catch (e){}
    }
    if (!chnl){
        if (arg.toString().contains('<#') && arg.toString().contains('>')){
            arg = arg.split('<#')[1].split('>')[0];
            chnl = arg2.channels.get(arg);
        }
    }
    return chnl;
}

function saveConfig(){
    ref.update(config);
}

function logMessage(guild, message){
    if (!config[guild.id].commandlog) config[guild.id].commandlog = []
    config[guild.id].commandlog.push(message);
}

function rand(int){
    return Math.floor(Math.random() * parseInt(int));
}

function command(channel, arg, cmd){
    try{
        return arg == cmd && !config[channel.guild.id].channels[channel.id].disabled_commands.contains(cmd);
    }
    catch (err){
        return true;
    }
}

function getBugEmbed(title, description, username, url){
    return {embed: {
        color: main_color,
        footer: {
            text: username,
            icon_url: url
        },
        fields: [{
            name: `**Bug Title**`,
            value: title
        },{
            name: `**Bug Description**`,
            value: description
        }]
    }};
}

function getQuotes(member){
	if (!config[member.guild.id].quotes || !config[member.guild.id].quotes[member.user.id]) return [];
	return config[member.guild.id].quotes[member.user.id];
}

function changeAvatar(){
    var avatars = JSON.parse(fs.readFileSync('database/avatars.json')).avatars;
    bot.user.setAvatar(avatars[rand(avatars.length)]);
}

setInterval(saveConfig, 15000);
setInterval(changeAvatar, 720000)

bot.on('ready', () => {
    if (!config) return;
    console.log('Online');
    bot.user.setGame("Type v-help or v-config!");
});

bot.on('guildCreate', guild =>{
    if (!config) return;
    console.log('Vulpix joined "' + guild.name + '" server with ID "' + guild.id.toString() + '" at date: ' + Date.now() + '.');
    defaultChannel(guild).send('Hello! I am Vulpix. I am here to help you out with utility commands, shortcuts, and more. Contact user `Marin#7122` for questions and inquiries!');
    setDefaults(guild);
})

bot.on('guildMemberAdd', member =>{
    if (!config) return;
    if (config[member.guild.id.toString()].messages.welcome.status == "on"){
        var channel = config[member.guild.id.toString()].messages.welcome.channel;
        var msg = config[member.guild.id.toString()].messages.welcome.msg;
        while (msg.contains('(user)')){
            msg = msg.replace('(user)', member.user.username);
        }
        while (msg.contains('(@user)')){
            msg = msg.replace('(@user)', member.user);
        }
        var chnl = getSingleChannel(channel, member.guild);
        if (chnl){
            chnl.send(msg);
        }
        else{
            defaultChannel(member.guild).send(`Welcome to the server, ${member.user}!`);
            defaultChannel(member.guild).send(`Channel \`${channel}\` does not exist as referred to in \`v-config messages welcome channel\`.`);
        }
    }
    if (!config[member.guild.id].users) config[member.guild.id].users = {};
    if (!config[member.guild.id].users[member.user.id]) config[member.guild.id].users[member.user.id] = {};
    config[member.guild.id].users[member.user.id].number = member.guild.memberCount
    if (config[member.guild.id].roles && config[member.guild.id].roles.memberJoin){
        var roles = config[member.guild.id].roles.memberJoin;
        for (i = 0 ; i < roles.length; i++){
            if (roles[i]){
                var role = member.guild.roles.find('name', roles[i]);
                if (role){
                    member.addRole(role);
                }
                else{
                    defaultChannel(member.guild).send(`Role \`${roles[i]}\` does not exist as referred to in \`v-config roles\` with event "memberJoin".`);
                }
            }
        }
    }
    saveConfig();
});

bot.on('guildMemberRemove', member => {
    if (!config) return;
    var guild = member.guild;
    var id = guild.id;
    var userid = member.user.id;
    if (config[id] && config[id].ranks && config[id].ranks[userid]){
        delete config[id].ranks[userid];
    }
    if (config[id] && config[id].quotes && config[id].quotes[userid]){
        delete config[id].quotes[userid];
    }
    if (config[id] && config[id].users && config[id].users[userid]){
        delete config[id].users[userid];
    }
    if (config[id] && config[id].messages && config[id].messages.goodbye && config[id].messages.goodbye.status == "on"){
        var channel = getSingleChannel(config[id].messages.goodbye.channel, guild);
        if (channel){
            var msg = config[id].messages.goodbye.msg;
            while (msg.contains('(user)')){
                msg = msg.replace('(user)', member.user.username);
            }
            channel.send(msg);
        }
        else{
            defaultChannel(guild).send(`${member.user.username} just left. Goodbye!`);
            defaultChannel(guild).send(`Channel \`${config[id].messages.goodbye.channel}\` does not exist as referred to in \`v-config messages goodbye channel\`.`);
        }
    }
    saveConfig();
});

bot.on('channelDelete', channel => {
    if (!config) return;
    var guild = channel.guild;
    var id = guild.id;
    var channelid = channel.id;
    if (config[id] && config[id].channels && config[id].channels[channelid]){
        delete config[id].channels[channelid];
    }
    saveConfig();
});

bot.on('guildDelete', guild => {
    if (!config) return;
    var id = guild.id;
    if (config[id]){
        delete config[id];
    }
    saveConfig();
});

bot.on('guildUpdate', (oldguild, newguild) => {
    if (!config) return;
    var id = newguild.id;
    config[id].servername = newguild.name;
    saveConfig();
});

bot.on('message', message => {
    if (message.channel.type == 'dm') return;
    function sendWarning(message){
        if (message.author.id == '270175313856561153') return;
        if (!config) config = {}
        if (!config.global) config.global = {}
        if (!config.global.warnings) config.global.warnings = {}
        if (!config.global.warnings.messages) config.global.warnings.messages = []
        config.global.warnings.messages.push(getDate() + ' ' + message.author.username + `: ` + message.content);
        if (!config.global.excluded_users.contains(message.author.id)) config.global.excluded_users.push(message.author.id);
        message.delete();
    }
    if (message.content.contains(process.env.TOKEN)){
        sendWarning(message);
        return;
    }
    if (!config) return;
    if (!config[message.channel.guild.id]) return;
	if (!message || !message.member) return;
    if (message.member.user.bot) return;
    var guild = message.guild;
    var id = guild.id;
    var channel = message.channel;
    var prefix = config[id].prefix;
    var user = message.author;
    var member = message.member;
    if (!config[id]) return;
    if (config.global && config.global.excluded_users && config.global.excluded_users.contains(message.author.id)) return;

    function canAddRole(user, role){
      if (!user || !role) return false
      if (role.constructor.name != 'Role'){
        role = guild.roles.find('name', role);
      }
      member = getMember(user);
      if (!member) return false;
      var rolepos = role.position;
      var positions = guild.members.get(bot.user.id).roles.map(r => r.position);
      var upositions = member.roles.map(r => r.position);
      return Math.max.apply(Math, positions) > role.position && Math.max.apply(Math, positions) > Math.max.apply(Math, upositions);  
    }

    function getChannel(arg, arg2 = guild){
        if (arg && arg.constructor && arg.constructor.name == 'TextChannel') return arg;
        var chnl = arg2.channels.find(c => c.name == arg && c.type == 'text');
        if (!chnl){
            chnl = arg2.channels.get(arg);
        }
        if (!chnl){
            try{ chnl = arg2.channels.find(c => c.name.toLowerCase() == arg.toLowerCase() && c.type == 'text'); } catch (e){}
        }
        if (!chnl){
            if (arg.toString().contains('<#') && arg.toString().contains('>')){
                arg = arg.split('<#')[1].split('>')[0];
                chnl = arg2.channels.get(arg);
            }
        }
        return chnl;
    }

    function getUser(arg){
        if (arg && arg.constructor && arg.constructor.name == 'User') return arg;
        if (arg && arg.constructor && arg.constructor.name == 'GuildMember') return arg.user;
        var user = guild.members.find(m => m.user.username == arg);
        if (!user){
            user = guild.members.get(arg);
        }
        if (!user){
            try{ user = guild.members.find(m => m.user.username.toLowerCase() == arg.toLowerCase()); } catch (e){}
        }
        if (!user){
            if (arg.toString().contains('<@') && arg.toString().contains('>')){
                arg = arg.split('<@')[1].split('>')[0];
                user = guild.members.get(arg);
            }
        }
        if (!user){
            user = guild.members.find(m => m.nickname == arg);
        }
        if (!user){
            user = guild.members.find(m => m.nickname && m.nickname.toLowerCase() == arg.toLowerCase());
        }
        if (user && user.constructor && user.constructor.name == 'GuildMember') return user.user;
        return null;
    }
    function getMember(arg){
        if (arg && arg.constructor && arg.constructor.name == 'GuildMember') return arg;
        var user = getUser(arg);
        if (user) return guild.members.get(user.id);
        return null;
    }
    function getRole(arg){
        if (arg && arg.constructor && arg.constructor.name == 'Role') return arg;
        var role = guild.roles.find(r => r.name == arg);
        if (!role){
            role = guild.roles.get(arg);
        }
        if (!role){
            try{ role = guild.roles.find(r => r.name.toLowerCase() == arg.toLowerCase()); } catch (e){}
        }
        if (!role){
            if (arg.toString().contains('<@&') && arg.toString().contains('>')){
                arg = arg.split('<@&')[1].split('>')[0];
                role = guild.roles.get(arg);
            }
        }
        if (role && role.constructor && role.constructor.name == 'Role') return role;
        return null;
    }
    function addRole(member, role){
        var mbr = getMember(member);
        if (!mbr) return false;
        var rle = getRole(role);
        if (!rle) return false;
        mbr.addRole(rle);
        return true;
    }
    function hasRole(arg, role){
        var memb = getMember(arg);
        if (!memb) return false;
        var role = getRole(role);
        if (!role) return false;
        var foundrole = memb.roles.find(r => r.id == role.id);
        if (foundrole) return true;
        return false;
    }

    function removeRole(user, role){
        var mbr = getMember(member);
        if (!mbr) return false;
        var rle = getRole(role);
        if (!rle) return false;
        if (!hasRole(mbr, rle)) return false;
        mbr.removeRole(rle);
        return true;
    }

    function send(msg, channel = null){
      if (!channel){
        message.channel.send(msg).then(message => {
            if (message.content.contains(process.env.TOKEN)){
                sendWarning(message);
                return false;
            }
        });
        return true;
      }
      else{
        var chnl = getChannel(channel);
        if (chnl){
          chnl.send(msg).then(message => {
            if (message.content.contains(process.env.TOKEN)){
                sendWarning(message);
                return false;
            }
          });
          return true;
        }
        else{
          return false;
        }
      }
      return false;
    }
}



















function hasRole(member, role){
    var _role = member.guild.roles.find("name", role);
    try{
        return member.roles.has(_role.id);
    }
    catch (Error){
        return false;
    }
}

function rand(int){
    return Math.floor(Math.random() * parseInt(int));
}

//client.on("ready", () => {
//    var role = guild.roles.find("name", "Victini Exec");
//
//    if (role == null || role == undefined) {
//        Discord.guild.createRole({
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

function isBotAdmin(member){
    return member.user.id == member.guild.ownerID;
}


client.on('guildMemberAdd', member => {
    
   client.channels.get('369507173937709056').send('Welcome to the official Pokémon Victorius server, ' + member.user + ' ! To proceed, please type in a separate message the number which corresponds the most to the reason you have come to this server. \n\n1)    I want to support the game but do not wish to contribute anything. (Type in `1`) \n2)   I want to help the game by contributing something, but do not want to be extremely commited. (Type in `2`) \n3)   I want to actively help the game and its development by providing aid in one particular field of which I am skilled at. (Type in `3`)\n\nFeel free to ask the <@&369499519794151425>, <@&369499281134059520>, or an <@&372096917611741184> for help!');
    var roleIntro = member.guild.roles.find('name', 'Intro');
    member.addRole(roleIntro);
        

});


client.on('guildMemberRemove', member => {

    client.channels.get('369492433592909844').send('Sadly, ' + member.user.username + ' has left the server. RIP...!');

});


client.on("message", (message) => {

    if (message.author.bot) return;

    if (message.content.indexOf(prefix) !== 0) return;


    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    // Help command
    if (command === "help") {
        message.channel.sendMessage("Command under construction.");    
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
    // Victim command
    if (command === "victim") {
        var victim = JSON.parse(fs.readFileSync('database/victim.json')).victim;
        message.channel.sendMessage(message.member.user + victim[rand(victim.length)]);
    }
});











    if (message.content.startsWith("v.config") && isBotAdmin(message.member)){ // Configuration of the bot for the server.
        args = message.content.split(" ");
        args.splice(0, 1);
        var cmd = args[0];
        var setting = args[1];
        logMessage(guild, `${getDate()} ${message.author.username}: ${message.content}`);
        if (cmd == "prefix"){
            if (setting != undefined){
                if (setting == "v-"){
                    message.channel.send(`\`v-\` cannot be used as a command prefix.`);
                }
                else{
                    config[id]["prefix"] = setting;
                    saveConfig();
                    message.channel.send(`Successfully set active command prefix to \`${config[id].prefix}\`.`);
                }
            }
            else{
                message.channel.send(`The prefix for commands is currently ${config[id].prefix}. Use \`v.config prefix [new prefix]\` to change it.`);
            }
        }
        else if (cmd == "messages"){
            var arg = args[1];
            var setting = args[2];
            if (arg == "welcome"){
                if (setting == "msg"){
                    var msg = message.content.split('v.config messages welcome msg ')[1];
                    if (!msg){
                        message.channel.send(`The current welcoming message is: \`\`\`\r\n${config[id]["messages"]["welcome"]["msg"]}\`\`\`\nUse this command to change the message:\`\`\`v.config messages welcome msg [message]\`\`\`Inside the message, \`(user)\` will be replaced with the joining user's username, whereas \`(@user)\` will tag the joining user.`);
                    }
                    else{
                        config[id].messages.welcome.msg = msg;
                        saveConfig();
                        message.channel.send(`Successfully set welcome message to: \`\`\`\r\n${config[id].messages.welcome.msg}\`\`\``);
                    }
                }
                else if (setting == "on"){
                    if (config[id].messages.welcome.status == "on"){
                        message.channel.send(`The welcome message was already enabled. Nothing happened.`);
                    }
                    else{
                        config[id].messages.welcome.status = "on";
                        saveConfig();
                        message.channel.send(`The welcome message will now be sent for every new member that joins the server.`);
                    }
                }
                else if (setting == "off"){
                    if (config[id].messages.welcome.status == "off"){
                        message.channel.send(`The welcome message was already disabled. Nothing happened.`);
                    }
                    else{
                        config[id].messages.welcome.status = "off";
                        saveConfig();
                        message.channel.send(`The welcome message will no longer be sent for every new member that joins the server.`);
                    }
                }
                else if (setting == "channel"){
                    if (args[3] != undefined){
                        channel = message.mentions.channels.first();
                        if (!channel) channel = getChannel(args[3], guild);
                        if (channel) {
                            config[id].messages.welcome.channel = channel.name;
                        }
                        else{
                            config[id].messages.welcome.channel = args[3];
                        }
                        saveConfig();
                        message.channel.send('The welcome message will now be sent in `' + config[id].messages.welcome.channel + '`.');
                    }
                    else{
                        message.channel.send('The channel the welcome message will be sent in. Currently set to ```' + config[id].messages.welcome.channel + '```Use the following command to change it: ```v.config messages welcome channel [channelname]```Note that it should be the channel **name**, not a hyperlink or id.');
                    }
                }
                else{
                    message.channel.send('The message that is sent whenever a new user joins.```Message: '+config[id].messages.welcome.msg+'\nStatus: '+config[id].messages.welcome.status+'\nChannel: '+config[id]["messages"]["welcome"]["channel"]+'```\nUse one of the following commands to change the settings:```v.config messages welcome msg [message]\nv.config messages welcome on\nv.config messages welcome off\nv.config messages welcome channel [channelname]```In the welcome message, `(user)` will be replaced with the username.');
                }
            }
            else if (arg == "levelup"){
                if (!config[id].messages.levelup){
                    config[id].messages.levelup = {
                        "msg": "Congrats, (@user)! You leveled up to level (level)!",
                        "status": "on"
                    }
                }
                if (setting == "msg"){
                    if (args[3] == undefined){
                        message.channel.send(`You can change the levelup message by typing \`v.config messages levelup msg [message]\`.\nIn the message, \`(user)\` will become the user's name, \`(@user)\` will tag the person, and (level) will become the new level.`);
                        return;
                    }
                    config[id].messages.levelup.msg = message.content.split(`v.config messages levelup msg `)[1];
                    saveConfig();
                    message.channel.send(`The message when a user levels up has been set to\`\`\`\n${config[id].messages.levelup.msg}\`\`\``);
                }
                else if (setting == "on"){
                    if (config[id].messages.levelup.status == "on"){
                        message.channel.send(`The message when a user levels up is already enabled.`);
                        return;
                    }
                    config[id].messages.levelup.status = "on";
                    saveConfig();
                    message.channel.send(`The message when a user levels up has been enabled.`);
                }
                else if (setting == "off"){
                    if (config[id].messages.levelup.status == "off"){
                        message.channel.send(`The message when a user levels up is already disabled.`);
                        return;
                    }
                    config[id].messages.levelup.status = "off";
                    saveConfig();
                    message.channel.send(`The message when a user levels up has been disabled.`);
                }
                else{
                    message.channel.send(`When someone levels up, Vulpix will send a message. You can configure that using one of the following commands:\n\`\`\`v.config messages levelup msg\nv.config messages levelup on\nv.config messages levelup off\`\`\``);
                }
            }
            else if (arg == "goodbye"){
                if (!config[id].messages.goodbye){
                    config[id].messages.goodbye = {
                        "msg": "(user) has just left the server. Rest in peace!",
                        "status": "on",
                        "channel": "general"
                    }
                }
                if (args[2] == "msg"){
                    var msg = message.content.split('v.config messages goodbye msg ')[1];
                    if (!msg){
                        message.channel.send(`The current goodbye message is:\`\`\`\n${config[id].messages.goodbye.msg}\`\`\`Type \`v.config messages goodbye msg [message]\` to change it.`)
                        return;
                    }
                    config[id].messages.goodbye.msg = msg;
                    saveConfig();
                    message.channel.send(`The goodbye message has been set to:\`\`\`\n${config[id].messages.goodbye.msg}\`\`\``);
                }
                else if (args[2] == "on"){
                    if (config[id].messages.goodbye.status == "on"){
                        message.channel.send(`The goodbye message is already enabled.`);
                        return;
                    }
                    config[id].messages.goodbye.status = "on";
                    saveConfig();
                    message.channel.send(`The goodbye message has been enabled.`);
                }
                else if (args[2] == "off"){
                    if (config[id].messages.goodbye.status == "off"){
                        message.channel.send(`The goodbye message is already disabled.`);
                        return;
                    }
                    config[id].messages.goodbye.status = "off";
                    saveConfig();
                    message.channel.send(`The goodbye message has been disabled.`);
                }
                else if (args[2] == "channel"){
                    if (!args[3]){
                        message.channel.send(`The goodbye message is currently being sent in \`${config[id].messages.goodbye.channel}\`. You can change the channel using \`v.config messages goodbye channel [channel]\`.`);
                        return;
                    }
                    channel = message.mentions.channels.first();
                    if (!channel) channel = getChannel(args[3], guild);
                    if (channel) {
                        config[id].messages.goodbye.channel = channel.name;
                    }
                    else{
                        config[id].messages.goodbye.channel = args[3];
                    }
                    saveConfig();
                    message.channel.send(`The goodbye message will now be sent in \`${config[id].messages.goodbye.channel}\`.`);
                }
                else{
                    message.channel.send(`These are the current configurations for the goodbye messages:\`\`\`\nMessage: ${config[id].messages.goodbye.msg}\nStatus: ${config[id].messages.goodbye.status}\nChannel: ${config[id].messages.goodbye.channel}\`\`\`Change the configurations with one of the following commands: \`\`\`\nv.config messages goodbye msg\nv.config messages goodbye on\nv.config messages goodbye off\nv.config messages goodbye channel\`\`\``)
                }
            }
            else if (args[1] == "news"){
                if (!config[id].messages.news){
                    config[id].messages.news = {
                        "status": "on",
                        "channel": "general"
                    }
                }
                if (args[2] == "on"){
                    if (config[id].messages.news.status == "on"){
                        message.channel.send(`You already have news enabled.`);
                        return;
                    }
                    config[id].messages.news.status = "on";
                    saveConfig();
                    message.channel.send(`News has been enabled.`);
                }
                else if (args[2] == "off"){
                    if (config[id].messages.news.status == "off"){
                        message.channel.send(`You already have news disabled.`);
                        return;
                    }
                    config[id].messages.news.status = "off";
                    saveConfig();
                    message.channel.send(`News has been disabled.`);
                }
                else if (args[2] == "channel"){
                    if (args[3]){
                        if (config[id].messages.news.channel == args[3]){
                            message.channel.send(`You are already receiving news in that channel.`);
                            return;
                        }
                        config[id].messages.news.channel = args[3]
                        saveConfig();
                        message.channel.send(`You will now receive news in \`${config[id].messages.news.channel}\` if you have it enabled.`);
                        return;
                    }
                    message.channel.send(`News will be sent in channel \`${config[id].messages.news.channel}\` if you have it enabled. To change in which channel news is sent, use \`v.config messages news channels [channel]\`.`);
                }
                else{
                    message.channel.send(`Your news configurations are as follows: \`\`\`Status: ${config[id].messages.news.status}\nChannel: ${config[id].messages.news.channel}\`\`\`To change any of them, use one of the following commands: \`\`\`v.config messages news off\nv.config messages news on\nv.config messages news channel\`\`\`News are messages sent by the creator of the bot, Marin, to inform you about things that are currently hot and happening. This includes: new, major game releases, fangame takedowns, and other resource releases (including his own).`);
                }
            }
            else{
                message.channel.send('These are messages the bot will send under specific circumstances. You can turn them on/off, change the messages, and choose in which channel they should be sent. Use one of the following commands for more information:```v.config messages welcome\nv.config messages levelup\nv.config messages goodbye\nv.config messages news```');
            }
        }
        else if (cmd == "roles"){
            if (args[1] == "add"){
                if (!args[2]){
                    message.channel.send(`To add a role on a specific event, use one of the following commands:\`\`\`\nv.config roles add "myRole" on "memberJoin"\nv.config roles add "myRole" on "level 5"\`\`\`Explanation:\nIf the event is "memberJoin", whenever the user joins the server, "myRole" will be given to them.\nIf the event is "level X", whenever level X is reached, the user will be given "myRole".`);
                    return;
                }
                var msg = message.content.split('v.config roles add ')[1];
                if (msg.match(/"/g).length != 4){
                    message.channel.send(`Invalid format for adding role event.`);
                    return;
                }
                if (!msg.contains('on')){
                    message.channel.send(`Invalid format for adding role event.`);
                    return;
                }
                var role = msg.split('"')[1].split('"')[0];
                var event = msg.split('"')[3].split('"')[0];
                var param = event.split(' ')[1];
                if (event.contains('level')){
                    if (isNaN(param)){
                        message.channel.send(`Invalid level for event "level X".`);
                        return;
                    }
                }
                if (event != "memberJoin" && !event.contains('level')){
                    message.channel.send(`Invalid event specified.`);
                    return;
                }
                if (role && event){
                    if (!config[id].roles) config[id].roles = {};
                    if (!config[id].roles[event]) config[id].roles[event] = [];
                    config[id].roles[event].push(role);
                    message.channel.send(`Upon event "${event}", role "${role}" will be added.`);
                }
            }
            else if (args[1] == "remove"){
                if (!config[id].roles){
                    message.channel.send(`There are no role events that you can remove.`);
                    return;
                }
                if (!args[2]){
                    message.channel.send(`You can remove automatically assigned roles by typing \`v.config roles remove [index]\`. You can see the index of the role using \`v.config roles\`.`);
                    return;
                }
                if (isNaN(args[2])){
                    message.channel.send(`Invalid index to remove at.`);
                    return;
                }
                var roles = []
                var keys = Object.keys(config[id].roles)
                for (i = 0; i < keys.length; i++){
                    for (j = 0; j < config[id].roles[keys[i]].length; j++){
                        roles.push(`${roles.length + 1}.) "${config[id].roles[keys[i]][j]}" on "${keys[i]}"`);
                    }
                }
                var index = parseInt(args[2]) - 1;
                if (index >= roles.length){
                    message.channel.send(`Index out of range.`);
                    return;
                }
                var msg = roles[index];
                var key = msg.split('"')[3].split('"')[0];
                var value = msg.split('"')[1].split('"')[0];
                config[id].roles[key].splice(config[id].roles[key].indexOf(value), 1);
                if (config[id].roles[key].length == 0){
                    delete config[id].roles[key];
                }
                saveConfig();
                message.channel.send(`Successfully removed "${value}" on "${key}"`);
            }
            else{
                var roles = []
                if (config[id].roles){
                    var keys = Object.keys(config[id].roles)
                    for (i = 0; i < keys.length; i++){
                        for (j = 0; j < config[id].roles[keys[i]].length; j++){
                            roles.push(`${roles.length + 1}.) "${config[id].roles[keys[i]][j]}" on "${keys[i]}"`);
                        }
                    }
                }
                message.channel.send(`These role events are currently active:\`\`\`\n${roles.length == 0 ? `---` : roles.join('\n')}\`\`\`Configure roles by using one of the following commands:\`\`\`\nv.config roles add\nv.config roles remove\`\`\``)
            }
        }
        else if (cmd == "bot_log"){
            if (!config[id].bot_log) {
                config[id].bot_log = {
                    "channel": "bot_log",
                    "status": "on"
                }
            }
            if (args[1] == "channel"){
                if (!args[2]){
                    message.channel.send(`The bot will currently log its unordinary actions in \`${config[id].bot_log.channel}\`.`);
                    return;
                }
                channel = message.mentions.channels.first();
                if (!channel) channel = getChannel(args[2], guild);
                if (channel) {
                    config[id].bot_log.channel = channel.name;
                }
                else{
                    config[id].bot_log.channel = args[2];
                }
                saveConfig();
                message.channel.send(`The bot will now log unordinary actions in channel \`${config[id].bot_log.channel}\`.`);
            }
            else if (args[1] == "on"){
                if (config[id].bot_log.status == "on"){
                    message.channel.send(`The bot log is already enabled.`);
                    return;
                }
                config[id].bot_log.status = "on";
                saveConfig();
                message.channel.send(`The bot log is now enabled.`);
            }
            else if (args[1] == "off"){
                if (config[id].bot_log.status == "off"){
                    message.channel.send(`The bot log is already disabled.`);
                    return;
                }
                config[id].bot_log.status = "off";
                saveConfig();
                message.channel.send(`The bot log is now disabled.`);
            }
            else{
                message.channel.send(`The channel the bot will log its unordinary actions. The current configuration is as follows:\`\`\`\nChannel: ${config[id].bot_log.channel}\nStatus: ${config[id].bot_log.status}\`\`\`Use one of the following commands to change the configuration:\`\`\`\nv.config bot_log channel\nv.config bot_log on\nv.config bot_log off\`\`\``);
            }
        }
        else if (cmd == "channels"){
            if (!config[id].channels){
                console.log(`Resetting channels for server ${id}`)
                config[id].channels = {};
            }
            var channels = [];
            for (i = 0; i < guild.channels.array().length; i++){
                if (guild.channels.array()[i].type == 'text') { channels.push(guild.channels.array()[i].name); }
            }
            if (args[1]){
                channel = message.mentions.channels.first();
                if (!channel) channel = getChannel(args[1], guild);
                if (!channel || channel.type != 'text'){
                    message.channel.send(`That channel does not exist or is not a text channel.`);
                }
            }
            if (!config[id].channels[channel.id]){
                console.log(`Resetting commands for channel ${channel.id} on server ${id}`)
                config[id].channels[channel.id] = {
                    "disabled_commands": []
                };
            }
            var all_commands = commands;
            if (config[id].commands){
                var cmds = Object.keys(config[id].commands);
                all_commands.merge(cmds);
            }
            if (channels.contains(args[1])){
                if (args[2] == "disable"){
                    if (args[3] != undefined){
                        if (!all_commands.contains(args[3])){
                            message.channel.send(`Command "${args[3]}" is not a valid Vulpix command.`);
                            return;
                        }
                        if (config[id].channels[channel.id].disabled_commands.contains(args[3])){
                            message.channel.send(`"${args[3]}" is already disabled in \`${args[1]}\`.`);
                        }
                        else{
                            config[id].channels[channel.id].disabled_commands.push(args[3]);
                            saveConfig();
                            message.channel.send(`"${args[3]}" is now disabled in \`${args[1]}\`.`);
                        }
                    }
                    else{
                        message.channel.send(`To disable one of the following Vulpix commands: \`\`\`\n${all_commands.join('\n')}\`\`\`\nType the following: \`\`\`\nv.config channels [channel] disable [command]\`\`\`You should not write a prefix before the command, only the name.`);
                    }
                }
                else if (args[2] == "enable"){
                    if (args[3] != undefined){
                        if (!all_commands.contains(args[3])){
                            message.channel.send(`Command "${args[3]}" is not a valid Vulpix command.`);
                            return;
                        }
                        if (!config[id].channels[channel.id].disabled_commands.contains(args[3])){
                            message.channel.send(`"${args[3]}" is already enabled in \`${args[1]}\`.`);
                        }
                        else{
                            config[id].channels[channel.id].disabled_commands.splice(config[id].channels[channel.id].disabled_commands.indexOf(args[3]), 1);
                            saveConfig();
                            message.channel.send(`"${args[3]}" is now enabled in \`${args[1]}\`.`);
                        }
                    }
                    else{
                        message.channel.send(`To enable one of the following Vulpix commands: \`\`\`\n${all_commands.join('\n')}\`\`\`Type the following: \`\`\`\nv.config channels [channel] enable [command]\`\`\`You should not write a prefix before the command, only the name.`);
                    }
                }
                else if (args[2] == "disable_all"){
                    config[id].channels[channel.id].disabled_commands = [];
                    for (i = 0; i < all_commands.length; i++){
                        config[id].channels[channel.id].disabled_commands.push(all_commands[i]);
                    }
                    saveConfig();
                    message.channel.send(`All public Vulpix commands besides "v.config" are now disabled in \`${args[1]}\`.`)
                }
                else if (args[2] == "enable_all"){
                    config[id].channels[channel.id].disabled_commands = [];
                    saveConfig();
                    message.channel.send(`All public Vulpix commands are now enabled in channel \`${args[1]}\`.`)
                }
                else{
                    message.channel.send(`${`These commands are currently disabled in \`${args[1]}\`: \`\`\`\n${config[id].channels[channel.id].disabled_commands.length == 0 ? "---" : config[id].channels[channel.id].disabled_commands.join('\n')}\`\`\``} To disable or enable a command/all commands for a channel, use one of the following commands:\`\`\`\nv.config channels [channel] disable\nv.config channels [channel] enable\nv.config channels [channel] disable_all\nv.config channels [channel] enable_all\`\`\``);
                }
            }
            else if (args[1] == undefined){
                channels.splice(channels.indexOf('General'), 1);
                var msg = 'v.config channels ' + channels.join('\nv.config channels ');
                message.channel.send(`Use one of the following commands to configure commands for a channel: \`\`\`\n${msg}\`\`\``);
            }
            else{
                message.channel.send(`Channel \`${args[1]}\` doesn't exist.`);
            }
        }
        else if (cmd == "reset_to_default"){
            setDefaults(message.guild);
            message.channel.send(`The configurations have been reset to the default.`);
        }
        else if (cmd == "show"){
            var msg = "";
            if (args[1] == "prefix"){
                msg = config[id].prefix;
            }
            else if (args[1] == "all"){
                msg = jsonToString(config[id]);
            }
            else if (args[1] == "messages"){
                msg = jsonToString(config[id].messages);
            }
            else if (args[1] == "quotes"){
                msg = jsonToString(config[id].quotes);
            }
            else if (args[1] == "ranks"){
                msg = jsonToString(config[id].ranks);
            }
            else if (args[1] == "channels"){
                msg = jsonToString(config[id].channels);
            }
            else if (args[1] == "bugs"){
                msg = jsonToString(config[id].bugs);
            }
            else if (args[1] == "users"){
                msg = jsonToString(config[id].users);
            }
            else{
                message.channel.send(`Use one of the following values to show: \`\`\`v.config show prefix\nv.config show messages\nv.config show quotes\nv.config show ranks\nv.config show channels\nv.config show bugs\nv.config show users\`\`\``);
                return;
            }
            message.channel.send('```JavaScript\n'+msg+'```');
        }
        else if (cmd == "commands"){
            if (!config[id].commands){
                config[id].commands = {}
            }
            if (args[1] == "create"){
                if (!args[2]){
                    message.channel.send(`
To create a new command, use the following format: \`\`\`v.config commands create "[name]": [code]\`\`\`
Here is an example: \`\`\`v.config commands create "download": send('The game is not out yet!')\`\`\`
Note that you can use \`${config[id].prefix}eval\` to test the code!

To create a more advanced command, you should know the basics of JavaScript. It may be possible if you don't, but it will be harder.
Here are some methods you can use:
\`\`\`send('message')
Sends a message.
                        
send('message', 'channelname');
Sends a message in the channel you specified.
                        
canAddRole(user, 'Member');
Returns a boolean. True if the bot can give the user the role, false if not.

hasRole(user, 'Member');
Returns a boolean. True if the user already has the role, false if they don't.
                        
addRole(user, 'Member');
Adds the role you specified to the user. Returns true if it succeeded, false if it didn't. If it can't add the role, it will also log that in the bot-log channel if bot logs are enabled. Use v.config bot_log to configure the bot logs.

rand(number)
Returns a random number between 0 and [number], exclusive.
\`\`\`
Notes:
Wherever you see a "user" argument, that, by default, is whoever sent the message, but it can also be a username!
If you want "subcommands", such as, say, \`${config[id].prefix}tag one\` and \`${config[id].prefix}tag two\`, you should simply make the names \`tag one\` and \`tag two\`.


If you feel there are methods missing to make it easier to create a command, please get in touch with \`Marin#7122\`.`);
                    return;
                }
                else{
                    args.splice(0, 2);
                    var msg = args.join(' ');
                    if (!msg.contains(':')){
                        message.channel.send(`Invalid command format. Separator \`:\` was not found.`);
                        return;
                    }
                    var name = msg.split(':')[0];
                    if (name.startsWith('"') || name.startsWith("'")){
                        name = name.substr(1);
                    }
                    if (name.endsWith('"') || name.endsWith("'")){
                        name = name.substr(0, name.length - 1);
                    }
                    var tmp = msg.split(':');
                    tmp.splice(0, 1);
                    var code = tmp.join(':');
                    while (code.startsWith(' ')){
                        code = code.substr(1);
                    }
                    var exists = config[id].commands[name] != undefined
                    var oldcode = null;
                    if (exists) oldcode = config[id].commands[name];
                    config[id].commands[name] = code;
                    saveConfig();
                    if (!exists) send(`Successfully created a new command: \`${name}\`.`);
                    if (exists){
                        send(`Successfully overrode ${name}. Old code:\`\`\`JavaScript\r\n${oldcode}\`\`\``);
                        send(`New code:\`\`\`JavaScript\r\n${config[id].commands[name]}\`\`\``);
                    }
                }
            }
            else if (args[1] == "delete"){
                if (!args[2]){
                    message.channel.send(`Specify at which index you'd like to remove a command.`);
                    return;
                }
                var keys = Object.keys(config[id].commands);
                if (isNaN(args[2])){
                    message.channel.send(`Specify a valid index to delete at.`);
                    return;
                }
                var index = parseInt(args[2]) - 1;
                if (index < 0 || index >= keys.length){
                    message.channel.send(`Index too high or too low.`);
                    return;
                }
                delete config[id].commands[keys[index]];
                if (config[id].channels){
                    var channels = Object.keys(config[id].channels)
                    for (i = 0; i < channels.length; i++){
                        if (config[id].channels[channels[i]].disabled_commands.contains(keys[index])){
                            config[id].channels[channels[i]].disabled_commands.splice(config[id].channels[channels[i]].disabled_commands.indexOf(keys[index]), 1);
                        }
                    }
                }
                saveConfig();
                message.channel.send(`Successfully deleted command \`${keys[index]}\`.`);
            }
            else if (args[1] == "view"){
                if (!args[2]){
                    message.channel.send(`Specify the index of the command you want to see in-depth.`);
                    return;
                }
                var keys = Object.keys(config[id].commands);
                if (isNaN(args[2])){
                    message.channel.send(`Specify a valid index to see that command.`);
                    return;
                }
                var index = parseInt(args[2]) - 1;
                if (index < 0 || index >= keys.length){
                    message.channel.send(`Index too high or too low.`);
                    return;
                }
                send(`\`${keys[index]}\`:\r\n\`\`\`\r\n${config[id].commands[keys[index]]}\`\`\``);
            }
            else{
                var cmds = "";
                var keys = Object.keys(config[id].commands);
                for (i = 0; i < keys.length; i++){
                    cmds += `${i+1}.) ${keys[i]}\r\n`;
                }
                message.channel.send(`These are all custom commands currently configured:\`\`\`\r\n${keys.length == 0 ? `---` : cmds}\`\`\`To create a new command, use \`v.config commands create\`. To delete a command, use \`v.config commands delete [index]\`. To see the code behind a command, use \`v.config commands view [index]\`.`);
            }
        }
        else{
            message.channel.send('To configure the bot for this server, use one of the following commands: ```v.config prefix\nv.config messages\nv.config roles\nv.config reset_to_default\nv.config channels\nv.config show\nv.config bot_log\nv.config commands\nv.config game```')
        }
    }
});
















    


client.login(process.env.BOT_TOKEN);
