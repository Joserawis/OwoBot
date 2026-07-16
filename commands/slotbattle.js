const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'slotbattle',
    description: 'Battle slot machine with animation',
    async execute(message, args) {
        const bet = parseInt(args[0], 10) || 50;
        const emojis = ['🍒', '🍋', '⭐', '🔔', '💎'];

        const loadingEmbed = new EmbedBuilder()
            .setColor('#9B5DE5')
            .setTitle('🎰 Slot Battle')
            .setDescription('Spin sedang berjalan...');

        const msg = await message.channel.send({ embeds: [loadingEmbed] });

        const frames = [
            ['🍒', '🍋', '⭐'],
            ['🔔', '🍒', '🍋'],
            ['💎', '🔔', '⭐'],
            ['🍒', '💎', '🔔']
        ];

        for (const frame of frames) {
            await new Promise(resolve => setTimeout(resolve, 700));
            const frameEmbed = new EmbedBuilder()
                .setColor('#9B5DE5')
                .setTitle('🎰 Slot Battle')
                .setDescription(`Hasil sementara:\n${frame.join(' | ')}`);
            await msg.edit({ embeds: [frameEmbed] });
        }

        const result = frames[frames.length - 1];
        const win = result[0] === result[1] && result[1] === result[2];

        const resultEmbed = new EmbedBuilder()
            .setColor(win ? '#00FF00' : '#FF4D4D')
            .setTitle(win ? '🎉 Jackpot!' : '😢 Coba lagi')
            .setDescription(win ? `Kamu menang **${bet * 2}** coins!` : `Kamu kalah **${bet}** coins.`);

        await msg.edit({ embeds: [resultEmbed] });
    },
};
