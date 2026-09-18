'use client';
import {useEffect,useState} from 'react';
import {Check,ArrowRight,MapPin,BookOpen,Wallet} from 'lucide-react';
import {Progress} from '@/components/ui/progress';

import {dateLabel,money,totals,type Trip} from '@/lib/trip';

export function JourneyProgress({plan,visits,onJournal}:{plan:Trip;visits:any[];onJournal:()=>void}){
 const [today,setToday]=useState('');
 useEffect(()=>{
  const update=()=>{const d=new Date();setToday([d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'));};
  update();const timer=setInterval(update,60000);return()=>clearInterval(timer);
 },[]);
 const days=[...plan.days].sort((a,b)=>a.date.localeCompare(b.date));
 const places=visits.filter(v=>v.category==='sight'&&!v.optional&&v.status!=='skip');
 const seen=places.filter(v=>v.status==='visited').length;
 const elapsed=today?days.filter(d=>d.date<today).length:0;
 const current=days.findIndex(d=>d.date===today)+1;
 const caption=!today?'Календарь поездки':current?'День '+current+' из '+days.length:elapsed===days.length?'Все дни по расписанию завершены':'Поездка по расписанию';
 return <section className="journey-progress" aria-label="Прогресс путешествия">
  <div className="journey-heading"><div><small>ПРОГРЕСС ПУТЕШЕСТВИЯ</small><h2><MapPin size={24}/>{caption}</h2><p>{today?'На '+dateLabel(today)+' · календарный прогресс и подтверждённые посещения.':'Календарный прогресс и подтверждённые посещения.'}</p></div>{plan.execution?.events?.length>0&&<button onClick={onJournal}><BookOpen size={18}/>Бортовой журнал<ArrowRight size={17}/></button>}</div>
  <div className="journey-meters"><div><div className="journey-meter-label"><span>Календарь поездки</span><b>{elapsed} из {days.length} дней позади</b></div><Progress value={elapsed/Math.max(1,days.length)*100} aria-label="Завершённые календарные дни поездки"/><p>По текущей дате на вашем устройстве. Даты сами по себе не подтверждают посещения.</p></div><div><div className="journey-meter-label"><span>Места основного плана</span><b>{seen} из {places.length} посетили</b></div><Progress value={seen/Math.max(1,places.length)*100} aria-label="Посещённые места основного плана"/><p>По отметкам посещения. Необязательные и пропущенные места исключены.</p></div></div>
 </section>
}

export default function JourneyJournal({onVisit,execution}:{onVisit:(id:string)=>void;execution:any}){
 const [date,setDate]=useState('all');
 const events=execution.events.filter((e:any)=>date==='all'||e.date===date);
 const routes=execution.routes.filter((e:any)=>date==='all'||e.date===date);
 const expenses=execution.expenses.filter((e:any)=>date==='all'||e.date===date);
 const sums=totals(expenses).sums;
 return <section className="journal-section">
  <div className="journal-toolbar"><label htmlFor="journal-date">Дата записи<select id="journal-date" aria-label="Дата записи" value={date} onChange={e=>setDate(e.target.value)}><option value="all">Все записи</option>{Array.from(new Set<string>([...execution.events,...execution.routes].map((e:any)=>e.date))).sort().map(d=><option key={d} value={d}>{dateLabel(d)}</option>)}</select></label><a href={execution.sourceDocument} target="_blank" rel="noreferrer">Раздел «Исполнение плана» в Google Doc ↗</a></div>
  <p className="journal-source">Обновлено по документу {dateLabel(execution.updatedAt)} · Новые записи из Google Doc появляются после обновления сайта через Codex. Общие статусы изменяет владелец; личные заметки сохраняются в браузере.</p>
  <div className="journal-grid"><div><h2>Что произошло</h2><div className="journal-timeline">{events.length?events.map((e:any)=><article key={e.id}><span className="journal-check"><Check size={17}/></span><small>{dateLabel(e.date)} · {e.time}</small><h3>{e.title}</h3><p>{e.text}</p>{'visitId' in e&&e.visitId&&<button className="text-link" onClick={()=>onVisit(e.visitId!)}>Карточка места и заметки <ArrowRight size={16}/></button>}</article>):<p>Отдельной записи за этот день нет. Перелёт 17–18 сентября описан в записи о прибытии.</p>}</div><h2>Пройденные маршруты</h2><div className="journal-routes">{routes.map((r:any)=><article key={r.id}><small>{dateLabel(r.date)} · {r.mode} · состоялось</small><h3>{r.title}</h3><p>{r.note}</p></article>)}</div></div>
  <aside><section className="journal-expenses"><Wallet size={24}/><h2>Фактические траты</h2><strong>{Object.entries(sums).map(([c,n])=>money(n,c)).join(' + ')||'Нет записей'}</strong><p>Только покупки из журнала за выбранные даты; это не весь бюджет поездки.</p>{expenses.map((e:any)=><div className="journal-expense" key={e.id}><span>{e.title}</span><b>{money(e.amount,e.currency)}</b></div>)}<p>Эти суммы также учтены во вкладке «Бюджет». Снятие наличных не включено.</p></section><section className="journal-pending"><h2>Ещё впереди и на уточнении</h2>{execution.pending.map((p:string)=><p key={p}>{p}</p>)}</section></aside></div>
 </section>
}
