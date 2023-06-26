const { GuildMember } = require('discord.js');
const DisBot = require('../classes/DisBot')
module.exports = {
    /**
     * @param {DisBot} client 
     * @param {GuildMember} member
     */
    run: async (client, member) => {
        if (member.user.bot) return;
        if (member.guild.id === client.config.guilds.code) {

            let text = m => `${getEmoji("wow")} Bienvenue mon p'tit ${m.user.username.toLowerCase()} dans **${m.guild.name}** ${getEmoji("wave")} 

Ici c'est un serveur communautaire autour de la programmation/informatique, tu peux chatter avec d'autre personnes sur ce sujet, partager et collaborer sur des wikis mais surtout **s'entraider**.
${getEmoji("heart")} Si t'a le temps, tu peux aller voir les autre salons du serveur et découvrir leur individuelle utilité. Sur ce, je te laisse mon ami ! Passe un bon séjour sur **${m.guild.name}** ${getEmoji("whale")}`;

            await member.roles.add(client.config.roles.member)
            return await member.send(text(member))
        }
        function getEmoji(name){
            let guild = client.guilds.cache.get(client.config.guilds.code)
            return guild.emojis.cache.find(e => e.name === name || e.name.includes(name));
        }
    }
}