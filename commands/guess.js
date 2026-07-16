const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guess',
    description: 'Guess a number between 1 and 10',
    async execute(message, args) {
        const guess = parseInt(args[0], 10);
        const target = Math.floor(Math.random() * 10) + 1;

        if (isNaN(guess) || guess < 1 || guess > 10) {
            return message.reply('Pakai format: somuy guess <1-10>');
        }

        const loadingEmbed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🎲 Guessing...')
            .setDescription('Mengecek angka rahasia...');

        const msg = await message.channel.send({ embeds: [loadingEmbed] });

        setTimeout(async () => {
            const win = guess === target;
            const resultEmbed = new EmbedBuilder()
                .setColor(win ? '#00FF00' : '#FF4D4D')
                .setTitle(win ? '🎉 Tebakan Benar!' : '😢 Salah!')
                .setDescription(win ? `Kamu benar! Angka rahasianya adalah **${target}**.` : `Angka rahasianya adalah **${target}**. Coba lagi ya!`);

            await msg.edit({ embeds: [resultEmbed] });
        }, 1200);
    },
};
