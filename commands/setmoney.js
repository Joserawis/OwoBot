const User = require('../models/User');

module.exports = {
    name: 'setmoney',
    description: 'Set money for a user (owner only)',
    async execute(message, args) {
        if (message.author.id !== process.env.OWNER_ID) {
            return message.reply('Kamu bukan owner, nggak bisa pakai ini.');
        }

        const targetUser = message.mentions.users.first();
        const amount = parseInt(args[1], 10);

        if (!targetUser || isNaN(amount) || amount < 0) {
            return message.reply('Format: somuy setmoney @user jumlah');
        }

        let user = await User.findOne({ userId: targetUser.id });
        if (!user) {
            user = new User({ userId: targetUser.id, username: targetUser.username, balance: 0 });
        }

        user.balance = amount;
        await user.save();

        message.reply(`Berhasil set saldo ${targetUser.username} jadi 💰 ${amount}.`);
    },
};
