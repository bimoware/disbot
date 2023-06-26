const { Client, Collection, Message, Interaction } = require('discord.js')
const Database = require('./Database')
const fs = require('fs');
const { EmbedBuilder } = require('@discordjs/builders');
const PageSystem = require('dispage')

module.exports = class DisBot extends Client {
    constructor(options) {
        super(options);
        this.imgOpts = { dynamic: true, size: 4096, format: "png" };
        /** Function used to search on discord.js documentation  */
        this.db = new Database("./db.json");
        return this.initBot()
    }
    initBot() {
        this.loadProto()
        this.loadConfig()
        this.initCollections()
        this.loadEvents()
        this.loadTxtCommands()
        this.loadSlashCommands()
    }
    initCollections() {
        /**
         * Collection of bot's events
         * @type {Collection<string,object>} 
         */
        this.events = new Collection();
        /**
         * Collection of bot's commmands
         * @type {Collection<string,object>} 
         */
        this.textCmds = new Collection();
        /**
         * Collection of bot's slash commmands
         * @type {Collection<string,object>} 
         */
        this.slashCmds = new Collection();
    }
    loadConfig() {
        delete require.cache[require.resolve('../config.json')]
        this.config = require('../config.json')
        if (this.isReady()) this.loadEmojis()
        console.logg('✅', 'Configurations loaded.')
    }
    loadProto() {
        delete require.cache[require.resolve('../proto.js')]
        this.proto = require('../proto.js')
        console.logg('✅', 'Prototypes loaded.')
    }
    loadEmojis() {
        this.config.e = {};
        let guildId = this.config.guilds.test;
        let emojis = this.guilds.cache.get(guildId).emojis.cache.map(e => e)
        for (let emoji of emojis) {
            this.config.e[emoji.name] = emoji.toString();
        }
    }
    loadEvents() {
        let eventNames = fs.readdirSync("./events")
            .map(en => en.slice(0, -3)) // supprimer ".js"
        for (let eventName of eventNames) {
            delete require.cache[require.resolve(`../events/${eventName}`)]
            let eventFile = require(`../events/${eventName}`)
            this.events.set(eventName, eventFile)
            this.removeAllListeners(eventName)
            this[eventFile.once ? "once" : "on"](eventName, async (...args) => {
                try {
                    await eventFile.run(this, ...args)
                } catch (err) {
                    this.emit('error', err);
                }
            })
        }
        console.logg('✅', `Events loaded.`)
    }
    loadTxtCommands() {
        let cmdNames = fs.readdirSync("./textCmds")
            .map(en => en.slice(0, -3)) // supprimer ".js"
        for (let cmdName of cmdNames) { this.loadTxtCommand(cmdName) }
        console.logg('✅', `Text commands loaded.`)
    }
    loadTxtCommand(cmdName) {
        delete require.cache[require.resolve(`../textCmds/${cmdName}`)]
        let cmdFile = require(`../textCmds/${cmdName}`)
        this.textCmds.set(cmdName, cmdFile)
        return cmdFile;
    }
    loadSlashCommands() {
        let cmdNames = fs.readdirSync("./slashCmds")
            .map(en => en.slice(0, -3)) // supprimer ".js"
        for (let cmdName of cmdNames) {
            this.loadSlashCommand(cmdName)
        }
        console.logg('✅', `Slash commands loaded.`)
    }
    loadSlashCommand(cmdName) {
        let fileName = cmdName.split(' ').join('_').split('é').join('e');
        delete require.cache[require.resolve(`../slashCmds/${fileName}`)]
        let cmdFile = require(`../slashCmds/${fileName}`)
        this.slashCmds.set(cmdName, cmdFile)
        return cmdFile;
    }
    /** @param {string?} guildId */
    async putSlashCommands(guildId) {
        let data = this.slashCmds.map(cmd => cmd.data);
        return await (guildId ? this.guilds.cache.get(guildId) : this.application).commands.set(data)
            .then(data => console.logg("🔔", `${data.size} commandes slash postées`))
    }
    initBasePageSystem(embeds){
        return new PageSystem(this)
            .setEmbeds(embeds)
            .editButton('previous', { emoji: this.config.e.left })
            .editButton('next', { emoji: this.config.e.right })
            .removeButton('stop');
    }
    /**
     * @param {Message | Interaction} ctx The context
     * @param {EmbedBuilder[]} embeds Array of the embeds
     * @returns {PageSystem} The page system
     */
    createPageEmbed(ctx, embeds) {
        return this.initBasePageSystem(embeds).start(ctx)
    };
    createEmbed(guild) {
        let embed = new EmbedBuilder().setColor(this.config.color)
        if (guild) embed.setFooter({
            text: guild.name,
            iconURL: guild.iconURL(this.imgOpts)
        });
        return embed;
    }
    say(emoji, user, text) {
        if (emoji) emoji = this.config.e[emoji] || this.emojis.cache.get(emoji) || emoji;
        if (user) user = user?.user?.username ?? user?.username ?? user;
        return `${emoji ? `${emoji} ` : ""}${user ? `**${user} **` : ""}${text}`;
    }
    async resetComponents(message) {
        const options = {};
        if (message.embeds.length) options.embeds = message.embeds;
        if (message.components?.length) options.components = message.components;
        return await message.edit(options);
    }
}