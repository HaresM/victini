exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.channel.send("You can invite Victini to you server by clicking on the following link. Please note that Victini is still *in Beta*, and is buggy at the moment. For further inquiries, please contact user `Hares#5947`.\nhttps://discordapp.com/oauth2/authorize?client_id=372037843574456342&scope=bot&permissions=2146958591");
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "invite",
  category: "System",
  description: "Allows you to invite victini to your server.",
  usage: ""
};