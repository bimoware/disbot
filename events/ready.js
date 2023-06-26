const DisBot = require('../classes/DisBot')
module.exports = {
    once: true,
    /** @param {DisBot} client */
    async run(client){
        console.logg(`✨`,`Connecté -> ${client.user.tag}`)
        client.loadEmojis();
        // await client.putSlashCommands(client.config.guilds.test);
    }
}
