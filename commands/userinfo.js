const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser } = require('../utils/userStore');

module.exports = {
  name: 'userinfo',
  description: 'Show info for a user.',
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = await getOrCreateUser({ userId: target.id, username: target.username });

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle(`${target.username}'s Profile`)
      .addFields(
        { name: 'Balance', value: `💰 ${user.balance}`, inline: true },
        { name: 'Class', value: user.class || 'No class', inline: true },
        { name: 'Level', value: `${user.level || 1}`, inline: true }
      );

    message.channel.send({ embeds: [embed] });
  }
};
