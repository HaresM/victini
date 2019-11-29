const malScraper = require("mal-scraper");
exports.run = async (client, message, args, level) => {
  // eslint-disable-line no-unused-vars
  malScraper.getInfoFromName(args.join(" ")),
    function(data) {
    message.channel.send("test")
      let embed = client.embed
        .setAuthor(data.title)
        .setTitle(`aka ${data.englishTitle} / ${data.synonyms}`)
        .setImage(data.picture);
      message.channel.send({ embed });
    };
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "mal",
  category: "Faces",
  description: "",
  usage: "superlenny"
};
