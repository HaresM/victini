exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.channel.send("", {files: ["images/the_real_thinking_emoji.gif"]});
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "thinking",
  category: "Faces",
  description: "",
  usage: "superlenny"
};