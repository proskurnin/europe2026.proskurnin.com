'use client';
import './logistics.css';
import {cloudStorage,storageEvent} from '@/lib/server-storage';
import {useEffect,useMemo,useState} from 'react';
import type {Trip} from '@/lib/trip';
import {itinerary,mapsLink,modes,transitDate,type Leg,type Mode} from '@/lib/logistics';

type Result={route?:google.maps.routes.Route;error?:string;current?:boolean;requested?:Date};
const cache=new Map<string,{expires:number;value:Promise<Result>}>();
const storage='europe2026-logistics-v1';
const clean=(value:string)=>value.replace(/<[^>]*>/g,'');
async function compute(leg:Leg,date:string):Promise<Result>{
 const when=transitDate(date,leg.to.id==='centrale'&&leg.mode==='bus'?'02:40':leg.from.leave||leg.from.time,leg.from.city);
 const key=JSON.stringify([leg.from.query||leg.from.location,leg.to.query||leg.to.location,leg.mode,when.date.toISOString().slice(0,16)]);
 const old=cache.get(key);if(old&&old.expires>Date.now())return old.value;
 const value=(async()=>{
  try{
   const {Route}=await google.maps.importLibrary('routes') as google.maps.RoutesLibrary;
   const transit=['metro','train','bus','ferry'].includes(leg.mode);
   const request:google.maps.routes.ComputeRoutesRequest={origin:leg.from.query||leg.from.location!,destination:leg.to.query||leg.to.location!,travelMode:leg.mode==='walk'?'WALKING':leg.mode==='taxi'?'DRIVING':'TRANSIT',fields:['path','legs','durationMillis','distanceMeters','warnings'],language:'ru'};
   if(transit){request.departureTime=when.date;request.transitPreference={routingPreference:'FEWER_TRANSFERS'};if(leg.mode==='metro')request.transitPreference.allowedTransitModes=['SUBWAY'];if(leg.mode==='train')request.transitPreference.allowedTransitModes=['RAIL'];if(leg.mode==='bus')request.transitPreference.allowedTransitModes=['BUS'];}
   const {routes}=await Route.computeRoutes(request);
   const route=routes?.[0];if(!route?.path?.length)return {error:'Google не нашёл маршрут на выбранное время. Откройте участок в Google Maps или выберите другой транспорт.'};
   if(leg.mode==='ferry'&&!route.legs?.some(l=>l.steps.some(s=>s.transitDetails?.transitLine?.vehicle?.vehicleType==='FERRY')))return {error:'Google не нашёл водный маршрут. Проверьте причал и расписание перевозчика; пешеходная замена не показана как паром.'};
   return {route,current:transit&&when.current,requested:transit?when.date:undefined};
  }catch(e){const message=String(e);return {error:/denied|not authorized|not activated|API_KEY|PERMISSION|REQUEST_DENIED/i.test(message)?'Google не разрешает расчёт маршрутов для этого сайта. Требуется подключение Routes API и разрешение для ключа карты.':'Не удалось рассчитать участок. Проверьте адреса, соединение и доступность транспорта.'};}
 })();
 cache.set(key,{expires:Date.now()+20*60*1000,value});return value;
}

