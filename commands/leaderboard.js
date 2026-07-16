const { EmbedBuilder, Colors } = require('discord.js');
const { loadStore } = require('../utils/userStore');

module.exports = {
  name: 'leaderboard',
  description: 'Show the richest users.',
  async execute(message) {
    const store = await loadStore();
    const users = Object.values(store).sort((a, b) => b.balance - a.balance).slice(0, 10);

    const embed = new EmbedBuilder()
      .setColor(Colors.Gold)
      .setTitle('🏆 Leaderboard')
      .setDescription('Top 10 richest players');

    users.forEach((user, index) => {
      embed.addFields({ name: `${index + 1}. ${user.username || 'Unknown'}`, value: `💰 ${user.balance}`, inline: false });
    });

    message.channel.send({ embeds: [embed] });
  }
};
