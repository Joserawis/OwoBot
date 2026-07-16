const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser, saveUser } = require('../utils/userStore');

const items = [
  { id: 'sword', name: 'Sword', price: 250, description: 'Boost your strength by +10' },
  { id: 'shield', name: 'Shield', price: 250, description: 'Boost your defense by +10' },
  { id: 'potion', name: 'Potion', price: 150, description: 'Recover 25 HP in battle' }
];

module.exports = {
  name: 'shop',
  description: 'Browse the shop and buy gear.',
  async execute(message, args) {
    if (!args[0]) {
      const embed = new EmbedBuilder()
        .setColor(Colors.Gold)
        .setTitle('🛒 Shop')
        .setDescription('Use `somuy shop <item|number> <qty>` to buy.');

      items.forEach((item, index) => {
        embed.addFields({ name: `${index + 1}. ${item.name}`, value: `${item.description}\nPrice: 💰 ${item.price}`, inline: false });
      });

      return message.channel.send({ embeds: [embed] });
    }

    const firstArg = args[0].toLowerCase();
    const qty = Math.min(5, Math.max(1, parseInt(args[1], 10) || 1));

    let item = items.find(i => i.id === firstArg);
    if (!item) {
      const index = parseInt(firstArg, 10);
      if (!isNaN(index) && index >= 1 && index <= items.length) {
        item = items[index - 1];
      }
    }

    if (!item) return message.reply('Item tidak ditemukan.');

    const totalCost = item.price * qty;
    const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
    if (user.balance < totalCost) return message.reply('Saldo kamu kurang untuk beli item ini.');

    user.balance -= totalCost;
    user.inventory = user.inventory || { common: [], rare: [] };
    for (let i = 0; i < qty; i += 1) {
      user.inventory.common.push({ name: item.name });
    }
    await saveUser(user);

    return message.reply(`Kamu berhasil membeli **${qty}x ${item.name}** seharga 💰 ${totalCost}.`);
  }
};
