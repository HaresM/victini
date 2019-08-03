// This event executes when a new guild (server) is joined.
module.exports = (client, guild) => {
  client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);
  // var newGuild = require('./../modules/defaultChannel.js');
  // var defaultChannel = "";
  // newGuild.defaultChannel(guild) = defaultChannel;
  // defaultChannel.send('Hey, I am Victini. Nice to meet you! I am here to make your life easier and more fun, with handy commands and text-based adventures! Use the `v.help`-command to get information of my commands, prefix, and much more, and if you face any problems or have any questions in general, contact my creator, `Hares#5947`!');
};