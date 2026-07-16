const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser, saveUser } = require('../utils/userStore');

const classes = {
  fighter: { name: 'Fighter', description: 'Strong in close combat' },
  mage: { name: 'Mage', description: 'Powerful with spells' },
  ranger: { name: 'Ranger', description: 'Fast and precise' }
};

module.exports = {
  name: 'class',
  description: 'Choose your class.',
  async execute(message, args) {
    const choice = (args[0] || '').toLowerCase();
    if (!choice) {
      const embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle('🧙 Pick a Class')
        .setDescription('Choose one of these classes:');

      Object.entries(classes).forEach(([key, value]) => {
        embed.addFields({ name: value.name, value: value.description, inline: false });
      });

      return message.channel.send({ embeds: [embed] });
    }

    const selected = classes[choice];
    if (!selected) return message.reply('Kelas tidak valid. Pilih fighter, mage, atau ranger.');

    const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
    user.class = selected.name;
    await saveUser(user);

    return message.reply(`Kamu sekarang adalah **${selected.name}**!`);
  }
};
