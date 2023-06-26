const { ApplicationCommandData, ApplicationCommandOptionType, ChatInputCommandInteraction } = require('discord.js')
const DisBot = require('../classes/DisBot')
module.exports = {
    /** @type {ApplicationCommandData} */
    data: {
        name: "emoji",
        description: "Manipuler les emojis du serveur",
        type: 1,
        options: [
            {
                name: "create",
                description: "Créer un emoji",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "name",
                        description: "Nom de l'emoji",
                        type: ApplicationCommandOptionType.String,
                        required: true
                    },
                    {
                        name: "attachment",
                        description: "Fichier de l'emoji (GIF/PNJ/JPG/JPEG etc...)",
                        type: ApplicationCommandOptionType.Attachment,
                        required: true
                    }
                ]
            },
            {
                name: 'info',
                description: "Affiche des information sur un emoji",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "name",
                        description: "Nom de l'emoji",
                        type: ApplicationCommandOptionType.String,
                        required: true
                    }
                ]
            }
        ]
    },
    /**
     * @param {DisBot} client 
     * @param {ChatInputCommandInteraction} int
     */
    async run(client, int) {
        let subcommand = int.options.getSubcommand(true)
        let name = int.options.getString('name')
        
        if (subcommand === "create") {
            let attachment = int.options.getAttachment('attachment')
            await int.deferReply({ ephemeral: true })
            let emoji = await int.guild.emojis.create({ name, attachment: attachment.url })
            await int.editReply(client.say(emoji, int.user, `Emoji créé!`));

        } else if (subcommand === "info") {
            let emoji = int.guild.emojis.cache.find(e => e.name === name || e.name.startsWith(name) || e.name.includes(name));
            if (!emoji) return await int.reply(client.say("no", int.user, `Aucun emoji trouvé pour \`${name}\``));
            let createdTime = Math.floor(emoji.createdTimestamp / 1000);
            return await int.reply([
                ["Emoji:", emoji, false],
                ["Nom:", emoji.name, true],
                ["ID:", emoji.id, true],
                ["Animé:", client.config.e[emoji.animated ? "yes" : "no"], false],
                ["Créé:", `<t:${createdTime}:f> ( <t:${createdTime}:R> )`, false],
                ["URL:", emoji.url, false]
            ].map(lign => `**${lign[0]}** ${lign[2] ? `\`${lign[1]}\`` : `${lign[1]}`}`).join('\n'));
        }
    }
}