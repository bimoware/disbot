const { GuildMember } = require('discord.js');
const DisBot = require('../classes/DisBot')

module.exports = {
    /**
     * @param {DisBot} client 
     * @param {GuildMember} member
     */
    run : async (client, member) => {
        const { guild } = member;
        if(guild.id !== client.config.guilds.code) return;
        let name = member.nickname || member.user.username;

        await member.send(
            `<a:boost:965276661476106270> Merci énormement **${name}** pour avoir boost le serveur **${guild.name}** !!`
        );
    }
}