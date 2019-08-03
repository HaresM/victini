exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.channel.send(typeof(args[0]))
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "test",
  category: "System",
  description: "dummy file",
  usage: "superlenny"
};