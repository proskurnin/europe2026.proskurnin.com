import {readFileSync,writeFileSync,mkdirSync,renameSync} from 'node:fs';
import {resolve} from 'node:path';
import {validateTrip,comparePlans,mergePlan,emptyPersonal} from '../lib/trip.ts';
const candidate=process.argv[2];if(!candidate)throw Error('Usage: node --experimental-strip-types scripts/import-plan.mts candidate.json [--apply] [--accept-conflicts]');
const path=resolve('data/plan.json'),old=JSON.parse(readFileSync(path,'utf8')),next=JSON.parse(readFileSync(candidate,'utf8'));validateTrip(old);validateTrip(next);
if(next.version===old.version&&JSON.stringify(next)!==JSON.stringify(old))throw Error('Changed plan must have a new version.');
const diff=comparePlans(old,next,emptyPersonal);mkdirSync('work',{recursive:true});writeFileSync('work/import-comparison.json',JSON.stringify(diff,null,2));
console.log(JSON.stringify(diff.map(c=>({kind:c.kind,title:c.title,fields:c.fields})),null,2));
if(process.argv.includes('--apply')){
 const risky=diff.some(c=>c.kind==='Удалено'||c.fields?.some((f:string)=>['date','city','status','amount','placeId','dayId'].includes(f)));
 if(risky&&!process.argv.includes('--accept-conflicts'))throw Error('Review deletions/date/status/price changes, then use --accept-conflicts only after resolving ambiguity.');
 if(/Akazienweg|дата рождения|\b(?:booking|reservation)[ _-]?(?:number|code)\b/i.test(JSON.stringify(next)))throw Error('Possible private data: remove before publication.');
 mkdirSync('data/history',{recursive:true});writeFileSync('data/history/'+old.version.replace(/[^a-zA-Z0-9-]/g,'_')+'.json',JSON.stringify(old,null,2));
 const merged=mergePlan(old,next);writeFileSync(path+'.tmp',JSON.stringify(merged,null,2));renameSync(path+'.tmp',path);console.log('Applied, previous version saved. Photos and reference files retained.');
}else console.log('Preview only. No files changed except the comparison report.');
