exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.delete();
  message.channel.send("Σ(ﾟДﾟ；≡；ﾟдﾟ)");
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "shocked",
  category: "Faces",
  description: "Σ(ﾟДﾟ；≡；ﾟдﾟ)",
  usage: "shocked"
};