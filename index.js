// --
require('dotenv').config()
// --
const { ActivityType } = require('discord.js')
const DisBot = require('./classes/DisBot')
const client = new DisBot({
    intents : ["Guilds","GuildMessages","GuildMembers","MessageContent","GuildVoiceStates"],
    ws: { properties: { browser: 'Discord iOS' } },
    presence: {
        activities: [
            {
                type: ActivityType.Listening,
                name: 'mes membres'
            }
        ]
    }
})

client.login(process.env.TOKEN)