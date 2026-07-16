const { EmbedBuilder, Colors } = require('discord.js');
const { getOrCreateUser, saveUser } = require('../utils/userStore');

module.exports = {
    name: 'hunt',
    description: 'Hunt for animals using coins!',
    async execute(message, args) {
        const user = await getOrCreateUser({ userId: message.author.id, username: message.author.username });
        const amount = parseInt(args[0], 10) || 100;

        if (amount < 100) {
            return message.reply('Kamu minimal harus mengeluarkan 100 coins untuk hunt.');
        }

        if ((user.balance || 0) < amount) {
            return message.reply('Saldo kamu kurang untuk hunt.');
        }

        user.balance -= amount;
        const animals = ['Wolf', 'Lion', 'Tiger', 'Bear', 'Eagle', 'Shark'];
        const numberOfAnimals = Math.floor(Math.random() * 2) + 1;
        const caughtAnimals = Array.from({ length: numberOfAnimals }, () => animals[Math.floor(Math.random() * animals.length)]);

        user.zoo = user.zoo || [];
        user.zoo.push(...caughtAnimals);
        user.xp = (user.xp || 0) + 20;
        await saveUser(user);

        const embed = new EmbedBuilder()
            .setTitle(`${message.author.username} went hunting!`)
            .setDescription(`Kamu menghabiskan ${amount} coins dan menangkap: ${caughtAnimals.join(', ')}`)
            .setColor(Colors.Green);

        message.channel.send({ embeds: [embed] });
    }
};
