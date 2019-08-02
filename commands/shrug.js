exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.delete();
  message.channel.send("¯\\_(ツ)_/¯");
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "shrug",
  category: "Faces",
  description: "¯\\_(ツ)_/¯",
  usage: "shrug"
};