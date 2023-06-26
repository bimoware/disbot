const { Message, ChannelType } = require('discord.js')
const DisBot = require('../classes/DisBot')
module.exports = {
    /**
     * @param {DisBot} client
     * @param {Message} message
     */
    async run(client, message) {
        if (message.author.bot) return;
        if (message.channel.type === ChannelType.DM) return;
        if (!message.content?.startsWith(client.config.prefix)) return;

        let cmdName = message.content.split(' ')[0].slice(client.config.prefix.length);
        let matchedCmd = Array.from(client.textCmds.entries())
            .find(n => n[0] === cmdName || n[1].aliases.includes(cmdName))?.[0]
        if (!matchedCmd) return;
        try {
            await client.loadTxtCommand(matchedCmd).run(client, message, message.content.split(' ').slice(1));
        } catch (err) {
            return client.emit('error', err);
        }
    }
}