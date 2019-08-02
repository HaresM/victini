exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const hugArray = ['1. You can do better.', '2. It\'s a start. ¯\\_(ツ)_/¯', '3. We\'re getting there.', '4. Now we\'re talking!', '5. This is getting spoopy.', '6. Your power is admirable.', '7. Simply... Amazing... o_0', '8. Everyone, evacuate this server!'];
  const randomReply = client.rand(hugArray.length);
  let member = message.mentions.members.first();
  if (!member)
    return message.channel.send("Mention the user you want to hug.");
  message.channel.send(member + " recieved a hug from " + message.author + ", with power " + hugArray[randomReply]);
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "hug",
  category: "Fun",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "ping"
};