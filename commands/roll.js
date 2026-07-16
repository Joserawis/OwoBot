const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roll',
    description: 'Roll a dice.',
    execute(message) {
        const roll = Math.floor(Math.random() * 6) + 1;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎲 Dice Roll')
            .setDescription(`Kamu roll **${roll}**!`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
