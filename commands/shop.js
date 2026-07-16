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
        .setDescription('Use `somuy shop <item>` to buy an item.');

      items.forEach(item => {
        embed.addFields({ name: `${item.name}`, value: `${item.description}\nPrice: 💰 ${item.price}`, inline: false });
      });

      return message.channel.send({ embeds: [embed] });
    }

    const item = items.find(i => i.id === args[0].toLowerCase());
    if (!item) return message.reply('Item tidak ditemukan.');

    const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
    if (user.balance < item.price) return message.reply('Saldo kamu kurang untuk beli item ini.');

    user.balance -= item.price;
    user.inventory = user.inventory || { common: [], rare: [] };
    user.inventory.common.push({ name: item.name });
    await saveUser(user);

    return message.reply(`Kamu berhasil membeli **${item.name}** untuk 💰 ${item.price}.`);
  }
};
