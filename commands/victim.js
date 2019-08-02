const fs = require("fs");
exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
    //lose a life
  const victim1 = JSON.parse(fs.readFileSync('data/victim.json')).victim1;
  //gain a life
  const victim2 = JSON.parse(fs.readFileSync('data/victim.json')).victim2;
  //gain 10 credits
  const victim3 = JSON.parse(fs.readFileSync('data/victim.json')).victim3;
  //lose 10 credits
  const victim4 = JSON.parse(fs.readFileSync('data/victim.json')).victim4;
  //neutral
  const victim5 = JSON.parse(fs.readFileSync('data/victim.json')).victim5;
  const outcomes = [1, 2, 3, 4, 5];
  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  // const lives = victimGameScore.lives
  //autospacing
  function victim(victimnum) {
    if (victimnum === 1)
      victim = victim1[client.rand(victim1.length)]
    if (victimnum === 2)
      victim = victim2[client.rand(victim2.length)]
    if (victimnum === 3)
      victim = victim3[client.rand(victim3.length)]
    if (victimnum === 4)
      victim = victim4[client.rand(victim4.length)]
    if (victimnum === 5)
      victim = victim5[client.rand(victim5.length)]
    if (victim.charAt(0) === "'" || victim.charAt(0) === ",")
      return victim
    else
      return " " + victim
  }
  // if (lives === 0) {
  //   message.channel.send(`You have 0 lives left!`);
  //   return;
  // } else
  if (outcome === 1) {
    // victimGameScore.lives -= 1;
    // client.setVictimGameScore.run(victimGameScore);
    message.channel.send(message.member.user + victim(1) + ". You lost a life!");
  } else
  if (outcome === 2) {
    // victimGameScore.lives++;
    // client.setVictimGameScore.run(victimGameScore);
    message.channel.send(message.member.user + victim(2) + ". You gained a life!");
  } else
  if (outcome === 3) {
    // victimGameScore.currency += 10;
    // client.setVictimGameScore.run(victimGameScore);
    message.channel.send(message.member.user + victim(3) + ". You gained Ꝟ10!");
  }
  if (outcome === 4) {
    // victimGameScore.currency -= 10;
    // client.setVictimGameScore.run(victimGameScore);
    message.channel.send(message.member.user + victim(4) + ". You lost Ꝟ10!");
  }
  if (outcome === 5) {
    message.channel.send(message.member.user + victim(5) + ". And nothing happened.");
}
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "victim",
  category: "Fun",
  description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
  usage: "victim"
};