const { ButtonInteraction, PermissionFlagsBits } = require("discord.js");
const DisBot = require("../../classes/DisBot");
/**
 * @param {DisBot} client
 * @param {ButtonInteraction} int
 */
module.exports.run = async (client, int) => {
    if (int.customId !== "delete-ticket") return;
    const { channel } = int;
    if (!int.member.permissions.has(PermissionFlagsBits.ManageChannels))
        return await int.reply(client.say('no',int.user,'Seuls les administrateurs peuvent supprimer ce ticket.'));
    await int.reply(client.say('yes',int.user,`Le salon seras supprimé <t:${Math.floor((Date.now() / 1000) + 10)}:R>`))
    return setTimeout(() => channel.delete().catch(_ => 0), 1000 * 10);
}