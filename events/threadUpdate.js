const { ThreadChannel } = require('discord.js');
const DisBot = require('../classes/DisBot');

module.exports = {
    /**
     * @param {DisBot} client 
     * @param {ThreadChannel} last
     * @param {ThreadChannel} thread
     */
    async run(client,last,thread) {
        if(last.name !== thread.name){
            if(thread.parentId === client.config.channels.wikiParent){
                return await thread.send(client.say('✏',null,
                `Modification du titre (\`${last.name}\` -> \`${thread.name}\`)`))
            }
        }
    }
}