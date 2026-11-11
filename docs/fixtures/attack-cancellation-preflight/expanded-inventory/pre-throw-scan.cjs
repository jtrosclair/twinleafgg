#!/usr/bin/env node
'use strict';
// Syntax-only scan for observable-looking operations before a GameError throw.
// False positives and missed indirect operations are expected.
const fs=require('node:fs'),path=require('node:path');
const repo=path.resolve(process.argv[2]||path.join(__dirname,'../../../..'));
const ts=require(path.join(repo,'ptcg-server/node_modules/typescript'));
const root=path.join(repo,'ptcg-server/src/sets');
function* walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const p=path.join(dir,e.name);if(e.isDirectory()&&!['tests','__tests__'].includes(e.name))yield*walk(p);else if(e.isFile()&&p.endsWith('.ts')&&!p.endsWith('.spec.ts'))yield p;}}
const rows=[];
for(const file of walk(root)){
 const text=fs.readFileSync(file,'utf8');if(!text.includes('GameError')||!text.includes('WAS_ATTACK_USED'))continue;
 const sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
 function visit(n){
  if(ts.isIfStatement(n)&&/WAS_ATTACK_USED\(/.test(n.expression.getText(sf))&&ts.isBlock(n.thenStatement)){
   let previous='';for(const stmt of n.thenStatement.statements){const current=stmt.getText(sf);
    if(current.includes('throw new GameError')&&/(\.move(?:Card|Cards|To)|\.splice\(|\.push\(|\.addMarker\(|\.removeMarker\(|\.damage\s*[+\-=]|\.used(?:GX|VSTAR)\s*=|store\.prompt\(|store\.reduceEffect\()/m.test(previous))rows.push({file:path.relative(root,file).split(path.sep).join('/'),line:sf.getLineAndCharacterOfPosition(stmt.getStart()).line+1,before:previous.slice(-800),guard:current.slice(0,500)});
    previous+=current+'\n';
   }
  }
  ts.forEachChild(n,visit);
 }
 visit(sf);
}
console.log(JSON.stringify({scope:'WAS_ATTACK_USED blocks with syntactically suspicious operations before a direct GameError',typescript:ts.version,total:rows.length,rows},null,2));
