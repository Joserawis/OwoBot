const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser, saveUser } = require('../utils/userStore');

const quests = [
  'Bantu 3 pemain di server',
  'Kalahkan 1 monster di hunt',
  'Mainkan 1 game casino',
  'Coba command shop',
  'Buka level 2'
];

module.exports = {
  name: 'quest',
  description: 'See your daily quest.',
  async execute(message) {
    const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (user.lastQuestAt && now - user.lastQuestAt < oneDay) {
      return message.reply('Quest harianmu sudah diambil hari ini. Coba lagi nanti.');
    }

    const quest = quests[Math.floor(Math.random() * quests.length)];
    const reward = 150 + (user.level || 1) * 20;

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle('🗺️ Daily Quest')
      .setDescription(`Quest hari ini: **${quest}**\nReward: 💰 ${reward}`);

    user.balance += reward;
    user.lastQuestAt = now;
    await saveUser(user);

    message.channel.send({ embeds: [embed] });
  }
};
