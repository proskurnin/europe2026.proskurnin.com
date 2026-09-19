'use client';
import {api,type User} from './account-client';
type Row={value:string;revision:number};
let identity='',role='',generation=0,initialized=false,writeEpoch=0;
let rows:Record<string,Row>={},drafts:Record<string,string>={},error='',busy=false;
let worker:Promise<void>|null=null;
export const storageEvent='europe-server-storage';
const emit=()=>{if(typeof window!=='undefined')window.dispatchEvent(new Event(storageEvent));};
const normalize=(key:string)=>key.startsWith('europe2026-personal-v1')?'personal':({'europe2026-plan-v1':'plan','europe2026-history-v1':'history','europe2026-base-version':'base-version','europe2026-logistics-v1':'logistics','europe2026-map-provider':'map-provider'} as Record<string,string>)[key]||key;
export const cloudStorage={
 getItem(key:string){key=normalize(key);return drafts[key]??rows[key]?.value??null;},
 setItem(key:string,value:string){
  key=normalize(key);
  if((!identity||!['owner','participant'].includes(role))&&['map-provider','logistics'].includes(key)){rows[key]={value,revision:0};emit();return;}
  if(!identity||!initialized||!['owner','participant'].includes(role))throw Error('Войдите как владелец или участник, чтобы сохранить данные на сервере.');
  drafts[key]=value;writeEpoch++;emit();void flushStorage().catch(()=>{});
 },
};
export function storageStatus(){return error||(busy||Object.keys(drafts).length?'Сохранение на сервер…':'Все изменения сохранены на сервере');}
export function hasStorageError(){return !!error;}
export async function flushStorage():Promise<void>{
 if(worker)return worker;
 const scope=generation;busy=true;error='';emit();
 worker=(async()=>{
  while(scope===generation&&Object.keys(drafts).length){
   const key=Object.keys(drafts)[0],value=drafts[key],revision=rows[key]?.revision||0;
   const result=await api('/api/trip/storage','PUT',{key,value,revision,accountId:identity});
   if(scope!==generation)return;
   rows[key]=result.row;writeEpoch++;if(drafts[key]===value)delete drafts[key];emit();
  }
 })().catch(e=>{if(scope===generation){error='Не сохранено на сервере: '+(e as Error).message;emit();}throw e;}).finally(()=>{if(scope===generation){busy=false;worker=null;emit();}});
 return worker;
}
export async function loadStorage(user:User|null){
 const next=user?.id||'';
 if(next!==identity){generation++;identity=next;role=user?.role||'';rows={};drafts={};error='';busy=false;worker=null;initialized=false;emit();}
 role=user?.role||'';
 if(!user||!['owner','participant'].includes(role))return;
 const scope=generation;
 const epoch=writeEpoch;const result=await api('/api/trip/storage');
 if(result.userId!==user.id)throw Error('Учётная запись изменилась. Обновите страницу.');
 if(epoch!==writeEpoch)return;
 if(scope!==generation)return;
 // Pending changes retain their original revision, so concurrent writes cannot overwrite them.
 for(const [key,row] of Object.entries(result.items))if(!(key in drafts))rows[key]=row as Row;
 if(!initialized){initialized=true;await migrateLegacy(user,scope);}
 emit();
}
async function migrateLegacy(user:User,scope:number){
 const keys=[user.role==='owner'?'europe2026-personal-v1':'europe2026-personal-v1-'+user.id];
 if(user.role==='owner')keys.push('europe2026-plan-v1','europe2026-history-v1','europe2026-base-version','europe2026-logistics-v1','europe2026-map-provider');
 for(const key of keys){
  if(scope!==generation)return;
  let value:string|null;try{value=window.localStorage.getItem(key);}catch{return;}
  if(value===null)continue;
  try{
   const saved=await api('/api/trip/storage/import','POST',{key:normalize(key),value,accountId:user.id});
   if(scope!==generation)return;
   if(!(normalize(key) in drafts))rows[normalize(key)]=saved.row;
   // Server retains an archive even when another device has newer data.
   if(window.localStorage.getItem(key)===value)window.localStorage.removeItem(key);
  }catch(e){error='Старые данные пока не перенесены: '+(e as Error).message;emit();}
 }
}
export function storageBeforeUnload(event:BeforeUnloadEvent){if(Object.keys(drafts).length){event.preventDefault();event.returnValue='';}}
