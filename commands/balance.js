const { EmbedBuilder } = require('discord.js');
const { getOrCreateUser, saveUser } = require('../utils/userStore');

module.exports = {
    name: 'balance',
    description: 'Check your balance',
    async execute(message) {
        const userId = message.author.id;
        const username = message.author.username;

        try {
            const user = await getOrCreateUser({ userId, username });
            await saveUser(user);

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`${username}'s Balance`)
                .setDescription(`💰 ${user.balance}`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching balance:', error);
            message.channel.send('Gagal ambil saldo kamu. Coba lagi nanti ya.');
        }
    },
};
