import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {openDB,invite} from './core.mjs';
import {createApp} from './app.mjs';

test('Roles, sessions, invitations, protected data and owner-only writes',async()=>{
 const sourcePlan=JSON.parse(readFileSync('data/plan.json','utf8'));
 const dir=mkdtempSync(join(tmpdir(),'europe-auth-test-')),dbPath=join(dir,'test.sqlite');
 const db=openDB(dbPath);db.prepare("INSERT INTO users(id,email,name,role,created_at) VALUES('owner','owner@example.test','Owner','owner',?)").run(new Date().toISOString());
 const ownerToken=invite(db,'owner');db.close();
 const origin='http://127.0.0.1:18929',app=createApp({dbPath,planPath:resolve('data/plan.json'),origin,secure:false});await new Promise(r=>app.listen(18929,'127.0.0.1',r));
 const request=async(path,{method='GET',body,cookie='',site=origin}={})=>{const res=await fetch(origin+path,{method,headers:{...(cookie?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json',Origin:site}:{})},body:body?JSON.stringify(body):undefined});return {status:res.status,data:await res.json(),cookie:res.headers.get('set-cookie')?.split(';')[0]};};
 try {
  let r=await request('/api/trip/plan');assert.equal(r.status,200);assert.equal(r.data.plan.expenses.length,0);assert.equal(r.data.plan.checks.length,0);assert.equal(r.data.plan.sourceDocument,'');assert.ok(r.data.plan.days.every(d=>!d.sourceText));
  for(const [path,method,body]of [['/api/trip/state','PATCH',{kind:'check',id:'x',value:true}],['/api/trip/videos','POST',{}],['/api/account/users','POST',{}]])assert.equal((await request(path,{method,body})).status,401);
  r=await request('/api/account/activate',{method:'POST',body:{token:ownerToken,password:'Owner secure phrase 2026'}});assert.equal(r.status,200);const owner=r.cookie;
  assert.equal((await request('/api/account/activate',{method:'POST',body:{token:ownerToken,password:'Another secure phrase'}})).status,400);
  r=await request('/api/trip/plan',{cookie:owner});assert.equal(r.data.plan.expenses.length,sourcePlan.expenses.length);assert.equal(r.data.plan.checks.length,sourcePlan.checks.length);const checkId=r.data.plan.checks[0].id,visitId=r.data.plan.visits[0].id,dayId=r.data.plan.days[0].id;
  assert.equal((await request('/api/account/users',{method:'POST',cookie:owner,site:'https://evil.example',body:{email:'evil@example.test',role:'owner'}})).status,403);
  assert.equal((await request('/api/account/users',{method:'POST',cookie:owner,body:{email:'evil@example.test',role:'owner'}})).status,400);
  const cookies={};const ids={};
  for(const role of ['participant','viewer']){
   r=await request('/api/account/users',{method:'POST',cookie:owner,body:{email:role+'@example.test',role,name:role}});assert.equal(r.status,201);
   const t=new URL(r.data.url).hash.slice('#activate='.length);
   r=await request('/api/account/activate',{method:'POST',body:{token:t,password:'Member secure phrase 2026'}});assert.equal(r.status,200);cookies[role]=r.cookie;ids[role]=r.data.user.id;
   for(const [path,method,body]of [['/api/trip/state','PATCH',{kind:'check',id:checkId,value:true}],['/api/trip/videos','POST',{url:'https://youtu.be/M7lc1UVf-VE',title:'Test'}],['/api/account/users','POST',{email:'x@y.test',role:'participant'}],['/api/trip/import-marks','POST',{checks:{}}]])assert.equal((await request(path,{method,body,cookie:r.cookie})).status,403);
  }
  assert.equal((await request('/api/trip/plan',{cookie:cookies.participant})).data.plan.expenses.length,sourcePlan.expenses.length);
  assert.equal((await request('/api/trip/plan',{cookie:cookies.viewer})).data.plan.expenses.length,0);
  r=await request('/api/trip/import-marks',{method:'POST',cookie:owner,body:{checks:{[checkId]:true},visits:{[visitId]:{status:'visited'}}}});assert.equal(r.status,200);assert.equal(r.data.checks[checkId],true);
  assert.equal((await request('/api/trip/import-marks',{method:'POST',cookie:owner,body:{checks:{}}})).status,409);
  r=await request('/api/trip/state',{cookie:cookies.viewer});assert.deepEqual(r.data.checks,{});assert.equal(r.data.visits[visitId],'visited');
  r=await request('/api/trip/state',{method:'PATCH',cookie:owner,body:{kind:'check',id:checkId,value:false}});assert.equal(r.data.checks[checkId],false);
  assert.equal((await request('/api/trip/state',{method:'PATCH',cookie:owner,body:{kind:'check',id:'unknown',value:true}})).status,400);
  r=await request('/api/trip/videos',{method:'POST',cookie:owner,body:{url:'https://youtu.be/M7lc1UVf-VE',title:'Test',dayId}});assert.equal(r.status,201);
  assert.equal((await request('/api/trip/videos',{method:'POST',cookie:owner,body:{url:'https://evil.test/watch?v=M7lc1UVf-VE',title:'Test'}})).status,400);
  assert.equal((await request('/api/trip/videos',{method:'POST',cookie:owner,body:{url:'https://youtu.be/M7lc1UVf-VE',title:'Test'}})).status,409);
  r=await request('/api/trip/videos');assert.equal(r.data.videos.length,1);const videoId=r.data.videos[0].id;
  assert.equal((await request('/api/trip/videos/'+videoId,{method:'DELETE',cookie:cookies.participant,body:{}})).status,403);
  assert.equal((await request('/api/trip/videos/'+videoId,{method:'PATCH',cookie:owner,body:{title:'Edited',dayId:null}})).status,200);
  assert.equal((await request('/api/trip/videos/'+videoId,{method:'DELETE',cookie:owner,body:{}})).status,200);
  assert.equal((await request('/api/trip/videos')).data.videos.length,0);
  assert.equal((await request('/api/account/users/'+ids.participant,{method:'PATCH',cookie:owner,body:{role:'viewer',active:true}})).status,200);
  assert.equal((await request('/api/account/me',{cookie:cookies.participant})).data.user,null);
  r=await request('/api/account/login',{method:'POST',body:{email:'participant@example.test',password:'Member secure phrase 2026'}});assert.equal(r.data.user.role,'viewer');
  assert.equal((await request('/api/trip/plan',{cookie:r.cookie})).data.plan.expenses.length,0);
  assert.equal((await request('/api/account/users/owner',{method:'PATCH',cookie:owner,body:{role:'viewer',active:false}})).status,400);
  r=await request('/api/account/password',{method:'POST',cookie:owner,body:{currentPassword:'Owner secure phrase 2026',password:'New owner secure phrase'}});assert.equal(r.status,200);const newOwner=r.cookie;
  assert.equal((await request('/api/account/me',{cookie:owner})).data.user,null);
  assert.equal((await request('/api/account/logout',{method:'POST',cookie:newOwner,body:{}})).status,200);
  assert.equal((await request('/api/account/me',{cookie:newOwner})).data.user,null);
  assert.equal((await request('/api/account/login',{method:'POST',body:{email:'owner@example.test',password:'bad'}})).status,401);
 }finally{await new Promise(r=>app.close(r));rmSync(dir,{recursive:true,force:true});}
});