export default function GoogleDayRoute({map,plan,visits,day,onSelect}:{map:google.maps.Map|null;plan:Trip;visits:any[];day:any;onSelect:(v:any)=>void}){
 const [choice,setChoice]=useState(''),[city,setCity]=useState(''),[preferences,setPreferences]=useState<Record<string,Mode>>({}),[addresses,setAddresses]=useState<Record<string,string>>({}),[results,setResults]=useState<Record<string,Result>>({}),[loading,setLoading]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{let previous='';const load=()=>{const raw=cloudStorage.getItem(storage)||'{}';if(raw===previous)return;previous=raw;try{const saved=JSON.parse(cloudStorage.getItem(storage)||'{}');setPreferences(Object.fromEntries(Object.entries(saved.modes||{}).filter(([,v])=>typeof v==='string'&&v in modes)) as Record<string,Mode>);setAddresses(Object.fromEntries(Object.entries(saved.addresses||{}).filter(([,v])=>typeof v==='string'&&v.length<300)) as Record<string,string>)}catch{}};load();window.addEventListener(storageEvent,load);return()=>window.removeEventListener(storageEvent,load);},[]);
 const save=(nextModes:Record<string,Mode>,nextAddresses:Record<string,string>)=>{setPreferences(nextModes);setAddresses(nextAddresses);try{cloudStorage.setItem(storage,JSON.stringify({modes:nextModes,addresses:nextAddresses}))}catch{}};
 useEffect(()=>{if(!map)return;const update=()=>{if((map.getZoom()||0)<9){setCity('');return;}const center=map.getCenter();if(!center)return;let found='',distance=Infinity;for(const [id,c] of Object.entries(plan.cities)){const d=(c[1]-center.lat())**2+((c[2]-center.lng())*Math.cos(center.lat()*Math.PI/180))**2;if(d<distance&&map.getBounds()?.contains({lat:c[1],lng:c[2]})){distance=d;found=id;}}setCity(found)};const l=map.addListener('idle',update);update();return()=>l.remove()},[map,plan]);
 useEffect(()=>{setChoice('')},[day?.id]);
 const nearDays=useMemo(()=>city?plan.days.filter(d=>itinerary(plan,d.date).stops.some(s=>s.city===city)):[],[plan,city]);
 const date=choice||day?.date||nearDays[0]?.date||'';
 const route=useMemo(()=>{
  const base=itinerary(plan,date,visits);
  const stops=base.stops.map(s=>({...s,query:addresses[`${date}:${s.id}`]||s.query}));
  const legs=base.legs.map((l,i)=>{const from=stops[i],to=stops[i+1],known=(from.location||from.query)&&(to.location||to.query);return {...l,from,to,mode:known?(preferences[l.id]||(l.mode==='unknown'?'walk':l.mode)):'unknown'} as Leg});
  return {stops,legs};
 },[plan,date,visits,preferences,addresses]);
 useEffect(()=>{
  if(!map||!date)return;
  let cancelled=false;const lines:google.maps.Polyline[]=[],pins:google.maps.marker.AdvancedMarkerElement[]=[],positions=new Map<string,google.maps.LatLngLiteral>();
  const info=new google.maps.InfoWindow();setResults({});setLoading(true);
  const mark=(id:string,position:google.maps.LatLngLiteral)=>{if(positions.has(id))return;positions.set(id,position);const i=route.stops.findIndex(s=>s.id===id),s=route.stops[i];const pin=document.createElement('span');pin.className='route-number';pin.textContent=String(i+1);const marker=new google.maps.marker.AdvancedMarkerElement({position,map,content:pin,title:`${i+1}. ${s.title}`,zIndex:2000+i,gmpClickable:true});marker.addListener('click',()=>{const v=visits.find(v=>v.id===`visit-${date}-${s.visit}`);if(v)onSelect(v);else{const text=document.createElement('div');text.textContent=`${i+1}. ${s.title}`;info.setContent(text);info.open({map,anchor:marker})}});pins.push(marker)};
  route.stops.forEach(s=>{if(s.location)mark(s.id,s.location)});
  void(async()=>{
   for(const leg of route.legs){
    if(cancelled)break;
    if(leg.mode==='unknown'||leg.mode==='flight')continue;
    const result=await compute(leg,date);if(cancelled)break;
    setResults(previous=>({...previous,[leg.id]:result}));
    if(result.route?.path){
     const path=result.route.path.map(p=>({lat:p.lat,lng:p.lng}));mark(leg.from.id,path[0]);mark(leg.to.id,path[path.length-1]);
     const line=new google.maps.Polyline({map,path,strokeColor:modes[leg.mode].color,strokeWeight:5,strokeOpacity:.86,zIndex:50,icons:leg.mode==='walk'?[{icon:{path:google.maps.SymbolPath.CIRCLE,scale:2,fillOpacity:1,strokeOpacity:1},offset:'0',repeat:'16px'}]:undefined});
     line.addListener('click',(e:google.maps.MapMouseEvent)=>{const text=document.createElement('div');text.textContent=`${leg.from.title} → ${leg.to.title} · ${modes[leg.mode].label} · ${Math.round((result.route?.durationMillis||0)/60000)} мин`;info.setContent(text);if(e.latLng)info.setPosition(e.latLng);info.open({map})});lines.push(line);
    }
    if(result.error?.includes('не разрешает'))break;
   }
   if(!cancelled)setLoading(false);
  })();
  return()=>{cancelled=true;info.close();lines.forEach(l=>{google.maps.event.clearInstanceListeners(l);l.setMap(null)});pins.forEach(p=>{google.maps.event.clearInstanceListeners(p);p.map=null})};
 },[map,date,route,retry]);
 const fit=()=>{if(!map)return;const bounds=new google.maps.LatLngBounds();route.stops.forEach(s=>{if(s.location)bounds.extend(s.location)});Object.values(results).forEach(r=>r.route?.path?.forEach(p=>bounds.extend({lat:p.lat,lng:p.lng})));if(!bounds.isEmpty())map.fitBounds(bounds,65)};
 const calculated=Object.values(results).filter(r=>r.route),totalMinutes=calculated.reduce((n,r)=>n+(r.route?.durationMillis||0)/60000,0);
 return <section className="day-logistics" aria-label="Маршрут между точками"><div className="logistics-heading"><div><small>ОТ ПЕРВОЙ ТОЧКИ ДО ПОСЛЕДНЕЙ</small><h3>Как идём и едем</h3></div><select aria-label="День маршрута на карте" value={date} onChange={e=>setChoice(e.target.value)}><option value="">Приблизьте город или выберите день</option>{plan.days.map(d=><option key={d.id} value={d.date}>{d.date.slice(8)}.{d.date.slice(5,7)} · {d.title}</option>)}</select></div>
 {!date?<p>Приблизьте город — появится последовательность остановок. Для городов с несколькими днями можно выбрать нужную дату.</p>:<>
 {nearDays.length>1&&!day&&<div className="route-days">{nearDays.map(d=><button key={d.id} aria-pressed={date===d.date} onClick={()=>setChoice(d.date)}>{d.date.slice(8)}.{d.date.slice(5,7)}</button>)}</div>}
 <div className="route-summary"><b>{route.stops.length} остановок · {calculated.length} из {route.legs.length} участков рассчитано{totalMinutes>0?` · ≈${Math.round(totalMinutes)} мин в пути`:''}</b><button onClick={fit}>Показать весь маршрут</button><button disabled={loading} onClick={()=>{cache.clear();setRetry(n=>n+1)}}>{loading?'Прокладываем…':'Обновить маршруты'}</button></div>
 <p className="route-disclaimer">Номера показывают порядок посещения. Цвет линии — выбранный транспорт; нажмите на линию для деталей. Такси рассчитывается как автомобильный путь, без заказа машины. Время в пути не включает осмотр мест. Расписание транспорта на дату поездки может измениться.</p>
 <ol className="route-stops">{route.stops.map((stop,i)=>{const leg=route.legs[i-1],result=leg?results[leg.id]:undefined;const missing=!stop.query&&!stop.location;return <li key={stop.id}>
 {leg&&<div className="route-leg" style={{borderColor:modes[leg.mode].color}}><div className="route-leg-heading"><span>{modes[leg.mode].icon}</span>{leg.mode==='unknown'||leg.mode==='flight'?<b>{modes[leg.mode].label}</b>:<select aria-label={`Транспорт: ${leg.from.title} → ${leg.to.title}`} value={leg.mode} onChange={e=>save({...preferences,[leg.id]:e.target.value as Mode},addresses)}>{(['walk','taxi','metro','train','bus','ferry'] as Mode[]).map(m=><option key={m} value={m}>{modes[m].label}</option>)}</select>}{result?.route&&<b>{Math.round((result.route.durationMillis||0)/60000)} мин · {((result.route.distanceMeters||0)/1000).toFixed(1)} км</b>}</div>
 {leg.note&&<p>{leg.note}</p>}{leg.mode==='unknown'&&<p>Нужен точный адрес. Линия этого участка пока не построена.</p>}{leg.mode==='flight'&&<p>Авиаперелёт показан отдельно; наземный маршрут между аэропортами не строится.</p>}{result?.error&&<p role="status">{result.error}</p>}{!result&&leg.mode!=='unknown'&&leg.mode!=='flight'&&<p>{loading?'Ожидает расчёта…':'Участок пока не рассчитан.'}</p>}
 {result?.current&&<p>Дата поездки вне доступного окна Google. Показан вариант транспорта на сегодня, а не расписание поездки.</p>}
 {result?.route&&<details><summary>Шаги и пересадки</summary>{result.route.legs?.flatMap(l=>l.steps).map((step,k)=>{const t=step.transitDetails,line=t?.transitLine;return <p key={k}>{t?`${line?.vehicle?.name||'Транспорт'} ${line?.shortName||line?.name||''}: ${t.departureStop?.name||''} → ${t.arrivalStop?.name||''}${t.headsign?' · в сторону '+t.headsign:''}`:clean(step.instructions||'Пеший переход')}{line?.agencies?.map((a,j)=><span key={j}> · {a.url?<a href={a.url.toString()} target="_blank" rel="noreferrer">{a.name}</a>:a.name}</span>)}</p>})}</details>}
 {result?.route?.warnings?.map((w,j)=><p className="route-warning" key={j}>{clean(w)}</p>)}{leg.mode!=='unknown'&&leg.mode!=='flight'&&<a href={mapsLink(leg)} target="_blank" rel="noreferrer">Открыть этот участок в Google Maps ↗</a>}</div>}
 <div className="route-stop-title"><span>{i+1}</span><b>{stop.title}</b>{stop.time&&<time>{stop.time}</time>}</div>
 {missing&&<form className="route-address" onSubmit={e=>{e.preventDefault();const value=String(new FormData(e.currentTarget).get('address')||'').trim();if(value)save(preferences,{...addresses,[`${date}:${stop.id}`]:value})}}><label>Адрес не опубликован <input name="address" maxLength={299} placeholder="Укажите точный адрес и город" aria-label={`Адрес: ${stop.title}`} required/></label><button type="submit">Добавить в мой маршрут</button><small>После входа адрес сохраняется в вашей учётной записи на сервере. Для построения пути он передаётся Google.</small></form>}
 {addresses[`${date}:${stop.id}`]&&<button className="text-link" onClick={()=>{const next={...addresses};delete next[`${date}:${stop.id}`];save(preferences,next)}}>Убрать мой адрес</button>}
 </li>})}</ol><p className="route-disclaimer">Маршруты: Google Maps. Предпочтение «Метро» или «Поезд» не гарантирует конкретную линию — фактический транспорт указан в шагах. Неизвестные адреса и причалы остаются разрывами, а не условными маршрутами.</p>
 </>}
 </section>;
}
