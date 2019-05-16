/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/

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
