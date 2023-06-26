const { CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType } = require('discord.js')
const DisBot = require('../classes/DisBot');
module.exports = {
	data : {
        name: "calculator",
		description : 'Ouvre une calculatrice trés compléte pour toi',
		options : [
			{
				name : "input",
				description : "What to calculate?",
                type: ApplicationCommandOptionType.String
			}
		]
	},
    /**
     * @param {DisBot} client 
     * @param {CommandInteraction} int 
     */
    run: async (client, int) => {
        delete require.cache[require.resolve('../classes/other/Calculator')]
        const Calculator = require('../classes/other/Calculator');
        let input = int.options.getString('input') || "";
        if(!validate(input)) return await int.reply(client.say('no',int.member,'Calcul invalide.'));
        let calculator = new Calculator(int,input);
        return await calculator.start();

        function validate(input){
            return input.split('').every(c => "1234567890*+-/()^%".includes(c))
        }
    }
}
