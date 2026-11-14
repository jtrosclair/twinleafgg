const test = require('node:test');
const assert = require('node:assert/strict');
const { deploy } = require('./deploy-simulator.cjs');

test('release prepares the engine before Cloudflare and publishes it afterward', () => {
  const steps = [];
  deploy({ makeStage: () => '/tmp/test-stage', execute: (cmd, args) => steps.push([cmd, args]),
    removeStage: stage => steps.push(['remove', stage]), log: () => {} });
  assert.match(steps[0][1][0], /verify-release-source/);
  assert.match(steps[1][1][0], /build-attestation/);
  assert.match(steps[2][1][0], /test-board-prompts/);
  assert.equal(steps[3][1][1], 'prepare');
  assert.match(steps[4][1][0], /retain-previous-release/);
  assert.match(steps[5][1][0], /verify-release-source/);
  assert.match(steps[6][1][0], /build-attestation/);
  assert.match(steps[7][0], /wrangler/);
  assert.equal(steps[8][1][1], 'publish');
  assert.deepEqual(steps[9], ['remove', '/tmp/test-stage']);
});

test('preparation failure prevents publishing and retains the stage', () => {
  const steps = [];
  assert.throws(() => deploy({ makeStage: () => '/tmp/test-stage', execute: (cmd, args) => {
    steps.push([cmd, args]); if (args[1] === 'prepare') throw new Error('prepare failed');
  }, removeStage: () => assert.fail('stage must be retained'), log: () => {} }), /release did not finish/);
  assert.equal(steps.length, 4);
});

for (const check of ['verify-release-source', 'build-attestation', 'test-board-prompts']) {
  test(`${check} failure blocks all publication and engine preparation`, () => {
    const steps = [];
    assert.throws(() => deploy({
      makeStage: () => assert.fail('preflight must finish before staging'),
      execute: (cmd, args) => { steps.push([cmd, args]); if (args[0].includes(check)) throw new Error('regression'); },
      removeStage: () => assert.fail('there is no stage to remove'), log: () => {}
    }), /release did not start/);
    assert(!steps.some(([cmd, args]) => cmd.includes('wrangler') || args[1] === 'prepare'));
  });
}

test('changes discovered after preparation still block the upload', () => {
  const steps = []; let sourceChecks = 0;
  assert.throws(() => deploy({ makeStage: () => '/tmp/test-stage', execute: (cmd, args) => {
    steps.push([cmd, args]);
    if (args[0].includes('verify-release-source') && ++sourceChecks === 2) throw new Error('source changed');
  }, removeStage: () => assert.fail('stage must be retained'), log: () => {} }), /release did not finish/);
  assert(!steps.some(([cmd]) => cmd.includes('wrangler')));
});

test('failed sync after Cloudflare reports an exact recovery command', () => {
  assert.throws(() => deploy({ makeStage: () => '/tmp/test-stage', execute: (_cmd, args) => {
    if (args[1] === 'publish') throw new Error('publish failed');
  }, removeStage: () => assert.fail('stage must be retained'), log: () => {} }), /publish --stage \/tmp\/test-stage/);
});
