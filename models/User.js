// User.js
const mongoose = require('mongoose');
const { getOrCreateUser, saveUser, loadStore } = require('../utils/userStore');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    balance: { type: Number, default: 0 },
    bankBalance: { type: Number, default: 0 },
    stones: { type: [String], default: [] },
    inventory: {
        common: [{ name: String }],
        rare: [{ name: String }],
    },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    class: { type: String, default: null },
    marriedTo: { type: String, default: null },
    lootboxes: { type: Number, default: 0 },
    crates: { type: Number, default: 0 },
    zoo: { type: [String], default: [] },
    equippedWeapon: { type: String, default: null },
    weapons: { type: [String], default: [] },
    lastBattle: { type: Date, default: null }
});

const UserModel = mongoose.model('User', userSchema);

function attachLocalSave(user) {
    if (!user || user.save) return user;
    return Object.assign(user, {
        save: async function() {
            await saveUser(this);
            return this;
        }
    });
}

function useMongo() {
    return Boolean(process.env.MONGO_URI) && mongoose.connection.readyState === 1;
}

const originalFindOne = UserModel.findOne.bind(UserModel);
const originalCreate = UserModel.create.bind(UserModel);
const originalFind = UserModel.find.bind(UserModel);
const originalSave = UserModel.prototype.save;

UserModel.findOne = async function(query = {}) {
    if (!useMongo()) {
        const userId = query.userId || query._id;
        if (!userId) return null;
        return attachLocalSave(await getOrCreateUser({ userId, username: query.username || 'Unknown' }));
    }
    return originalFindOne(query);
};

UserModel.create = async function(doc) {
    if (!useMongo()) {
        const user = await getOrCreateUser({ userId: doc.userId, username: doc.username || 'Unknown' });
        Object.assign(user, doc);
        await saveUser(user);
        return attachLocalSave(user);
    }
    return originalCreate(doc);
};

UserModel.find = function() {
    if (!useMongo()) {
        return {
            sort() { return this; },
            limit() { return this; },
            async then(resolve) {
                const store = await loadStore();
                const users = Object.values(store).map(attachLocalSave);
                resolve(users);
            }
        };
    }
    return originalFind();
};

UserModel.prototype.save = async function() {
    if (!useMongo()) {
        await saveUser(this);
        return this;
    }
    return originalSave.call(this);
};

module.exports = UserModel;
