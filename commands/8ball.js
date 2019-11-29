exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const magicArray = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'I would not count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Are you done asking questions yet?', 'Why the fuck should I even know this?', 'The answer lies within yourself.', 'Why are you asking me?', 'Follow the seahorse.', 'Very doubtful.'];
  const randomReply = Math.floor(Math.random() * magicArray.length);
  message.channel.send(`${magicArray[randomReply]}`)
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "8ball",
  category: "Miscellaneous",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "say msg"
};