const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser, saveUser } = require('../utils/userStore');

const classes = {
  fighter: { name: 'Fighter', description: 'Tanky and strong' },
  mage: { name: 'Mage', description: 'Powerful spells' },
  tanker: { name: 'Tanker', description: 'Very durable' }
};

module.exports = {
  name: 'start',
  description: 'Start your adventure and choose a class.',
  async execute(message, args) {
    const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
    if (user.class) {
      return message.reply(`Kamu sudah memilih kelas **${user.class}**.`);
    }

    const choice = (args[0] || '').toLowerCase();
    if (!choice) {
      const embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle('🚀 Start Your Adventure')
        .setDescription('Pilih kelasmu: `fighter`, `mage`, `tanker`');
      Object.entries(classes).forEach(([key, value]) => {
        embed.addFields({ name: value.name, value: value.description, inline: false });
      });
      return message.channel.send({ embeds: [embed] });
    }

    const selected = classes[choice];
    if (!selected) return message.reply('Kelas tidak valid. Pilih fighter, mage, atau tanker.');

    user.class = selected.name;
    user.balance += 500;
    user.inventory = user.inventory || { common: [], rare: [] };
    user.inventory.common.push({ name: 'Starter Sword' });
    await saveUser(user);

    return message.reply(`Kamu memulai petualangan sebagai **${selected.name}** dan menerima bonus 💰 500 serta starter item.`);
  }
};
