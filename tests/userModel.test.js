const test = require('node:test');
const assert = require('node:assert/strict');
const User = require('../models/User');

test('creates and loads a user account without MongoDB', async () => {
  const userId = 'test-user-1';
  await User.create({ userId, username: 'Tester', balance: 42 });

  const savedUser = await User.findOne({ userId });
  assert.ok(savedUser);
  assert.equal(savedUser.username, 'Tester');
  assert.equal(savedUser.balance, 42);
});
