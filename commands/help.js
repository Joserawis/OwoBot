// commands/help.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays a list of available commands',
    execute(message) {
        const prefix = message.guild
            ? (message.client.prefixes?.[message.guild.id] || message.client.prefix)
            : message.client.prefix;
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Somuy Bot Commands')
            .setDescription(`Halo! Prefix bot ini sekarang \`${prefix}\`.\nCoba command berikut agar bot terasa lebih hidup:`)
            .addFields(
                { name: '💰 Economy', value: '`balance` `beg` `work` `daily` `bank` `deposit` `withdraw` `give` `hunt`', inline: false },
                { name: '🎮 Games', value: '`guess` `duel` `slotbattle` `coinflip` `cf` `slots` `s`', inline: false },
                { name: '🎲 Fun', value: '`choose` `define` `roll` `translate` `ship`', inline: false },
                { name: '🧠 Progression', value: '`start` `class` `level` `quest` `shop` `leaderboard`', inline: false },
                { name: '🎒 Inventory', value: '`inventory` `inv`', inline: false },
                { name: '👤 Social', value: '`profile` `userinfo`', inline: false },
                { name: '⚙️ Owner', value: '`addmoney` `takemoney` `setmoney`', inline: false },
                { name: '🛠 Utility', value: '`ping` `help` `prefix`', inline: false },
            )
            .setTimestamp()
            .setFooter({ text: 'Somuy Bot', iconURL: message.client.user.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    },
};
