exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.delete();
  message.channel.send("( ͡o ͜ʖ ͡o)");
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "superlenny",
  category: "Faces",
  description: "( ͡o ͜ʖ ͡o)",
  usage: "superlenny"
};