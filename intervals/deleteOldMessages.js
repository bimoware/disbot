const DisBot = require("../classes/DisBot")
module.exports = {
    delay: 1000 * 60 * 30,
    /**
     * @param {DisBot} client 
     */
    async run(client) {
        const MESSAGE_LIVE_TIME = 24 * 60 * 60 * 1000;
        // Remove every message on cache that's been sent more than 24 hours ago
        client.channels.cache.forEach(c => {
            if(c.isTextBased()) c.messages.cache
            .filter(m => m.createdTimestamp < (Date.now() - MESSAGE_LIVE_TIME))
            .forEach(m => c.messages.cache.delete(m.id))
        })
    }
}