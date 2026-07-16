// commands/help.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays a list of available commands',
    execute(message) {
        const prefix = message.guild
            ? (message.client.prefixes?.[message.guild.id] || message.client.prefix)
            : message.client.prefix;
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Somuy Command List')
            .setDescription(`Halo! Prefix bot ini sekarang \`${prefix}\`.\nCoba command berikut:`)
            .addFields(
                { name: '💰 Economy', value: '`balance` `coinflip` `slots`', inline: false },
                { name: '� Games', value: '`guess` `duel` `slotbattle`', inline: false },
                { name: '�🎲 Fun', value: '`choose` `define` `roll` `translate`', inline: false },
                { name: '👤 Social', value: '`profile` `ship`', inline: false },
                { name: '⚙️ Owner', value: '`addmoney` `takemoney` `setmoney`', inline: false },
                { name: '🛠 Utility', value: '`ping` `help` `prefix`', inline: false },
            )
            .setTimestamp()
            .setFooter({ text: 'Somuy Bot', iconURL: message.client.user.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    },
};
