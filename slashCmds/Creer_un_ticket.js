const { ApplicationCommandType, ApplicationCommandData, CommandInteraction, GuildMember } = require('discord.js')
const DisBot = require('../classes/DisBot');
module.exports = {
    /** @type {ApplicationCommandData} */
    data: {
        type: ApplicationCommandType.User,
        name: "Créer un ticket",
        defaultMemberPermissions: ["ModerateMembers"]
    },
    /**
     * @param {DisBot} client
     * @param {CommandInteraction} int
     * @param {GuildMember} member
     */
    run: async (client, int, member) => {
        let ticketSystem = require('../interactions/StringSelectMenu/ticket');
        let ticket = await ticketSystem.createFor(member)
        await Promise.all([
            int.reply({
                content: client.say("yes",int.member,"Ticket créé -> ${ticket}"),
                ephemeral: true
            }),
            ticketSystem.sendInTicket(client,ticket,member,"by-staff", int.member)
        ]);
    }
}