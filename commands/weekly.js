const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser, saveUser } = require('../utils/userStore');

module.exports = {
  name: 'weekly',
  description: 'Claim a weekly reward.',
  async execute(message) {
    const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (user.lastWeeklyAt && now - user.lastWeeklyAt < oneWeek) {
      return message.reply('Weekly reward sudah diambil. Coba lagi nanti.');
    }

    const reward = 2500 + (user.level || 1) * 100;
    user.balance += reward;
    user.lastWeeklyAt = now;
    await saveUser(user);

    const embed = new EmbedBuilder()
      .setColor(Colors.Gold)
      .setTitle('📆 Weekly Reward')
      .setDescription(`Kamu menerima 💰 ${reward} sebagai reward mingguan.`);

    message.channel.send({ embeds: [embed] });
  }
};
