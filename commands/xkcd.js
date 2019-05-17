const request = require("request");
const Discord = require("discord.js");
exports.run = (client, message, args) => {
  if (args[0]) {
    if (args[0] === "latest")
      url = `https://xkcd.com/info.0.json`;
    else
      url = `https://xkcd.com/${args[0]}/info.0.json`;
    request({
      url: url,
      json: true,
    }, function(error, response, body) {
      const embed = new Discord.RichEmbed().setAuthor(body.title).setTitle(`#${body.num}`).setImage(body.img).addField("Date", `${body.day}/${body.month}/${body.year}`).addField("Alt", body.alt);
      message.channel.send({embed});
    });
  }
  if (!args[0]) {
    request({
      url: "https://xkcd.com/info.0.json",
      json: true,
    }, function(error, response, body) {
      randomcomic = client.getRandomInt(1, body.num);
      url = `https://xkcd.com/${randomcomic}/info.0.json`;
      request({
        url: url,
        json: true,
      }, function(error, response, body) {
        const embed = new Discord.RichEmbed().setAuthor(body.title).setTitle(`#${body.num}`).setImage(body.img).addField("Date", `${body.day}/${body.month}/${body.year}`).addField("Alt", body.alt);
        message.channel.send({embed});
      });
    });
  }
};
exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "xkcd",
  description: "Loads the xkcd img of your choosing",
  category: "Miscellaneous",
  usage: "...comic number"
};