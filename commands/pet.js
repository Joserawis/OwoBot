const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser, saveUser } = require('../utils/userStore');

const pets = [
  { name: 'Mochi', mood: 'Happy' },
  { name: 'Kuro', mood: 'Curious' },
  { name: 'Bubu', mood: 'Sleepy' }
];

module.exports = {
  name: 'pet',
  description: 'Meet your companion pet.',
  async execute(message) {
    const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
    const selected = pets[Math.floor(Math.random() * pets.length)];
    const reward = 50 + (user.level || 1) * 10;

    user.balance += reward;
    user.pet = selected.name;
    await saveUser(user);

    const embed = new EmbedBuilder()
      .setColor(Colors.Orange)
      .setTitle('🐾 Pet Companion')
      .setDescription(`Kamu dipertemukan dengan **${selected.name}** (${selected.mood})!\nReward: 💰 ${reward}`);

    message.channel.send({ embeds: [embed] });
  }
};
