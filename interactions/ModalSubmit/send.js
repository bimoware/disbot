const { ModalSubmitInteraction } = require('discord.js');
const DisBot = require('../../classes/DisBot');
/**
 * @param {DisBot} client
 * @param {ModalSubmitInteraction} int
 */
module.exports.run = async (client, int) => {
    let [customId, userId] = int.customId.split('_')
    if (customId !== "send") return;
    await int.deferReply({ ephemeral: true });
    try {
        let dm = await client.users.createDM(userId)
        await dm.send(int.fields.fields.get('msg').value)
        await int.editReply(client.say("yes",int.user,"Message envoyé !"))
    } catch (err) {
        console.error(err)
        return await int.editReply(client.say('warn',int.user,err.message))
    }
}
