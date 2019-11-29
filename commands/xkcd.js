const request = require("request");
exports.run = (client, message, args) => {
  let url = "https://xkcd.com/info.0.json";
  if (args[0] && args[0] !== "latest")
    url = `https://xkcd.com/${args[0]}/info.0.json`;
  else if (!args[0])
    request({url: url, json: true}, function (error, response, body) {url = `https://xkcd.com/${client.getRandomInt(1, body.num)}/info.0.json`});
  request(
    {
      url: url,
      json: true
    },
    function(error, response, body) {
      const embed = client.embed
        .setAuthor(body.title)
        .setTitle(`#${body.num}`)
        .setImage(body.img)
        .addField("Date", `${body.day}/${body.month}/${body.year}`)
        .addField("Alt", body.alt);
      message.channel.send({ embed });
    }
  );
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
