const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const project = path.resolve(__dirname, '..');
const source = path.join(project, 'src');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}

// Isolate each spec's card registry, globals and timers. Several existing suites
// intentionally register their own cards; sharing a singleton hides real results.
if (process.argv[2] === '--spec') {
  const [, , , workspace, spec, resultFile] = process.argv;
  const Jasmine = require('jasmine');
  const runner = new Jasmine({ projectBaseDir: workspace });
  const report = { file: spec, passed: 0, failed: 0, pending: 0, failures: [] };
  runner.loadConfig({ spec_dir: 'src', spec_files: [spec], random: false });
  runner.env.clearReporters();
  runner.addReporter({
    specDone(result) {
      if (result.status === 'passed') report.passed++;
      else if (result.status === 'failed') report.failed++;
      else report.pending++;
      if (result.failedExpectations.length) {
        report.failures.push({ name: result.fullName, expectations: result.failedExpectations });
      }
    },
    jasmineDone(result) {
      report.status = result.overallStatus;
      report.failures.push(...(result.failedExpectations || []).map(item => ({ name: 'Suite setup', expectations: [item] })));
      fs.writeFileSync(resultFile, JSON.stringify(report, null, 2));
    }
  });
  runner.execute();
} else {
  main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
}

async function main() {
  const existingOnly = process.argv.includes('--existing');
  const filterArgument = process.argv.find(argument => argument.startsWith('--filter='));
  const filter = filterArgument ? new RegExp(filterArgument.slice('--filter='.length)) : undefined;
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'twinleaf-card-regressions-'));
  const workspace = path.join(temporary, 'ptcg-server');
  const compiled = path.join(workspace, 'src');
  fs.mkdirSync(compiled, { recursive: true });
  const newCardSpecs = ['client/card-regression.spec.ts', 'client/snapshot-card-regression.spec.ts'];
  const specs = walk(source).filter(file => file.endsWith('.spec.ts')).map(file => path.relative(source, file).split(path.sep).join('/'))
    .filter(file => /^(sets\/|game\/(store|serializer)\/|simple-bot\/|client\/|utils\/base64\.spec\.ts$)/.test(file))
    .filter(file => !existingOnly || !newCardSpecs.includes(file))
    .filter(file => !filter || filter.test(file));
  // Read source inventories before running TypeScript. No tracked output/dist
  // artifacts are overwritten and legacy .js siblings cannot shadow fresh code.
  const config = path.join(workspace, 'tsconfig.json');
  fs.writeFileSync(config, JSON.stringify({
    extends: path.join(project, 'tsconfig.json'),
    compilerOptions: { rootDir: source, outDir: compiled, declaration: false, sourceMap: false, noEmitOnError: true },
    include: [path.join(source, '**/*.ts')],
    exclude: existingOnly ? newCardSpecs.map(file => path.join(source, file)) : []
  }, null, 2));
  fs.symlinkSync(path.join(project, 'node_modules'), path.join(workspace, 'node_modules'), 'dir');
  fs.symlinkSync(compiled, path.join(workspace, 'output'), 'dir');
  fs.symlinkSync(path.resolve(project, '../ptcg-play'), path.join(temporary, 'ptcg-play'), 'dir');
  fs.cpSync(path.join(project, 'data'), path.join(workspace, 'data'), { recursive: true });
  console.log(`Card regression workspace: ${workspace}`);
  console.log(`Compiling current source for ${specs.length} isolated card/engine spec files…`);
  const compile = spawnSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', config], { cwd: project, stdio: 'inherit' });
  if (compile.status !== 0) { process.exitCode = compile.status || 1; return; }
  for (const file of walk(source).filter(file => /\.(ts|json)$/.test(file))) {
    const destination = path.join(compiled, path.relative(source, file));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file, destination);
  }
  const results = [];
  let index = 0;
  await Promise.all(Array.from({ length: 2 }, async () => {
    while (index < specs.length) {
      const ordinal = index++;
      const spec = specs[ordinal].replace(/\.ts$/, '.js');
      const resultFile = path.join(temporary, `result-${ordinal}.json`);
      const logFile = path.join(temporary, `spec-${ordinal}.log`);
      const output = fs.openSync(logFile, 'w');
      const status = await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [__filename, '--spec', workspace, spec, resultFile], { cwd: workspace, stdio: ['ignore', output, output] });
        child.on('error', reject);
        child.on('close', resolve);
      });
      fs.closeSync(output);
      const result = fs.existsSync(resultFile) ? JSON.parse(fs.readFileSync(resultFile, 'utf8'))
        : { file: spec, passed: 0, failed: 1, pending: 0, status: 'failed', failures: [{ name: 'Spec process failed', expectations: [{ message: fs.readFileSync(logFile, 'utf8') }] }] };
      result.exitCode = status;
      result.logFile = logFile;
      results.push(result);
      console.log(`${status === 0 && result.status === 'passed' ? 'PASS' : 'FAIL'} ${spec} (${result.passed} passed, ${result.failed} failed, ${result.pending} pending)`);
      if (result.failures.length) {
        for (const failure of result.failures.slice(0, 10)) {
          console.log(`  ${failure.name}: ${failure.expectations.map(item => item.message).join('; ')}`);
        }
      }
    }
  }));
  results.sort((a, b) => a.file.localeCompare(b.file));
  const summary = {
    files: results.length,
    passed: results.reduce((total, result) => total + result.passed, 0),
    failed: results.reduce((total, result) => total + result.failed, 0),
    pending: results.reduce((total, result) => total + result.pending, 0),
    failingFiles: results.filter(result => result.exitCode !== 0 || result.status !== 'passed').map(result => result.file)
  };
  const report = path.join(temporary, 'results.json');
  fs.writeFileSync(report, JSON.stringify({ ...summary, results }, null, 2));
  console.log(JSON.stringify({ ...summary, report }, null, 2));
  process.exitCode = summary.failingFiles.length ? 1 : 0;
}
