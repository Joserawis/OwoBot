const User = require('../models/User');

module.exports = {
    name: 'addmoney',
    description: 'Give money to a user (owner only)',
    async execute(message, args) {
        const ownerId = process.env.OWNER_ID || message.guild?.ownerId;
        if (message.author.id !== ownerId) {
            return message.reply('Kamu bukan owner, nggak bisa pakai ini.');
        }

        const targetUser = message.mentions.users.first();
        const amount = parseInt(args[1], 10);

        if (!targetUser || isNaN(amount) || amount <= 0) {
            return message.reply('Format: somuy addmoney @user jumlah');
        }

        let user = await User.findOne({ userId: targetUser.id });
        if (!user) {
            user = new User({ userId: targetUser.id, username: targetUser.username, balance: 0 });
        }

        user.balance += amount;
        await user.save();

        message.reply(`Berhasil tambah 💰 ${amount} ke ${targetUser.username}.`);
    },
};
