const { CommandInteraction, ApplicationCommandOptionType } = require('discord.js')
const DisBot = require('../classes/DisBot');

module.exports = {
	data : {
        name:"timestamp",
		description : 'Extrait une timestamp et la formatte pour toi',
        options : [
            {
                name : 'time',
                description : 'Un timestamp déjà prét (sinon, le timestamp du présent).',
                type: ApplicationCommandOptionType.Number,
            }
        ]
	},
    /**
     * 
     * @param {DisBot} client 
     * @param {CommandInteraction} int 
     */
    run: async (client, int) => {
        delete require.cache[require.resolve('../classes/other/Timestamp')]
        const Timestamp = require('../classes/other/Timestamp');
        let time = int.options.getNumber('time') || (Date.now() / 1000)
        let unix = new Timestamp(int,time);
        unix.start();
    }
}