exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  let member = message.mentions.members.first();
  if (!member)
    return message.channel.send("Please mention a valid member of this server");
  if (!member.kickable)
    return message.channel.send("The specified user could not be kicked.");
  let reason = args.slice(1).join(' ');
  if (!reason)
    return message.channel.send("Please indicate a reason for the kick!");
  member.kick(message.author.tag + ": " + reason).then(message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag}, because: of the following reason: \`\`\`${reason}\`\`\``))
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "kick",
  category: "System",
  description: "Kick",
  usage: "kick member reason"
};