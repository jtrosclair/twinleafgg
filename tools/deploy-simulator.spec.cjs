const test = require('node:test');
const assert = require('node:assert/strict');
const { deploy } = require('./deploy-simulator.cjs');

test('release prepares the engine before Cloudflare and publishes it afterward', () => {
  const steps = [];
  deploy({ makeStage: () => '/tmp/test-stage', execute: (cmd, args) => steps.push([cmd, args]),
    removeStage: stage => steps.push(['remove', stage]), log: () => {} });
  assert.match(steps[0][1][0], /build-attestation/);
  assert.equal(steps[1][1][1], 'prepare');
  assert.match(steps[2][1][0], /retain-previous-release/);
  assert.match(steps[3][0], /wrangler/);
  assert.equal(steps[4][1][1], 'publish');
  assert.deepEqual(steps[5], ['remove', '/tmp/test-stage']);
});

test('preparation failure prevents publishing and retains the stage', () => {
  const steps = [];
  assert.throws(() => deploy({ makeStage: () => '/tmp/test-stage', execute: (cmd, args) => {
    steps.push([cmd, args]); if (args[1] === 'prepare') throw new Error('prepare failed');
  }, removeStage: () => assert.fail('stage must be retained'), log: () => {} }), /release did not finish/);
  assert.equal(steps.length, 2);
});

test('failed sync after Cloudflare reports an exact recovery command', () => {
  assert.throws(() => deploy({ makeStage: () => '/tmp/test-stage', execute: (_cmd, args) => {
    if (args[1] === 'publish') throw new Error('publish failed');
  }, removeStage: () => assert.fail('stage must be retained'), log: () => {} }), /publish --stage \/tmp\/test-stage/);
});
