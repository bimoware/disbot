const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("@discordjs/builders");
const {
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    SelectMenuInteraction,
    ButtonBuilder,
    GuildMember,
    MessageType,
    CategoryChannel,
    AttachmentBuilder,
    GuildChannel,
    EmbedBuilder
} = require("discord.js");
const DisBot = require('../../classes/DisBot');;
/**
 * @param {DisBot} client
 * @param {SelectMenuInteraction} int
 */
module.exports.run = async (client, int) => {
    if (int.customId !== "ticket") return;
    let member = int.member;
    let value = int.values?.[0];
    if (!value) return;
    let data = this.values.find(v => v.customId === value);
    if (!data) return console.error({ value, data, int })
    await int.deferReply({ ephemeral: true })
    let ticket = await this.getTicketOf(member);
    if (ticket) return int.editReply(client.say('no', int.user, `Vous avez déjà un ticket en cours ( ${ticket} ). Finissez-en avec avant de pouvoir créer un nouveau.`))
    if (data.disabledMessage) {
        console.logg('🎫', 'Ticket créé mais désactivé & annulé', member.user.tag, data.option.label)
        return await int.editReply(client.say("no", int.user, data.disabledMessage));
    }
    const channel = await this.createTicket(member, data.customId);
    await int.editReply(client.say('yes', int.user, `Votre ticket a étè créé : ${channel}`));
    await client.resetComponents(int.message);
    await this.sendInTicket(client, channel, member, data.customId)
}
/**
 * @param {DisBot} client
 * @param {GuildChannel} channel
 * @param {GuildMember} member
 * @param {string} customId
 */
module.exports.sendInTicket = async (client, channel, member, customId, opener) => {
    const data = this.values.find(v => v.customId === customId);
    const byStaff = data.customId === "by-staff"
    const embed = client.createEmbed(member.guild)
        .setTitle(data.option.label)
        .setDescription(`Ticket ouvert par ${opener || member} <t:${Math.floor(Date.now() / 1000)}:R>`);

    const row = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder()
                .setCustomId('delete-ticket')
                .setEmoji(client.config.e.no)
                .setLabel("Fermer le ticket")
                .setStyle(ButtonStyle.Danger)
        );
    const ques = data.questions;
    const first = await channel.send({
        embeds: [embed],
        components: [row]
    })
    first.pin()
        .then(() => {
            return channel.messages.cache
                .find(m => m.type === MessageType.ChannelPinnedMessage)
                ?.delete()
        })
        .catch(() => 0);
    await channel.send(client.say("yes", membern, `${byStaff ? "nous venons, pour vous," : "vous venez"} de créer le ticket ${channel} !\n`
        + `Ce salon serviras a pouvoir communiquer avec le staff dans un salon privé.\n`
        + (!ques.length ? "" : "En attendant la réponse d'un staff, vous pouvez "
            + (ques.length == 1 ? `répondre à la question: **${ques[0]}**`
                : (`répondre a ces questions: \n\n**${ques.join('\n')}**`)))))
};
/**
 * @param {GuildMember} member 
 */
module.exports.getTicketOf = async function (member) {
    /** @type {CategoryChannel} */
    let category = member.guild.channels.cache.get(member.client.config.channels.ticketParent)
    let channel = category.children.cache.find(c => c.topic === member.id);
    return channel;
};
/**
 * @param {GuildMember} member 
 * @param {string} customId
 */
module.exports.createTicket = async (member, customId) => {
    let data = this.values.find(v => v.customId === customId);
    /** @type {CategoryChannel} */
    let category = await member.guild.channels.fetch(member.client.config.channels.ticketParent)
    if (!category) return;
    console.logg('🎫', 'Ticket créé', member.user.tag);
    let existingTickets = await member.client.db.get('tickets');
    await member.client.db.set('tickets', existingTickets + 1);
    return await category.children.create(
        {
            name: `${data.channelEmoji}〢ticket-${existingTickets + 1}`,
            topic: member.id,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: member.client.config.roles.staff,
                    allow: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: member,
                    allow: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: member.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel]
                }
            ]
        })
}
/**
 * @param {GuildChannel} channel 
 */
