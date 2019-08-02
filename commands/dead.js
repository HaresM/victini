exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.delete();
  message.channel.send("( ×ω× )");
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "dead",
  category: "Faces",
  description: "( ×ω× )",
  usage: "dead"
};