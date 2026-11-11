#!/usr/bin/env node
'use strict';
// Source inventory is an audit aid, not a proof that a handler is pure or
// exhaustive. It only finds direct instanceof PowerEffect conditionals.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const ts=require(path.join(root,'ptcg-server/node_modules/typescript'));
const sets=path.join(root,'ptcg-server/src/sets');const entries=[];
function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,d.name);if(d.isDirectory()){if(d.name!=='tests')walk(file);continue;}if(!file.endsWith('.ts'))continue;
 const text=fs.readFileSync(file,'utf8');if(!text.includes('PowerEffect'))continue;
 const sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true),checksPowers=text.includes('instanceof CheckPokemonPowersEffect');
 function visit(node){if(ts.isIfStatement(node)&&/instanceof\s+PowerEffect/.test(node.expression.getText(sf))){let throws=false,prevents=false,invokesNested=false,prompts=false,random=false;
  function scan(x){if(ts.isThrowStatement(x))throws=true;if(ts.isBinaryExpression(x)&&/preventDefault\s*=\s*true/.test(x.getText(sf)))prevents=true;
   if(ts.isCallExpression(x)){const callee=x.expression.getText(sf);if(/(?:store\.reduceEffect|IS_[A-Z_]+_BLOCKED|HAS_MARKER)/.test(callee))invokesNested=true;if(/(?:store\.prompt|PROMPT)/.test(callee))prompts=true;if(callee==='Math.random')random=true;}
   ts.forEachChild(x,scan);}scan(node.thenStatement);
  const condition=node.expression.getText(sf).replace(/\s+/g,' ').slice(0,350);
  entries.push({file:path.relative(sets,file),line:sf.getLineAndCharacterOfPosition(node.getStart(sf)).line+1,condition,throws,prevents,invokesNested,prompts,random,checksPowers,possibleSelfOnly:/effect\.power\s*===\s*this\.powers\[/.test(condition)});
 }ts.forEachChild(node,visit);}visit(sf);
}}
walk(sets);entries.sort((a,b)=>a.file.localeCompare(b.file)||a.line-b.line);
const result={schema:1,warning:'Lower bound only. Nested throws, indirect helpers, overrides, marker hooks and custom type tests require manual review; a powers query in the file does not prove parity.',branches:entries};
const output=JSON.stringify(result,null,2)+'\n';
if(process.argv.length===4&&process.argv[2]==='--write')fs.writeFileSync(path.resolve(process.argv[3]),output);else if(process.argv.length===2)process.stdout.write(output);else throw new Error('Usage: node tools/inventory-suppression.cjs [--write output.json]');
