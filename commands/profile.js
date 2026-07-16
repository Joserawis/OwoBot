const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser, saveUser } = require('../utils/userStore');

module.exports = {
    name: 'profile',
    description: 'Show your profile',
    async execute(message) {
        try {
            const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
            const spouse = user.marriedTo ? `<@${user.marriedTo}>` : 'None';
            const baseDamage = user.class === 'Mage' ? 25 : user.class === 'Tanker' ? 15 : 20;
            const equipment = (user.inventory?.common || []).slice(0, 3).map(item => item.name).join(', ') || 'Belum ada equipment';
            const xpNeeded = 100 + (user.level - 1) * 25;

            const embed = new EmbedBuilder()
                .setTitle(`${message.author.username}'s Profile`)
                .setDescription(`Class: **${user.class || 'No class'}**\nDamage: **${baseDamage + Math.min((user.inventory?.common || []).length, 3) * 3}**`)
                .addFields(
                    { name: 'Balance', value: `💰 ${user.balance || 0}`, inline: true },
                    { name: 'Level', value: `${user.level || 1}`, inline: true },
                    { name: 'XP', value: `${user.xp || 0}/${xpNeeded}`, inline: true },
                    { name: 'Married To', value: spouse, inline: true },
                    { name: 'Equipment', value: equipment, inline: false }
                )
                .setThumbnail(message.author.displayAvatarURL())
                .setColor(Colors.Green);

            await saveUser(user);
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            message.channel.send('An error occurred while fetching your profile.');
        }
    }
};
