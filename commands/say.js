exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.delete()
  message.channel.send(client.clean(args.join(" ")));
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "say",
  category: "Miscellaneous",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "say msg"
};