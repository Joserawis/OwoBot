const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser } = require('../utils/userStore');

module.exports = {
  name: 'inventory',
  description: 'Show your inventory with details.',
  async execute(message) {
    const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
    const inventory = user.inventory || { common: [], rare: [] };

    const embed = new EmbedBuilder()
      .setColor(Colors.Purple)
      .setTitle('🎒 Inventory')
      .setDescription(`Class: **${user.class || 'No class'}**`);

    const commonItems = inventory.common.length ? inventory.common.map(item => item.name).join(', ') : 'Kosong';
    const rareItems = inventory.rare.length ? inventory.rare.map(item => item.name).join(', ') : 'Kosong';
    embed.addFields(
      { name: 'Common', value: commonItems, inline: false },
      { name: 'Rare', value: rareItems, inline: false }
    );

    message.channel.send({ embeds: [embed] });
  }
};
