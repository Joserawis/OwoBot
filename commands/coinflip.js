const { EmbedBuilder } = require('discord.js');
const { getOrCreateUser, saveUser } = require('../utils/userStore');
const GIF_LINKS = {
    flipping: 'https://media.tenor.com/UTgK0rCiKLMAAAAi/ultimate-coin-flip-lucky-louie-flip.gif',
    head: 'https://i.imgur.com/hOidl0u.png',
    tails: 'https://i.imgur.com/Z2lHqjq.png'
};

module.exports = {
    name: 'coinflip',
    description: 'Bet on a coin flip to win or lose coins',
    async execute(message, args) {
        const userId = message.author.id;
        const rawBet = args[0]?.toLowerCase();
        const choice = args[1]?.toLowerCase();

        let betAmount = null;
        let isAll = false;

        if (rawBet === 'all') {
            isAll = true;
        } else {
            betAmount = parseInt(rawBet, 10);
        }

        if ((isAll ? false : (isNaN(betAmount) || betAmount <= 0)) || !['head', 'tails'].includes(choice)) {
            return message.channel.send('Invalid arguments. Use `somuy coinflip <bet-amount|all> <head/tails>`');
        }

        const user = await getOrCreateUser({ userId, username: message.author.username });
        const availableBalance = user.balance || 0;
        const maxBet = Math.min(250000, availableBalance);
        const finalBet = isAll ? maxBet : Math.min(betAmount, maxBet);

        if (finalBet <= 0 || availableBalance < finalBet) {
            return message.channel.send('Insufficient balance for this bet.');
        }

        const flippingEmbed = new EmbedBuilder()
            .setColor('#FFFF00')
            .setDescription('Coin is flipping...');

        const flippingMessage = await message.channel.send({ embeds: [flippingEmbed] });

        setTimeout(async () => {
            const result = Math.random() < 0.5 ? 'head' : 'tails';
            const win = result === choice;
            const reward = win ? finalBet * 2 : 0;
            user.balance += (win ? reward : -finalBet);
            await saveUser(user);

            const resultEmbed = new EmbedBuilder()
                .setColor(win ? '#00FF00' : '#FF0000')
                .setTitle(`You ${win ? 'Won' : 'Lost'} The Game!`)
                .setDescription(`You were ${win ? 'given' : 'fined'}:\n> 💰 ${win ? reward : -finalBet}`)
                .setThumbnail(win ? GIF_LINKS.head : GIF_LINKS.tails)
                .addFields({ name: 'Balance', value: `💳 ${user.balance}`, inline: true })
                .setTimestamp();

            await flippingMessage.edit({ embeds: [resultEmbed] });
        }, 1500);
    },
};
