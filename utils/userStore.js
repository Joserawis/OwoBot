const fs = require('node:fs');
const path = require('node:path');

const defaultStorePath = path.join(__dirname, '..', 'database', 'users.json');

async function getOrCreateUser({ userId, username, userStorePath = defaultStorePath }) {
  const store = await loadStore(userStorePath);
  const existing = store[userId];

  if (existing) {
    return { ...existing, userId, username };
  }

  const user = {
    userId,
    username,
    balance: 0,
    bankBalance: 0,
    level: 1,
    xp: 0,
    class: null,
    marriedTo: null,
    inventory: { common: [], rare: [] },
    zoo: [],
    lastDaily: null,
    lastWork: null,
    lastBeg: null,
  };

  store[userId] = user;
  await saveStore(store, userStorePath);
  return user;
}

async function saveUser(user, userStorePath = defaultStorePath) {
  const store = await loadStore(userStorePath);
  store[user.userId] = user;
  await saveStore(store, userStorePath);
  return user;
}

async function loadStore(userStorePath) {
  try {
    const data = await fs.promises.readFile(userStorePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

async function saveStore(store, userStorePath) {
  await fs.promises.mkdir(path.dirname(userStorePath), { recursive: true });
  await fs.promises.writeFile(userStorePath, JSON.stringify(store, null, 2));
}

module.exports = { getOrCreateUser, saveUser, loadStore, saveStore };
