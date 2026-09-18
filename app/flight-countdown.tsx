'use client';
import {useEffect,useState} from 'react';
import {Plane,ArrowRight} from 'lucide-react';
import {nextFlight,flightTime} from '@/lib/flights';

const number=(n:number)=>String(n).padStart(2,'0');
export default function FlightCountdown({sourceDocument=""}:{sourceDocument?:string}){
 const [now,setNow]=useState<number|null>(null);
 useEffect(()=>{const tick=()=>setNow(Date.now());tick();const timer=window.setInterval(tick,1000);document.addEventListener('visibilitychange',tick);window.addEventListener('pageshow',tick);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',tick);window.removeEventListener('pageshow',tick)}},[]);
 if(now===null)return <section className="flight-countdown"><p>Определяем следующий рейс…</p></section>;
 const flight=nextFlight(now);
 if(!flight)return <section className="flight-countdown"><div className="flight-countdown-copy"><small><Plane size={14}/>ПЕРЕЛЁТЫ</small><h2>Новых рейсов в плане пока нет</h2><p>Все указанные даты вылета уже прошли. Фактическое выполнение смотрите в журнале.</p></div></section>;
 const remaining=flight.departure?Math.max(0,Date.parse(flight.departure)-now):null;
 const parts=remaining===null?null:[Math.floor(remaining/86400000),Math.floor(remaining/3600000)%24,Math.floor(remaining/60000)%60,Math.floor(remaining/1000)%60];
 return <section className="flight-countdown next-flight" aria-label="Следующий рейс"><div className="flight-countdown-copy"><small><Plane size={14}/>СЛЕДУЮЩИЙ РЕЙС · {flight.number}</small><h2>{flight.from} → {flight.to}</h2><div className="flight-airports"><span><span role="img" aria-label={flight.fromCountry}>{flight.fromFlag}</span> {flight.fromAirport}</span><ArrowRight size={18} aria-hidden="true"/><span><span role="img" aria-label={flight.toCountry}>{flight.toFlag}</span> {flight.toAirport}</span></div><p>{flight.departure?<>Вылет: {flightTime(flight.departure,flight.fromZone)} · местное время ({flight.from})</>:<>Дата по плану: {new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(flight.date+'T12:00:00Z'))} · время вылета уточняется</>}</p>{flight.arrival&&<p>Прилёт: {flightTime(flight.arrival,flight.toZone)} · местное время ({flight.to})</p>}</div>{parts?<div className="flight-clock"><p>До вылета по расписанию</p><div className="countdown-digits" role="timer" aria-label="Обратный отсчёт до следующего вылета">{parts.map((n,i)=><div key={i}><b>{number(n)}</b><span>{['дней','часов','минут','секунд'][i]}</span></div>)}</div></div>:<p>Обратный отсчёт появится после подтверждения времени.</p>}<div className="flight-status"><p>Расписание из Google Doc · сверено 18.09.2026</p><span>После времени вылета карточка переключается автоматически. Задержки сверяйте с авиакомпанией.</span>{sourceDocument&&<a href={sourceDocument} target="_blank" rel="noreferrer">Открыть план</a>}</div></section>;
}
