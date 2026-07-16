const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser } = require('../utils/userStore');

module.exports = {
  name: 'equipment',
  description: 'Show your equipped gear and stats.',
  async execute(message) {
    const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
    const items = (user.inventory && user.inventory.common) ? user.inventory.common : [];
    const equipment = items.slice(0, 3).map(item => item.name).join(', ') || 'Belum ada equipment';
    const baseDamage = user.class === 'Mage' ? 25 : user.class === 'Tanker' ? 15 : 20;
    const damage = baseDamage + Math.min(items.length, 3) * 3;

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle('⚔️ Equipment')
      .setDescription(`Class: **${user.class || 'No class'}**\nDamage: **${damage}**`)
      .addFields({ name: 'Equipment', value: equipment, inline: false });

    message.channel.send({ embeds: [embed] });
  }
};
