module.exports = async(type, args, message, isBotExec) => {
  if (type === "gen-info") {
    switch (args[1]) {
      case "prefix":
        message.channel.send("Victini's prefix is `v.` Note that this is a *lower-case* \"v\"!");
        break;
      case "invite":
        message.channel.send("You can invite Victini to you server by clicking on the following link. Please note that Victini is still *in Beta*, and is buggy at the moment. For further inquiries, please contact user `Hares#5947`.\nhttps://discordapp.com/oauth2/authorize?client_id=372037843574456342&scope=bot&permissions=2146958591");
        break;
      default:
        message.channel.send("Type the following commands to get help on specific stuff:\n```v.help gen-info prefix\nv.help gen-info invite```");
      }
  }
  if (type === "commands") {
    switch (args[1]) {
      case "8ball":
        message.channel.send("The `v.8ball`-command sends a reply to a question that can be answered with yes or no. You use this command as follows: `v.8ball` `[your yes/no question]`.");
        break;
      case "helper":
        message.channel.send("The `v.helper`-command sends a image of Victini made by `#Greedere Ganciel#3872`.");
        break;
      case "lenny":
        message.channel.send("The `v.lenny`-command sends a lenny-face ( ( ͡° ͜ʖ ͡°) ). What more is there to say?");
        break;
      case "shrug":
        message.channel.send("The `v.shrug`-command sends a shrug emoticon ( ¯\\_(ツ)_/¯ ).");
        break;
      case "dead":
        message.channel.send("The `v.dead`-command sends a cute dead face ( ( ×ω× ) ).");
        break;
      case "angry":
        message.channel.send("The `v.angry`-command sends an emoticon that represents an angry face ( ヽ(#`Д´)ﾉ )");
        break;
      case "shocked":
        message.channel.send("The `v.shocked`-command sends an emoticon that represents an shocked face ( Σ(ﾟДﾟ；≡；ﾟдﾟ) )");
        break;
      case "superlenny":
        message.channel.send("The `v.superlenny`-command sends sends a buffed up version of a lenny-face ( ( ͡o ͜ʖ ͡o) )");
        break;
      case "victim":
        message.channel.send("Use the `v.victim`-command to test how lucky you are... or misfortunate... You can either lose a life, gain a life, or gain Ꝟ-currency by using this command. Simply type in `v.victim` and see what happens!");
        break;
      case "weather":
        message.channel.send("The `v.weather`-command sends the weather of the location you specify. You use this command as follow: `v.weather` `[a real life location]`");
        break;
      case "convert":
        message.channel.send("The `v.convert`-command converts a temperature to Degrees Celsius or Degrees Fahrenheit. If you want to convert `[a number]` to Degrees Fahrenheit, you use this command as follows: `v.convert` `f` `[a number]`. On the other hand, if you want to convert `[a number]` to Degrees Celsius, you use this command as follows: `v.convert` `c` `[a number]`.");
        break;
      case "hug":
        message.channel.send("Use the `v.hug`-command to express your love to someone. Everytime this command is used, a number is given to the power of your hug. Can you hug with the most power? Use this command as follows: `v.hug` `@[user you want to hug]`");
        break;
      case "reminder":
        message.channel.send("When using the `v.reminder`-command, you will receive a DM after the amount of specified time *in minutes* of something you wanted to be reminded of. Use this command as follows: `v.reminder` `[time in minutes, a number]` `[thing you want to be reminded of]`");
        break;
      case "score":
        message.channel.send("Use the `v.score`-command to check your current level, your EXP and the amount of EXP needed to level up, your rank in the server (according to level), the amount of lives you have and the amount of Ꝟ-currency you have.");
        break;
      case "top":
        message.channel.send("The `v.top`-command shows the top users in the server you use the command in, according to level. You can check your current level with the `v.level`-command!");
        break;
      case "wheel":
        message.channel.send("Use the `v.wheel`-command to gain goodies such as extra lives and Ꝟ-currency every 6 hours!");
        break;
      case "shop":
        message.channel.send("Use the `v.shop` command to buy goodies such as additional lives and collectibles, in exhange for Ꝟ-currency! Note that you can unlock items by leveling up. Use this command as follows: `v.shop` `[number in front of item you want to purchase`.");
        break;
      default:
        message.channel.send("Type the following commands to get help on specific stuff:\n```v.help commands 8ball\nv.help commands helper\nv.help commands victim\nv.help commands wheel\nv.help commands weather\nv.help commands convert\nv.help commands hug\nv.help commands reminder\nv.help commands score\nv.help commands top```");
      }
  }
  if (type === "exec-only") {
      if (isBotExec(message.member)) {
        switch (args[1]) {
        case "say":
          message.channel.send("Use the `v.say`-command to let Victini mimic what you say. Use this command as follows: `v.say` `[the sentence you want Victini to repeat]`");
          break;
        case "kick":
          message.channel.send("The `v.kick`-command kicks a user. It's that straightforward. Use this command as follows: `v.kick` `@[user you want to kick]` `[reason as to why you want to kick this person]`");
          break;
        case "clear":
          message.channel.send("The `v.clear`-command deletes the amount of specified messages. Note that the command itself counts as a message as well. Use this command as follows: `v.clear` `[amount of messages you want to clear]`");
          break;
        case "give":
          message.channel.send("The `v.give`-command allows Execs to give either `levels`, `exp` or `currency` to users in a server. Use this command as follows: `v.give` `@[user you want to give something to] `[level/exp/currency (choose 1)]` `[amount you want to give]`");
          break;
        default:
          message.channel.send("Type the following commands to get further help:\n```v.help exec-only say\nv.help exec-only kick\nv.help exec-only clear```");
        }
      } else
        message.channel.send("Exec-only commands require the `Victini Exec`-role to be used.");
    }
  if (!type) {
    message.channel.send("Type the following commands to get help on specific stuff:\n```v.help gen-info\nv.help commands\nv.help exec-only```")
  }
}