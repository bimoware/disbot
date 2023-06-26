const { Interaction } = require('discord.js')
const { readdirSync } = require('fs')
const DisBot = require('../classes/DisBot')
module.exports = {
    /**
     * @param {DisBot} client
     * @param {Interaction} int
    */
    async run(client, int) {
        for (let type of readdirSync('./interactions/')) {
            if (int[`is${type}`]()) {
                let fileNames = readdirSync(`./interactions/${type}`)
                for (let fileName of fileNames) {
                    console.logg("📩", `Interaction reçue de ${int.user.tag} (${type})${int.commandName ? ` -> ${int.commandName}` : ""}`)
                    delete require.cache[require.resolve(`../interactions/${type}/${fileName}`)]
                    let intFile = require(`../interactions/${type}/${fileName}`)
                    await intFile.run(client, int);
                }
            }
        }
    }
}