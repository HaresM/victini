exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.delete();
  message.channel.send("( ͡° ͜ʖ ͡°)");
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "lenny",
  category: "Faces",
  description: "Lennyface",
  usage: "lenny"
};