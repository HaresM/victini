const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(" D [days], H [hours], m [minutes], s [seconds]");
  message.channel.send(`= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.size.toLocaleString()}
• Servers    :: ${client.guilds.size.toLocaleString()}
• Channels   :: ${client.channels.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}`, {code: "asciidoc"});
};

exports.conf = {
  enabled: true,
  aliases: ["statistics"],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: "System",
  description: "Gives some useful bot statistics",
  usage: "stats"
};