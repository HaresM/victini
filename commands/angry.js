exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.delete();
  message.channel.send("ヽ(#`Д´)ﾉ");
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "angry",
  category: "Faces",
  description: "ヽ(#`Д´)ﾉ",
  usage: "angry"
};