#!/usr/bin/env node
'use strict';
// Conservative syntax inventory, not a list of verified legality checks.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const repo=path.resolve(process.argv[2]||path.join(__dirname,'../../../..'));
const ts=require(path.join(repo,'ptcg-server/node_modules/typescript'));
const root=path.join(repo,'ptcg-server/src/sets');
function* walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const p=path.join(dir,e.name);if(e.isDirectory()&&!['tests','__tests__'].includes(e.name))yield*walk(p);else if(e.isFile()&&p.endsWith('.ts')&&!p.endsWith('.spec.ts'))yield p;}}
const rows=[],digest=crypto.createHash('sha256');let scanned=0;
for(const file of walk(root)){
 const rel=path.relative(root,file).split(path.sep).join('/'),src=fs.readFileSync(file,'utf8');digest.update(rel+'\0'+src+'\0');scanned++;
 if(!src.includes('GameError')||!src.includes('reduce'))continue;
 const sf=ts.createSourceFile(file,src,ts.ScriptTarget.Latest,true);
 function visit(n,method,conditions,callback){
  if(ts.isMethodDeclaration(n)&&n.name?.getText(sf).includes('reduce')){method=n.name.getText(sf);conditions=[];callback=false;}
  else if(method&&(ts.isArrowFunction(n)||ts.isFunctionExpression(n)))callback=true;
  if(ts.isIfStatement(n))conditions=[...conditions,n.expression.getText(sf)];
  if(method&&ts.isThrowStatement(n)&&n.expression?.getText(sf).includes('GameError')){
   const context=conditions.join(' | ');
   if(/WAS_ATTACK_USED|AttackEffect|attackEffect/i.test(context))rows.push({file:rel,line:sf.getLineAndCharacterOfPosition(n.getStart()).line+1,method,kind:/WAS_ATTACK_USED/.test(context)?'WAS_ATTACK_USED':/instanceof\s+AttackEffect/.test(context)?'AttackEffect':'other',insideFunctionCallback:callback,context:context.slice(0,500)});
  }
  ts.forEachChild(n,ch=>visit(ch,method,conditions,callback));
 }
 visit(sf,'',[],false);
}
const grouped={};for(const r of rows){const k=r.kind+' '+(r.insideFunctionCallback?'inside callback':'direct');grouped[k]=(grouped[k]||0)+1}
console.log(JSON.stringify({scope:'set TypeScript files excluding tests',typescript:ts.version,filesScanned:scanned,sourceTreeSha256:digest.digest('hex'),total:rows.length,grouped,rows},null,2));
