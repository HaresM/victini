exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.reply(`My prefix on this guild is \`${client.getSettings(message.guild)}\``);
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "prefix",
  category: "System",
  description: "Tells you the prefix used by the bot.",
  usage: "prefix"
};