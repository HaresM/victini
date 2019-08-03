const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(" D [days], H [hours], m [minutes], s [seconds]");
  message.channel.send(`= SERVER STATISTICS =
• Users      :: ${message.guild.memberCount.toLocaleString()}
• Channels   :: ${message.guild.channels.size.toLocaleString()}
•  Roles      :: ${message.guild.roles.size}
`, {code: "asciidoc"});
};

exports.conf = {
  enabled: true,
  aliases: ["serverstatistics"],
  permLevel: "User"
};

exports.help = {
  name: "serverstats",
  category: "System",
  description: "Gives some useful bot statistics",
  usage: "stats"
};