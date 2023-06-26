const DisBot = require("../classes/DisBot")
const wait = require('util').promisify(setTimeout)
module.exports = {
    delay: 1000 * 60 * 10,
    /**
     * @param {DisBot} client 
     */
    async run(client) {
        let guild = client.guilds.cache.get(client.config.guilds.code);
        let roleId = client.config.roles.member;
        for(let member of Array.from(guild.members.cache.filter(m => !m.user.bot).values())){
            if(member.roles.cache.has(roleId)) return;
                await member.roles.add(role);
                await wait(1000 * 3);
        }
    }
}
