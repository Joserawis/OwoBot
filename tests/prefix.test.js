const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('guild prefix is configured to somuy', () => {
  const prefixesPath = path.join(__dirname, '..', 'database', 'prefixes.json');
  const prefixes = JSON.parse(fs.readFileSync(prefixesPath, 'utf8'));

  assert.equal(prefixes['1242031356511391814'], 'somuy');
});
