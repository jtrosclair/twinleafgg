'use strict';
const fs=require('node:fs'),path=require('node:path'),Jasmine=require('./ptcg-server/node_modules/jasmine');
const suite=process.argv[2];if(!['green','red'].includes(suite))throw Error('Usage: node run-focused.cjs green|red');
const runner=new Jasmine({projectBaseDir:path.join(__dirname,'ptcg-server')});
const file=suite==='green'?'simisage-par.investigation.spec.js':'simisage-par.blockers.red.spec.js';
const report={suite,file,passed:0,failed:0,pending:0,failures:[]};
runner.loadConfig({spec_dir:'.simisage-test/sets/tests',spec_files:[file],random:false});runner.env.clearReporters();
runner.addReporter({specDone(r){if(r.status==='passed')report.passed++;else if(r.status==='failed')report.failed++;else report.pending++;if(r.failedExpectations.length)report.failures.push({name:r.fullName,expectations:r.failedExpectations.map(e=>e.message)});},jasmineDone(r){report.status=r.overallStatus;report.suiteFailures=r.failedExpectations;fs.writeFileSync(path.join(__dirname,suite+'-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({suite,passed:report.passed,failed:report.failed,status:r.overallStatus}));}});
runner.execute();
