const { UserContextMenuCommandInteraction } = require('discord.js');
const DisBot = require('../../classes/DisBot');;
/**
 * @param {DisBot} client 
 * @param {UserContextMenuCommandInteraction} int 
 */
module.exports.run = async (client, int) => {
    let name = int.commandName;
    let cmd = client.slashCmds.find(c => c.data.name === name);
    let member = int.targetMember
    
    try {
        await client.loadSlashCommand(cmd.data.name).run(client, int, member)
    } catch (err) {
        return client.emit('error', err);
    }
}
