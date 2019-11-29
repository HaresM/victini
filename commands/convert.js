const math = require("mathjs");
exports.run = async (client, message, args, level) => {
  // eslint-disable-line no-unused-vars
  try {
    const a = math.unit(args[0]);
    message.channel.send(`${args[0]} = ${a.to(args[1])}`);
  }
  catch (err) {
    message.channel.send("An error occured please report it: ```" + err + "```");
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "convert",
  category: "Miscellaneous",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "say msg"
};
