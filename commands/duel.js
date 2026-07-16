const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'duel',
    description: 'Duel with another user',
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('Sebut target duel dengan mention, misal: somuy duel @user');
        }

        const loadingEmbed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setTitle('⚔️ Duel sedang berlangsung...')
            .setDescription('Mengecek siapa yang lebih kuat...');

        const msg = await message.channel.send({ embeds: [loadingEmbed] });

        setTimeout(async () => {
            const player1 = Math.floor(Math.random() * 100) + 1;
            const player2 = Math.floor(Math.random() * 100) + 1;
            const win = player1 > player2;

            const resultEmbed = new EmbedBuilder()
                .setColor(win ? '#00FF00' : '#FF4D4D')
                .setTitle(win ? '🏆 Kamu Menang!' : '💥 Kamu Kalah!')
                .setDescription(`${message.author.username} ${win ? 'menang' : 'kalah'} melawan ${target.username}.\nSkor: ${player1} vs ${player2}`);

            await msg.edit({ embeds: [resultEmbed] });
        }, 1400);
    },
};
