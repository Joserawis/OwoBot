const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser, saveUser } = require('../utils/userStore');

module.exports = {
  name: 'arena',
  description: 'Fight in the arena for coins and XP.',
  async execute(message, args) {
    const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
    const bet = parseInt(args[0], 10) || 100;
    const classBonus = user.class === 'Mage' ? 1.25 : user.class === 'Tanker' ? 1.1 : 1;
    const chance = Math.random() * 100;

    if (user.balance < bet) return message.reply('Saldo kamu kurang untuk masuk arena.');
    user.balance -= bet;

    if (chance < 45 * classBonus) {
      const reward = Math.floor(bet * 1.8);
      user.balance += reward;
      user.xp = (user.xp || 0) + 30;
      await saveUser(user);
      const embed = new EmbedBuilder().setColor(Colors.Green).setTitle('⚔️ Arena Win').setDescription(`Kamu menang dan dapat 💰 ${reward}.`);
      return message.channel.send({ embeds: [embed] });
    }

    user.xp = (user.xp || 0) + 10;
    await saveUser(user);
    const embed = new EmbedBuilder().setColor(Colors.Red).setTitle('⚔️ Arena Lose').setDescription(`Kamu kalah dan kehilangan 💰 ${bet}.`);
    message.channel.send({ embeds: [embed] });
  }
};
