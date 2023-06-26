const { Message } = require("discord.js")
const DisBot = require("../classes/DisBot")
const { chunk } = require('../proto')
module.exports = {
    aliases: ["e"],
    /**
     * @param {DisBot} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async run(client, message, args) {
        try {
            const code = args.join(" ");
            let evaled = await eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled)

            if (message.content.endsWith('//')) return;
            return await sendPages(evaled)

        } catch (err) {
            return await sendPages(err.message, err.stack)
        }

        async function sendPages(...desc) {
            let embeds = desc.map(desc => chunk(desc, 4000).map(e => client.createEmbed(message.guild)
                .setDescription(`\`\`\`js\n${e}\n\`\`\``))).flat(1);
            if (!embeds.length) return await message.react(client.config.e.no)
            if (embeds.length === 1) return await message.reply({ embeds });
            return await client.createPageEmbed(message, embeds);
        }
    }
}