module.exports.start = async (channel) => {
    this.values.filter(v => v.option).map(v => {
        let emoji = channel.client.emojis.cache.get(v.option.emoji);
        return {
            emoji: {
                name: emoji.name,
                id: emoji.id,
                animated: emoji.animated
            },
            description: v.option.description,
            label: v.option.label,
            value: v.option.value
        }
    })
    const ticket = new StringSelectMenuBuilder()
        .setCustomId('ticket')
        .setPlaceholder('Selectionnez la raison pour la création de votre ticket.')
        .setMaxValues(1)
        .addOptions(
            ...list
        )

    return await channel.send({
        components: [new ActionRowBuilder().setComponents(ticket)],
        files: [new AttachmentBuilder(channel.client.sey.tickets, "ticket.png")]
    });
};
module.exports.createFor = async member => {
    let ticket = await this.createTicket(member, "by-staff");
    await this.sendInTicket(client, ticket, member, "by-staff");
};
module.exports.values = [
    {
        disabledMessage: null,
        customId: "partner",
        option: {
            label: "Partenariat",
            emoji: "971122201023623239",
            description: "Un echange de publicité avec mention."
        },
        channelEmoji: "🤝",
        questions: [
            "En quoi consiste votre serveur/project",
            "Quel est sa publicité (à envoyer dans <#962096042466222130>)",
        ]
    },
    {
        disabledMessage: null,
        customId: "question",
        option: {
            label: "Question",
            emoji: "948939239603716126",
            description: "T'est perdu ? T'as pas compris quelque chose ?"
        },
        channelEmoji: "❔",
        questions: [
            "Quelle est votre question"
        ]
    },
    {
        // disabledMessage: "Le propriétaire du serveur ne cherche pas du tout de staff pour l'instant. Quand ça seras le cas, une annonce seras faite dans le salon <#937652699288195133>.Merci de votre compréhension.",
        customId: "mod",
        option: {
            label: "Rejoindre le staff",
            emoji: "967852136106967082",
            description: "Devenir un membre du staff."
        },
        channelEmoji: "🔨",
        questions: [
            "Quel âge avez-vous (honêtement)",
            "Pourquoi voulez-vous devenir staff",
            "Pourquoi ce serveur spécifiquement et pas un autre"
        ]
    },
    {
        customId: "report",
        option: {
            label: "Rapport d'un membre",
            emoji: "937647944893599786",
            description: "Un membre vous gêne ? Dites-nous tout!"
        },
        channelEmoji: "😡",
        questions: [
            "Quel est l'__ID__ du membre qui vous cause probléme ?",
            "Qu'est-ce que le membre à fait?",
            "Envoyez des preuves (captures d'ecrans)"
        ]
    },
    {
        disabledMessage: "Il y a déjà le salon <#1022653413974089778> pour pouvoir proposer des suggestions.",
        customId: 'suggestion',
        option: {
            label: "Suggestion",
            emoji: '971209617604501556',
            description: "Proposer une suggestion pour améliorer le serveur."
        },
        channelEmoji: "📨",
        questions: [
            "Quelle est votre suggestion"
        ]
    },
    {
        customId: "ressource",
        option: {
            label: "Demande de ressource",
            emoji: "937652699288195133",
            description: "Ajouter une ressource dans la catégorie Ressources"
        },
        channelEmoji: "🎒",
        questions: [
            "Quel est le type de ressource ? Un <#1038246471138549861> ? Un <#1057410269216772176> ? Etc.."
        ]
    },
    {
        customId: "by-staff",
        option: {
            label: "Automatique par le staff"
        },
        channelEmoji: "🫣",
        questions: [],
    },
    {
        disabledMessage: null,
        customId: 'other',
        option: {
            label: 'Autre raison',
            emoji: '948924577331970079',
            description: "Si votre raison n'est pas listée ici."
        },
        channelEmoji: "😶",
        questions: []
    }
].map(d => {
    if (d.option) d.option.value = d.customId;
    return d;
});
