const { DiscordAPIError } = require('discord.js')
const DisBot = require('../classes/DisBot')
module.exports = {
    /**
     * @param {DisBot} client
     * @param {DiscordAPIError} err
     */
    async run(client,err){
        console.logg("🛑","Erreure")
        console.error(err);
    }
}