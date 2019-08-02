module.exports = {
  defaultChannel: function(guild) {
    var defaultChannel = guild.channels.find(c => c.name.toLowerCase().includes('general') && c.type === "text");
    var availableChannels = guild.channels.filter(channel => channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
    
    if (defaultChannel === null) {
        return availableChannels;
    } 
    else {
        return defaultChannel;
    }
  }
};