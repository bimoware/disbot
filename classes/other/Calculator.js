const {
    CommandInteraction,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    Message,
    ButtonStyle,
    ComponentType
} = require("discord.js");

module.exports = class Calculator {
    /**
     * @param {CommandInteraction} int 
     * @param {string} calcul
     */
    constructor(int, calcul) {
        this.int = int;
        this.id = int.user.id;
        this.client = int.client;
        this.calcul = typeof (calcul) == "string" ? calcul : "";
        this.ended = false;
        this.reply = null;
        this.index = this.calcul.length;
        this.infinity = "∞";
    }
    /**
     * @returns {EmbedBuilder}
     */
    getEmbed() {
        return this.client.createEmbed(this.int.guild)
            .addFields([
                {
                    name: "Input",
                    value: `\`\`\`js\n${this.calcul ? (`${this.calcul}\n${" ".repeat(this.index)}^`) : "..."}\n\`\`\``,
                },
                {
                    name: "Output",
                    value: `\`\`\`js\n${this.result(this.calcul) || "❌"}\n\`\`\``
                }
            ])
    }
    /**
     * @param {string} calcul 
     * @returns {string}
     */
    result(calcul) {
        try {
            const pi = Math.PI;
            return eval(calcul
                .replace(this.infinity, 'Infinity'))
                ?.toString()
                .replace('Infinity', this.infinity)
        } catch (e) {
            return;
        }
    }
    update(disabled) {
        if (disabled) this.ended = true;
        return this.int.editReply({
            embeds: [this.getEmbed()],
            components: this.getRows(disabled)
        })
    }
    async start() {
        let rows = this.getRows()
        let opts = {
            embeds: [this.getEmbed()],
            components: rows
        }
        /**
         * @type {Message}
         */
        this.reply = await this.int.reply({ ...opts, fetchReply: true })
        this.collector = this.reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (i) => i.user.id == this.id || this.client.devs.includes(i.user.id),
            time: 1000 * 60 * 5
        });

        this.collector.on('collect', async int1 => {
            try {
                int1.deferUpdate();
                let id = decodeURIComponent(int1.customId)
                if (id == 'clear') {
                    this.calcul = "";
                    this.index = 0;
                } else if (id == 'del') {
                    if (this.index !== 0) {
                        this.calcul = this.calcul.slice(0, this.index - 1) + this.calcul.slice(this.index);
                        --this.index;
                    }
                } else if (id === "equal") {
                    this.collector.stop()
                    return this.update(true);
                } else {
                    if (this.calcul.length > 1000) {
                        return int1.no("Calcul is way too long.", { ephemeral: true })
                    } else if (id == 'left') {
                        if (this.index !== 0) this.index--;
                    } else if (id == 'right') {
                        if (this.index !== this.calcul.length) this.index++;
                    } else if (id === "pi") {
                        this.calcul = this.insert(this.calcul, 'pi', this.index)
                        this.index += 2;
                    } else {
                        this.calcul = this.insert(this.calcul, id, this.index);
                        this.index += id.length;
                    }
                }
                await this.update()
            } catch (err) {
                this.client.emit('error', err)
            }
        })
        this.collector.on('end', () => this.update(true))

    }
    insert(string, substring, index) {
        return string.slice(0, index) + substring + string.slice(index);
    }
    /**
     * @param {boolean} disabled 
     * @returns {ActionRowBuilder[]}
     */
    getRows(disabled = false) {
        let total = [
            [
                { e: this.client.config.e.trash, id: 'clear', s: 'Danger' },
                { l: "(", id: '(', s: "Primary" },
                { l: ")", id: ')', s: "Primary" },
                { e: this.client.config.e.left, id: 'left', s: "Primary" },
                { e: this.client.config.e.right, id: 'right', s: "Primary" }
            ],
            [
                { l: "1", id: "1" },
                { l: "2", id: "2" },
                { l: "3", id: "3" },
                { l: "+", id: "+", s: "Primary" },
                { l: "DEL", id: "del", s: "Danger" }
            ],
            [
                { l: "4", id: "4" },
                { l: "5", id: "5" },
                { l: "6", id: "6" },
                { l: "-", id: "-", s: "Primary" },
                { l: "^", id: "**", s: "Primary" }
            ],
            [
                { l: "7", id: "7" },
                { l: "8", id: "8" },
                { l: "9", id: "9" },
                { l: "x", id: '*', s: "Primary" },
                { l: "%", id: '%', s: "Primary" }
            ],
            [
                { l: ".", id: "." },
                { l: "0", id: "0" },
                { l: "π", id: "pi" },
                { l: "/", id: "/", s: "Primary" },
                { e: this.client.config.e.yes, id: "equal", s: "Success" }
            ]
        ]
        /*
        
             */
        let rows = total.map(row => new ActionRowBuilder()
            .setComponents(row.map(b => {
                let btn = new ButtonBuilder()
                    .setCustomId(encodeURIComponent(b.id))
                    .setStyle(ButtonStyle[b.s || "Secondary"])
                    .setDisabled(disabled)
                if (b.l) btn.setLabel(b.l)
                if (b.e) btn.setEmoji(b.e);
                return btn;
            })))
        return rows;
    }
};
