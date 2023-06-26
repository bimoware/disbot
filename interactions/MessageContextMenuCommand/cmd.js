const { MessageContextMenuCommandInteraction } = require('discord.js');
const DisBot = require('../../classes/DisBot');;
/**
 * @param {DisBot} client 
 * @param {MessageContextMenuCommandInteraction} int 
 */
module.exports.run = async (client, int) => {
    let name = int.commandName;
    console.log(name);
    let cmd = client.slashCmds.find(c => c.data.name === name);
    let message = int.targetMessage;
    
    try {
        await client.loadSlashCommand(cmd.data.name).run(client, int, message)
    } catch (err) {
        return client.emit('error', err);
    }
}
