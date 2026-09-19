import assert from 'node:assert/strict';
import ts from 'typescript';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const dir=mkdtempSync(join(tmpdir(),'europe-storage-'));
try{
 for(const name of ['account-client','server-storage']){
  const source=readFileSync('lib/'+name+'.ts','utf8').replace("'./account-client'","'./account-client.mjs'");
  writeFileSync(join(dir,name+'.mjs'),ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText);
 }
 const local=new Map([['europe2026-personal-v1',JSON.stringify({visits:{old:{note:'legacy'}},checks:{}})]]);
 globalThis.window=new EventTarget();window.localStorage={getItem:k=>local.get(k)??null,removeItem:k=>local.delete(k),setItem:()=>{throw Error('Browser writes forbidden');}};
 let user='owner',fail=false,release,hold=false;const remote={},archive=[];
 globalThis.fetch=async(path,options={})=>{
  remote[user]??={};const data=options.body?JSON.parse(options.body):null;
  if(fail&&options.method==='PUT')throw Error('offline');
  if(options.method==='PUT'&&hold){hold=false;await new Promise(r=>release=r);}
  let result,status=200;
  if(options.method==='GET')result={userId:user,items:structuredClone(remote[user])};
  else if(data.accountId!==user){status=409;result={error:'changed account'};}
  else if(path.endsWith('/import')){archive.push(data.value);remote[user][data.key]??={value:data.value,revision:1};result={row:remote[user][data.key]};}
  else if(data.revision!==(remote[user][data.key]?.revision||0)){status=409;result={error:'conflict'};}
  else {remote[user][data.key]={value:data.value,revision:data.revision+1};result={row:remote[user][data.key]};}
  return new Response(JSON.stringify(result),{status});
 };
 const store=await import(pathToFileURL(join(dir,'server-storage.mjs')));
 await store.loadStorage({id:'owner',role:'owner'});
 assert.equal(local.size,0);assert.equal(archive.length,1);
 hold=true;store.cloudStorage.setItem('personal','first');
 await new Promise(r=>setTimeout(r,0));
 store.cloudStorage.setItem('personal','latest');release();await store.flushStorage();
 assert.equal(remote.owner.personal.value,'latest');
 fail=true;store.cloudStorage.setItem('personal','offline draft');await assert.rejects(store.flushStorage());
 assert.equal(store.cloudStorage.getItem('personal'),'offline draft');assert.ok(store.hasStorageError());
 fail=false;await store.flushStorage();assert.equal(remote.owner.personal.value,'offline draft');
 remote.owner.personal={value:'other device',revision:remote.owner.personal.revision+1};
 store.cloudStorage.setItem('personal','conflicting draft');await assert.rejects(store.flushStorage());assert.equal(remote.owner.personal.value,'other device');
 user='participant';await store.loadStorage({id:user,role:'participant'});assert.equal(store.cloudStorage.getItem('personal'),null);
 console.log('Storage client: migration, queued edits, offline retry, conflicts and account isolation passed');
}finally{rmSync(dir,{recursive:true,force:true});}
