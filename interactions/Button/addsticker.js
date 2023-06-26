const { ButtonInteraction } = require("discord.js");
const DisBot = require("../../classes/DisBot");
/**
 * @param {DisBot} client
 * @param {ButtonInteraction} int
 */
module.exports.run = async (client, int) => {
    if (int.customId !== "addsticker") return;
    if (!int.member.permissions.has("ManageEmojisAndStickers")) return await int.deferUpdate();
    await int.deferReply({ ephemeral: true })
    let url = int.message.embeds[0].image.url
    let id = url.split('/').pop().split('.').shift();
    let sticker = await client.fetchSticker(id)
    try {
        await int.guild.stickers.create({
            name: sticker.name,
            description: sticker.description,
            file: sticker.url,
            tags: sticker.tags
        })
        await int.editReply(client.say('yes', int.user, 'Sticker créé'))
    } catch (err) {
        client.emit('error', err)
        return await int.editReply(client.say('warn', int.user, err.message))
    }
}
