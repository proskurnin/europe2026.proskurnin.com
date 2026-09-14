'use client';

import {useEffect, useMemo, useState} from 'react';
import {AlertCircle, Clock3, Plane, RefreshCw} from 'lucide-react';

type FlightStatus={
  flight:string;
  departure:string;
  scheduledDeparture:string;
  source:string;
  sourceUrl:string;
  updatedAt:string;
  refreshAfter:string;
  delayed?:boolean;
  note?:string;
};

const fallback:FlightStatus={flight:'UT 785',departure:'2026-09-17T20:50:00+03:00',scheduledDeparture:'2026-09-17T20:50:00+03:00',source:'Расписание из плана',sourceUrl:'https://rasp.yandex.ru/',updatedAt:'',refreshAfter:'',note:'Расписание проверяется'};
const number=(value:number)=>String(Math.max(0,value)).padStart(2,'0');
function formatDeadline(value:string){return new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Moscow'}).format(new Date(value));}

export default function FlightCountdown(){
 const [flight,setFlight]=useState<FlightStatus>(fallback),[now,setNow]=useState(Date.now()),[loading,setLoading]=useState(true),[error,setError]=useState(false);
 const refresh=async()=>{setLoading(true);try{const response=await window.fetch('/api/ut785.json',{cache:'no-store'});if(!response.ok)throw Error('unavailable');const data=await response.json() as FlightStatus;if(!data?.departure||Number.isNaN(Date.parse(data.departure)))throw Error('invalid');setFlight(data);setError(false)}catch{setError(true)}finally{setLoading(false)}};
 useEffect(()=>{refresh();const schedule=window.setInterval(refresh,5*60*1000);const timer=window.setInterval(()=>setNow(Date.now()),1000);return()=>{window.clearInterval(schedule);window.clearInterval(timer)}},[]);
 const remaining=useMemo(()=>Math.max(0,Date.parse(flight.departure)-now),[flight.departure,now]);
 const parts={days:Math.floor(remaining/86400000),hours:Math.floor(remaining/3600000)%24,minutes:Math.floor(remaining/60000)%60,seconds:Math.floor(remaining/1000)%60};
 const moved=flight.departure!==flight.scheduledDeparture;
 const finished=remaining===0;
 return <section className="flight-countdown" aria-live="polite"><div className="flight-countdown-copy"><small><Plane size={14}/>ПЕРВЫЙ ВЫЛЕТ · ВНУКОВО → ЗВАРТНОЦ</small><h2>{finished?'Рейс уже вылетел':<>До вылета из Москвы</>}</h2><p>{flight.flight} · {formatDeadline(flight.departure)} по Москве</p></div><div className="countdown-digits" aria-label={finished?'Время вылета наступило':`${parts.days} дней ${parts.hours} часов ${parts.minutes} минут ${parts.seconds} секунд до вылета`}>
 <div><b>{number(parts.days)}</b><span>дней</span></div><i>:</i><div><b>{number(parts.hours)}</b><span>часов</span></div><i>:</i><div><b>{number(parts.minutes)}</b><span>минут</span></div><i>:</i><div><b>{number(parts.seconds)}</b><span>секунд</span></div></div>
 <div className="flight-status"><p className={moved?'flight-moved':''}>{moved?'Время изменено авиакомпанией':flight.delayed?'Есть изменение времени вылета':'Расписание подтверждено'}</p><span>{error?<><AlertCircle size={13}/> Не удалось обновить сейчас — показываем последнее полученное время.</>:<><Clock3 size={13}/> Проверено {flight.updatedAt?new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(flight.updatedAt)):'сейчас'}.</>}</span><button type="button" onClick={refresh} disabled={loading}><RefreshCw size={14}/>{loading?'Обновляем':'Проверить ещё раз'}</button><a href={flight.sourceUrl} target="_blank" rel="noreferrer">Источник: {flight.source}</a></div>
 </section>;
}
