import {createServer} from 'node:http';
import {get} from 'node:https';
import {mkdir, readFile, writeFile} from 'node:fs/promises';

const PORT=3218;
const DATA_DIR='/var/lib/europe-flight-status';
const CACHE_FILE=DATA_DIR+'/ut785.json';
const SOURCE_URL='https://rasp.yandex.kz/search/?fromId=c213&fromName=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&toId=c10262&toName=%D0%95%D1%80%D0%B5%D0%B2%D0%B0%D0%BD&when=17+%D1%81%D0%B5%D0%BD%D1%82%D1%8F%D0%B1%D1%80%D1%8F';
const FALLBACK={flight:'UT 785',departure:'2026-09-17T20:50:00+03:00',scheduledDeparture:'2026-09-17T20:50:00+03:00',source:'Расписание из плана',sourceUrl:SOURCE_URL,updatedAt:null,refreshAfter:null,note:'Расписание из онлайн-источника ещё не получено'};
let value=null, loading=null;

function request(url){return new Promise((resolve,reject)=>{const req=get(url,{headers:{'user-agent':'Europe2026 family trip schedule monitor/1.0','accept-encoding':'identity','accept-language':'ru-RU,ru;q=0.9'}},res=>{let body='';res.setEncoding('utf8');res.on('data',chunk=>body+=chunk);res.on('end',()=>res.statusCode>=200&&res.statusCode<300?resolve(body):reject(Error('HTTP '+res.statusCode)))});req.setTimeout(15000,()=>req.destroy(Error('timeout')));req.on('error',reject)});}
function scheduleFromPage(html){
 const found=html.match(/window\.INITIAL_STATE = (\{.*?\});\n/);
 if(!found)throw Error('Yandex schedule state not found');
 const state=JSON.parse(found[1]);
 const segment=state?.search?.segments?.find(item=>String(item?.number).replace(/\s/g,'')==='UT785'&&item?.startDate==='2026-09-17');
 if(!segment?.departureLocalDt)throw Error('UT785 not found for 2026-09-17');
 const departure=segment.departureEvent?.dateTime||segment.departureEvent?.time||segment.departureLocalDt;
 const scheduledDeparture=segment.departureLocalDt;
 return {flight:'UT 785',departure,scheduledDeparture,source:'Яндекс Расписания',sourceUrl:SOURCE_URL,updatedAt:new Date().toISOString(),refreshAfter:new Date(Date.now()+10*60*1000).toISOString(),delayed:departure!==scheduledDeparture,note:segment.departureEvent?.status||undefined};
}
async function refresh(){
 if(loading)return loading;
 loading=(async()=>{try{const next=scheduleFromPage(await request(SOURCE_URL));value=next;await mkdir(DATA_DIR,{recursive:true});await writeFile(CACHE_FILE,JSON.stringify(next))}catch(error){console.error('UT785 refresh failed:',error.message);if(!value)try{value=JSON.parse(await readFile(CACHE_FILE,'utf8'))}catch{value=FALLBACK}}finally{loading=null}return value})();
 return loading;
}
createServer(async(req,res)=>{
 if(req.url!=='/ut785.json'){res.writeHead(404);return res.end()}
 if(!value||Date.parse(value.refreshAfter||0)<=Date.now())await refresh();
 res.writeHead(200,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','access-control-allow-origin':'https://europe2026.proskurnin.com'});res.end(JSON.stringify(value));
}).listen(PORT,'127.0.0.1',()=>{
 console.log('UT785 status service on '+PORT);
 refresh().catch(error=>console.error('Initial UT785 refresh failed:',error.message));
});
