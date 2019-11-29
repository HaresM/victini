exports.run = async (client, message, args, level) => {
  // eslint-disable-line no-unused-vars
  message.channel.send("", { files: ["images/sketch1509192675057.png"] });
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "helper",
  category: "Miscellaneous",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "say msg"
};
