const { VoiceState, ChannelType, GuildMember } = require('discord.js');
const DisBot = require('../classes/DisBot')

module.exports = {
    /**
     * @param {DisBot} client 
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     */
    run: async (client, oldState, newState) => {
        let createId = client.config.channels.voiceCreate; // Crée ton Vocal
        let { parentId } = client.channels.cache.get(createId); // # IMPORTANT

        /** @type {GuildMember} */
        let member = newState?.member || oldState?.member;
        if (oldState.channelId === newState.channelId) return;

        // Rejoind un salon vocal
        if (newState.channel) {
            // Si c'est la catégorie des vocaux
            if (newState.channel.parentId === parentId) {
                // Si c'est le salon create
                if (newState.channelId === createId) {

                    // Si la personne avait déjà son salon perso
                    let oldChannelId = await client.db.get(`voice.${member.id}`).catch(() => null);
                    let oldChannel = oldChannelId ? await client.channels.fetch(oldChannelId) : null
                    if (oldChannel) return await newState.setChannel(oldChannelId);

                    // Sinon, on en crée un
                    let name = member.nickname || member.user.username;
                    // Créer un salon + move
                    let channel = await newState.guild.channels.create({
                        name: `🍺〢Salon ${startsWithVoyel(name) ? "d'" : "de "}${name}`,
                        type: ChannelType.GuildVoice,
                        topic: member.id,
                        parent: parentId,
                        permissionOverwrites: [
                            {
                                id: member.id,
                                allow: ["AddReactions", "AttachFiles", "Connect", "CreatePrivateThreads", "CreatePublicThreads", "DeafenMembers", "EmbedLinks", "ManageChannels", "ManageMessages", "ManageThreads", "ManageWebhooks", "MuteMembers", "PrioritySpeaker", "SendMessages", "SendMessagesInThreads", "SendTTSMessages", "Speak", "Stream", "UseEmbeddedActivities", "UseVAD", "MoveMembers"]
                            }
                        ]
                    });
                    return await Promise.all([
                        newState.setChannel(channel),
                        client.db.set(`voice.${member.id}`, channel.id)
                    ])

                }
            }
        } else if (oldState.channelId) {
            // Si (dans la catégorie vocal) et (pas le salon create) et (plus personne dans le salon)
            if (oldState.channel.parentId === parentId) {
                if (oldState.channelId !== createId
                    && !oldState.channel.members.size) return oldState.channel.delete();
            }

        }

        function startsWithVoyel(txt) {
            return ["a", "e", "y", "i", "o", "u"].some(v => v === txt[0].toLowerCase())
        }
    }
}