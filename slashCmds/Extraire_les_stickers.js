const { CommandInteraction, ApplicationCommandType, Sticker } = require('discord.js')
const DisBot = require('../classes/DisBot')
module.exports = {
    data: {
        type: ApplicationCommandType.Message,
        name: 'Extraire les stickers'
    },
    /**
     * @param {DisBot} client 
     * @param {CommandInteraction} int 
     * @param {Message} message 
     */
    run: async (client, int, message) => {
        /** @type {Sticker[]} */
        let stickers = Array.from(message.stickers.values())
        if (!stickers.length) return await int.reply(client.say('no',int.member,'Aucun sticker sur ce message.'))
        stickers = stickers.map(s => client.createEmbed(message.guild)
            .setImage(s.url)
            .setDescription([
                ["Nom",s.name,true],
                ["Serveur",s.guild?.name || s.guildId || client.config.e.no,false],
                ["Tags",!s.tags ? client.config.e.no : s.tags.map(t => `\`${t}\``).join(','),false],
                ["Description",s.description,true],
                ["Créé",`<t:${Math.floor(s.createdTimestamp / 1000)}:R>`,false]   
            ].map(l => `**${l[0]}:** ${l[2] ? `\`${l[1]}\`` : l[1] }` ).join('\n'))
            .setTitle(s.name)
        )
        // Bouton a ajouter pour ajouter le stickers
        const pages = client.initBasePageSystem(stickers)
            .addButton({
                customId: "addsticker",
                emoji: client.config.e.plus,
                style: "Success"
            })
        return await pages.start(int);
    }
}