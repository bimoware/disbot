const { ThreadChannel } = require('discord.js');
const DisBot = require('../classes/DisBot')

module.exports = {
    /**
     * @param {DisBot} client
     * @param {ThreadChannel} thread
     */
    run: async (client, thread) => {
        let owner = await thread.fetchOwner()
        if (!owner) return;
        if (owner.guildMember.permissions.has('ManageThreads')) return;
        if (thread.parent.parentId === client.config.channels.searchParent) {
            let msg = thread.fetchStarterMessage();
            if (msg.content < 100) {
                let txt = `Votre post est trop pauvre. Veuillez élaborer un minimum dans la description du post et donner un maximum d'informations possible.`;
                let dm = await owner.guildMember.createDM().catch(() => null);
                if (!dm) return await msg.no(`${txt} (et active tes messages directs stp <3)`)
                return await Promise.all([
                    thread.delete(),
                    dm.no(txt)
                ]);
            }
            if (thread.name.length < 20) {
                return await thread.fetchStarterMessage().then(msg => msg.no(`Votre titre est trop pauvre. Veuillez <#${client.loadConfig.threads.threadTitle}>`));
            }
        }
    }
}