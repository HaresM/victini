module.exports = async (command, args, message) => {
  var spriterRole = message.guild.roles.find('name', 'Spriter');
  var mapperRole = message.guild.roles.find('name', 'Mapper');
  var coderRole = message.guild.roles.find('name', 'Coder');
  var writerRole = message.guild.roles.find('name', 'Writer');
  var composerRole = message.guild.roles.find('name', 'Composer');
  var redRole = message.guild.roles.find('name', 'red');
  var blueRole = message.guild.roles.find('name', 'blue');
  var yellowRole = message.guild.roles.find('name', 'yellow');
  var limeRole = message.guild.roles.find('name', 'lime');
  var purpleRole = message.guild.roles.find('name', 'purple');
  var pinkRole = message.guild.roles.find('name', 'pink');
  var orangeRole = message.guild.roles.find('name', 'orange');
  if (command === "role") {
    if (args[0] === "add") {
      if (args[1] === "spriter") {
        message.member.addRole(spriterRole).then(message.channel.send('Successfully added the role: `Spriter`.'));
      } else
      if (args[1] === "coder") {
        message.member.addRole(coderRole).then(message.channel.send('Successfully added the role: `Coder`.'));
      } else
      if (args[1] === "composer") {
        message.member.addRole(composerRole).then(message.channel.send('Successfully added the role: `Composer`.'));
      } else
      if (args[1] === "mapper") {
        message.member.addRole(mapperRole).then(message.channel.send('Successfully added the role: `Mapper`.'));
      } else
      if (args[1] === "writer") {
        message.member.addRole(writerRole).then(message.channel.send('Successfully added the role: `Writer`.'));
      } else
      if (args[1] === "red") {
        message.member.addRole(redRole).then(message.channel.send('Successfully added the role: `red`.'));
      } else
      if (args[1] === "blue") {
        message.member.addRole(blueRole).then(message.channel.send('Successfully added the role: `blue`.'));
      } else
      if (args[1] === "yellow") {
        message.member.addRole(yellowRole).then(message.channel.send('Successfully added the role: `yellow`.'));
      } else
      if (args[1] === "lime") {
        message.member.addRole(limeRole).then(message.channel.send('Successfully added the role: `lime`.'));
      } else
      if (args[1] === "purple") {
        message.member.addRole(purpleRole).then(message.channel.send('Successfully added the role: `purple`.'));
      } else
      if (args[1] === "pink") {
        message.member.addRole(pinkRole).then(message.channel.send('Successfully added the role: `pink`.'));
      } else
      if (args[1] === "orange") {
        message.member.addRole(orangeRole).then(message.channel.send('Successfully added the role: `orange`.'));
      } else {
        message.channel.send("Please provide a valid role. You can choose to be a `mapper`, `composer`, `coder`, `writer` or `spriter`. Alternatively, you can add the following colours to yourself: `red`, `blue`, `yellow`, `lime`, `purple`, `pink` and `orange`.");
      }
    }
    if (args[0] === "remove") {
      if (args[1] === "spriter") {
        message.member.removeRole(spriterRole).then(message.channel.send('Successfully removed the role: `Spriter`.'));
      } else
      if (args[1] === "coder") {
        message.member.removeRole(coderRole).then(message.channel.send('Successfully removed the role: `Coder`.'));
      } else
      if (args[1] === "composer") {
        message.member.removeRole(composerRole).then(message.channel.send('Successfully removed the role: `Composer`.'));
      } else
      if (args[1] === "mapper") {
        message.member.removeRole(mapperRole).then(message.channel.send('Successfully removed the role: `Mapper`.'));
      } else
      if (args[1] === "writer") {
        message.member.removeRole(writerRole).then(message.channel.send('Successfully removed the role: `Writer`.'));
      } else
      if (args[1] === "red") {
        message.member.removeRole(redRole).then(message.channel.send('Successfully removed the role: `red`.'));
      } else
      if (args[1] === "blue") {
        message.member.removeRole(blueRole).then(message.channel.send('Successfully removed the role: `blue`.'));
      } else
      if (args[1] === "yellow") {
        message.member.removeRole(yellowRole).then(message.channel.send('Successfully removed the role: `yellow`.'));
      } else
      if (args[1] === "lime") {
        message.member.removeRole(limeRole).then(message.channel.send('Successfully removed the role: `lime`.'));
      } else
      if (args[1] === "purple") {
        message.member.removeRole(purpleRole).then(message.channel.send('Successfully removed the role: `purple`.'));
      } else
      if (args[1] === "pink") {
        message.member.removeRole(pinkRole).then(message.channel.send('Successfully removed the role: `pink`.'));
      } else
      if (args[1] === "orange") {
        message.member.removeRole(orangeRole).then(message.channel.send('Successfully removed the role: `orange`.'));
      } else {
        message.channel.send("Please provide a valid role. You can remove the roles: `mapper`, `composer`, `coder`, `writer` or `spriter`. Alternatively, you can remove the following colours to yourself: `red`, `blue`, `yellow`, `lime`, `purple`, `pink` and `orange`.");
      }
    }
  }
}