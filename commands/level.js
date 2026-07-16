// commands/level.js
const { EmbedBuilder, Colors } = require('discord.js');
const User = require('../models/User');

module.exports = {
    name: 'level',
    description: 'Show your chat level',
    async execute(message) {
        const userId = message.author.id;
        let user = await User.findOne({ userId });

        if (!user) {
            user = await User.create({ userId, username: message.author.username });
        }

        const xpNeeded = 100 + (user.level - 1) * 25;
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle(`${message.author.username}'s Level`)
            .setDescription(`Level **${user.level || 1}**\nXP **${user.xp || 0} / ${xpNeeded}**`)
            .addFields(
                { name: 'Class', value: user.class || 'No class yet', inline: true },
                { name: 'Balance', value: `💰 ${user.balance || 0}`, inline: true }
            );

        message.channel.send({ embeds: [embed] });
    }
};
