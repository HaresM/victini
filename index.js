const Discord = require('discord.js');
const bot = new Discord.Client();

const prefix = "v.";

//bot.registry.registerGroup('random', 'Random');
//bot.regisrtry.registerDefaults();
//bot.regisrtry.registerCommandsIn(__dirname + "/commands");

bot.on('guildMemberAdd', member => {

    bot.channels.get('369507173937709056').send('Welcome to the official Pokémon Victorius server, ' + member.user + ' ! To proceed, please type in a separate message the number which corresponds the most to the reason you have come to this server. \n\n1)    I want to support the game but do not wish to contribute anything. (Type in `1`) \n2)   I want to help the game by contributing something, but do not want to be extremely commited. (Type in `2`) \n3)   I want to actively help the game and its development by providing aid in one particular field of which I am skilled at. (Type in `3`)\n\nFeel free to ask the <@&369499519794151425>, <@&369499281134059520>, or an <@&372096917611741184> for help!');

    var roleIntro = member.guild.roles.find('name', 'Intro');
    member.addRole(roleIntro);

  });


  bot.on('guildMemberRemove', member => {

    bot.channels.get('369492433592909844').send('Sadly, ' + member.user.username + ' has just left the server. RIP...!');

  });



bot.on("message", (message) => {
    
  if (!message.content.startsWith(prefix)) return;

 //8ball command
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
	    'why are you asking me?',
	    'Follow the seahorse.',
	    'Very doubtful.'
    ];
    var randomReply = Math.floor(Math.random()*magicArray.length);
    message.channel.sendMessage(`${magicArray[randomReply]}`)
  } else
 //face commands
  if (message.content.startsWith(prefix + "shrug")) {
        message.delete();
        message.channel.send("¯\\_(ツ)_/¯");
  } else
  if (message.content.startsWith(prefix + "lenny")) {
        message.delete();
        message.channel.send("( ͡° ͜ʖ ͡°)");
  } else
   if (message.content.startsWith(prefix + "dead")) {
        message.delete();
        message.channel.send("( ×ω× )");
  } else
   if (message.content.startsWith(prefix + "angry")) {
        message.delete();
        message.channel.send("ヽ(#`Д´)ﾉ");
  } else
   if (message.content.startsWith(prefix + "shocked")) {
        message.delete();
        message.channel.send("Σ(ﾟДﾟ；≡；ﾟдﾟ)");
  } else
   if (message.content.startsWith(prefix + "superlenny")) {
        message.delete();
        message.channel.send("( ͡o ͜ʖ ͡o)");
  } 
  //story commmand
   //if (message.content.startsWith(prefix + "story")) {
    //    message.channel.send("Fated boy/girl who happens to live next to the pokemon lab gets tangled up with an evil organization after receiving a starter pokemon with a very rare genetic condition called "Alium Syndrome", works with professor and friends to prevent world annihilation from happening due to some evil dude taking advantage of this pokemon condition and abusing their power for his own gains. Using his newfound power he convinces a few renowned evil team leaders from around the pokemon world to help him create the perfect pokemon and rule over the world and its fate. However, the main character has the power to raise the odd pokemon to their full potential and use their power to foil the last part of the perfect pokemon, his creation, by obtaining victini, and then with the power of the victory pokemon is able to defeat the imperfect pokemon and restore peace.");
  //}
});

//bot.login('MzcyMDM3ODQzNTc0NDU2MzQy.DM-WxQ.XrRQRbNdbV9VPD9DYgSHQIfMqdQ');

bot.login(process.env.BOT_TOKEN);
