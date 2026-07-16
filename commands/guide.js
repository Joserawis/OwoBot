const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  name: 'guide',
  description: 'Explain the bot features.',
  execute(message) {
    const embed = new EmbedBuilder()
      .setColor(Colors.Purple)
      .setTitle('📖 Bot Guide')
      .setDescription('Berikut penjelasan singkat fitur bot:')
      .addFields(
        { name: 'Start', value: 'Pakai `somuy start` untuk pilih kelas Fighter, Mage, atau Tanker.', inline: false },
        { name: 'Economy', value: 'Kumpulkan saldo lewat `daily`, `work`, `beg`, `weekly`, dan `arena`.', inline: false },
        { name: 'Combat', value: 'Gunakan `hunt`, `arena`, `equipment`, dan `shop` untuk upgrade.', inline: false },
        { name: 'Games', value: 'Mainkan `coinflip` / `cf`, `slots` / `s`, dan `slotbattle`.', inline: false }
      );

    message.channel.send({ embeds: [embed] });
  }
};
