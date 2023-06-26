const { CommandInteraction, ApplicationCommandType, GuildMember } = require('discord.js')
const DisBot = require('../classes/DisBot');

module.exports = {
    data : {
        type: ApplicationCommandType.User,
        name: "Appareils connectés"
    },
    /**
     * 
     * @param {DisBot} client 
     * @param {CommandInteraction} int 
     * @param {GuildMember} member 
     * @returns 
     */
    run: async (client, int, member ) => {
        let d = member.user.id === int.user.id ? "votre présence" : `la présence de <@${member.user.id}>`;
        if(!member.presence) return await int.reply(client.say('no',int.member,`Je ne peux accéder a ${d}`))
        const _d = member.presence.clientStatus;
        const devices = [];
        if(_d.desktop) devices.push("un ordinateur");
        if(_d.mobile ) devices.push("un portable");
        if(_d.web    ) devices.push("le web");
        d = member.user.id == int.user.id ? "Vous êtes" : `**${member.user.tag}** est`;
        if(!_d) return await int.reply(client.say('no',null,`${d} n'utilise aucun appareil. (ou est en \`Invisible\`).`));
        return await int.reply(client.say('yes',null,`${d} connecté via ${devices.human("et")}`));
    }
}