exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {
    const code = args.join(" ");
    let evaled = eval(code);
    if (typeof evaled !== "string")
      evaled = require("util").inspect(evaled);
    message.channel.send(client.clean(evaled), {code:"xl"});
  }
  catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "eval",
  category: "System",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "ping"
};