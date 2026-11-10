const { spawnSync } = require('child_process');
const path = require('path');

const project = path.resolve(__dirname, '..');
const cards = process.argv.includes('--cards');
const configuration = cards ? 'tsconfig.client-cards-test.json' : 'tsconfig.client-test.json';
const compile = spawnSync(process.execPath, [
  require.resolve('typescript/bin/tsc'), '-p', configuration
], { cwd: project, stdio: 'inherit' });
if (compile.status !== 0) {
  process.exit(compile.status || 1);
}

const tests = spawnSync(process.execPath, [
  require.resolve('jasmine/bin/jasmine'),
  ...(cards ? [
    '.client-card-regression/client/card-regression.spec.js',
    '.client-card-regression/client/snapshot-card-regression.spec.js'
  ] : ['.client-test/client/simulator.spec.js', '.client-test/client/card-metadata.spec.js', '.client-test/utils/base64.spec.js', '.client-test/utils/utils.spec.js', '.client-test/game/serializer/compact-state.spec.js'])
], { cwd: project, stdio: 'inherit' });
process.exit(tests.status === null ? 1 : tests.status);
