//const Discord = require('discord.js');
//const bot = new Discord.Client();

const prefix = "v.";
//var story = "Fated boy/girl who happens to live next to the Pokémon lab gets tangled up with an evil organization after receiving a starter Pokémon with a very rare genetic condition called *Alium Syndrome*, works with professor and friends to prevent world annihilation from happening due to some evil dude taking advantage of this Pokémon condition and abusing their power for his own gains. Using his newfound power he convinces a few *renowned evil team leaders* from around the Pokémon-world to help him create the perfect Pokémon and rule over the world and its fate. However, the main character has the power to raise the odd Pokémon to their full potential and use their power to foil the last part of the perfect Pokémon, his creation, by *obtaining Victini*, and then with the power of the victory Pokémon is able to defeat the imperfect Pokémon and restore peace."

//bot.registry.registerGroup('random', 'Random');
//bot.regisrtry.registerDefaults();
//bot.regisrtry.registerCommandsIn(__dirname + "/commands");

//bot.on('guildMemberAdd', member => {

  //  bot.channels.get('369507173937709056').send('Welcome to the official Pokémon Victorius server, ' + member.user + ' ! To proceed, please type in a separate message the number which corresponds the most to the reason you have come to this server. \n\n1)    I want to support the game but do not wish to contribute anything. (Type in `1`) \n2)   I want to help the game by contributing something, but do not want to be extremely commited. (Type in `2`) \n3)   I want to actively help the game and its development by providing aid in one particular field of which I am skilled at. (Type in `3`)\n\nFeel free to ask the <@&369499519794151425>, <@&369499281134059520>, or an <@&372096917611741184> for help!');

    //var roleIntro = member.guild.roles.find('name', 'Intro');
    //member.addRole(roleIntro);

  //});


  //bot.on('guildMemberRemove', member => {

    //bot.channels.get('369492433592909844').send('Sadly, ' + member.user.username + ' has just left the server. RIP...!');

 // });



const Discord = require("discord.js");

const client = new Discord.Client();


client.on("message",  (message) => {

    if (message.author.bot) return;

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch(command){
        case: 
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
                    message.channel.sendMessage(`${magicArray[randomReply]}`)
break;

});

//bot.login('MzcyMDM3ODQzNTc0NDU2MzQy.DM-WxQ.XrRQRbNdbV9VPD9DYgSHQIfMqdQ');

client.login(process.env.BOT_TOKEN);
