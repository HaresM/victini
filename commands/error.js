exports.run = (client, message, args, level) => {
  client.client.client
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "error",
  category: "System",
  description: "Throws an error.",
  usage: "error"
};
