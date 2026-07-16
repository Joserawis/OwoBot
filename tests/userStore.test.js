const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { getOrCreateUser, saveUser } = require('../utils/userStore');

test('persists user balances without MongoDB', async () => {
  const tempPath = path.join(os.tmpdir(), `somuy-user-store-${Date.now()}.json`);
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

  const user = await getOrCreateUser({ userId: 'u-test', username: 'Tester', userStorePath: tempPath });
  assert.equal(user.balance, 0);

  user.balance = 125;
  await saveUser(user, tempPath);

  const reloaded = await getOrCreateUser({ userId: 'u-test', username: 'Tester', userStorePath: tempPath });
  assert.equal(reloaded.balance, 125);
});
