const { CommandInteraction, ApplicationCommandType, GuildMember, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, PermissionFlagsBits } = require('discord.js')
const DisBot = require('../classes/DisBot');
module.exports = {
    data: {
        type: ApplicationCommandType.User,
        defaultMemberPermissions: [PermissionFlagsBits.ModerateMembers],
        name: "Envoyer un message"
    },
    /**
     * @param {DisBot} client
     * @param {CommandInteraction} int
     * @param {GuildMember} member
     */
    run: async (client, int, member) => {
        if(member.user.id === client.user.id) return await int.reply({
            content: client.say('no',int.member,"Je ne peux pas me parler tout seul..."),
            ephemeral: true
        })
        let modal = new ModalBuilder()
        .setTitle('Message')
        .setCustomId(`send_${member.id}`)
        .setComponents(
            new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                .setCustomId("msg")
                .setLabel("Message")
                .setRequired(true)
                .setValue("")
                .setStyle(TextInputStyle.Paragraph)
            ),
            new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                .setCustomId("void")
                .setLabel("Emojis")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setValue(`Ce field est uniquement là pour vous permettre de facilement copier coller les emojis du bot. Laissez le ou videz le, cela ne changeras rien.\n\n${Object.keys(client.config.e).map(k => `${k} -> ${client.config.e[k]}`).join('\n')}`)
            )
        )
        return await int.showModal(modal)
    }
}