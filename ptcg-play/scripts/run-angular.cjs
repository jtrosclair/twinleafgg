// Keep the Angular12/Webpack4 OpenSSL compatibility option local to its process.
// This works from npm scripts on Windows, macOS, Linux and Cloudflare builds.
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { captureBuildInputs, recordCompiledBuild } = require('./build-attestation.cjs');
const args = process.argv.slice(2);
const isBuild = args[0] === 'build';
const inputHash = isBuild ? captureBuildInputs() : undefined;
const options = process.env.NODE_OPTIONS || '';
const env = { ...process.env, NODE_OPTIONS: options.includes('--openssl-legacy-provider')
  ? options : [options, '--openssl-legacy-provider'].filter(Boolean).join(' ') };
const result = spawnSync(process.execPath, [require.resolve('@angular/cli/bin/ng'), ...args], {
  cwd: path.resolve(__dirname, '..'), stdio: 'inherit', env
});
if (result.error) { throw result.error; }
if (isBuild && result.status === 0) {
  const inline = args.find(arg => arg.startsWith('--configuration='));
  const position = args.indexOf('--configuration');
  recordCompiledBuild({ inputHash, configuration: inline ? inline.slice('--configuration='.length)
    : position >= 0 ? args[position + 1] : 'default' });
}
process.exit(result.status === null ? 1 : result.status);
