const Discord = require('discord.js');
const bot = new commando.Client({ id:'id', commandPrefix:'~'
});

//bot.registry.registerGroup('random', 'Random');
//bot.regisrtry.registerDefaults();
//bot.regisrtry.registerCommandsIn(__dirname + "/commands");

bot.on('guildMemberAdd', member => {

    bot.channels.get('369507173937709056').send('Welcome to the official Pokémon Victorius server, ' + member.user + ' ! To proceed, please type in a separate message the number which corresponds the most to the reason you have come to this server. \n\n1)    I want to support the game but do not wish to contribute anything. (Type in `1`) \n2)   I want to help the game by contributing something, but do not want to be extremely commited. (Type in `2`) \n3)   I want to actively help the game and its development by providing aid in one particular field of which I am skilled at. (Type in `3`)\n\nFeel free to ask the <@&369499519794151425>, <@&369499281134059520>, or an <@&372096917611741184> for help!');

    var roleIntro = member.guild.roles.find('name', 'Intro');
    member.addRole(roleIntro);

  });

bot.on('message', message => {
    if(message.content == 'beep') {
        message.channe.sendMessage('Test. Bot is working correctly!');
    }
)};

//bot.login('MzcyMDM3ODQzNTc0NDU2MzQy.DM-WxQ.XrRQRbNdbV9VPD9DYgSHQIfMqdQ');

bot.login(process.env.BOT_TOKEN);

