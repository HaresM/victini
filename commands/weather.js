const fs = require("fs");
const weather = require("weather-js");
const Discord = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (args.length === 0) return message.channel.send('Please specify a location.');
    weather.find({
      search: args.join(" "),
      degreeType: 'C'
    }, function (err, result) {
      if (err) message.channel.send(err);
      if (result.length === 0) {
        message.channel.send('Location not found! Please specify a valid location.');
        return
      }
      const current = result[0].current;
      const location = result[0].location;
      if (location.timezone > 0)
        var timezone = "+" + location.timezone;
      if (location.timezone <= 0)
        timezone = location.timezone;
      var tmp = fs.readFileSync('data/colors.json');
      var colours = JSON.parse(tmp);
      var colour = colours[current.skytext];
      if (!colour) {
        colour = 0xff9e30;
      }
      const embed = new Discord.RichEmbed().setDescription(`**${current.skytext}**`).setAuthor(`Weather for ${current.observationpoint}`).setThumbnail(current.imageUrl).setColor(colour).addField('Timezone', `UTC ${timezone}`, !0).addField('Degree Type', location.degreetype, !0).addField('Temperature', `${current.temperature} Degrees`, !0).addField('Feels Like', `${current.feelslike} Degrees`, !0).addField('Winds', current.winddisplay, !0).addField('Humidity', `${current.humidity}%`, !0);
      message.channel.send({
        embed
      })
})
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "weather",
  category: "System",
  description: "Allows you to invite victini to your server.",
  usage: ""
};