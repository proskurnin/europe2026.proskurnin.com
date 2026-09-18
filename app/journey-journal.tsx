'use client';
import {useState} from 'react';
import {Check,ArrowRight,MapPin,BookOpen,Wallet} from 'lucide-react';
import {Progress} from '@/components/ui/progress';

import {dateLabel,money,totals,type Trip} from '@/lib/trip';

export function JourneyProgress({plan,visits,onJournal}:{plan:Trip;visits:any[];onJournal:()=>void}){
 const execution=plan.execution;if(!execution)return null;
 const places=visits.filter(v=>v.category==='sight'&&!v.optional&&v.status!=='skip');
 const seen=places.filter(v=>v.status==='visited').length;
 const elapsed=plan.days.filter(d=>d.date<execution.asOfDate).length;
 const current=plan.days.findIndex(d=>d.date===execution.asOfDate)+1;
 return <section className="journey-progress" aria-label="Прогресс путешествия">
  <div className="journey-heading"><div><small>ПУТЕШЕСТВИЕ НАЧАЛОСЬ</small><h2><MapPin size={24}/>{execution.location} · день {current||'—'} из {plan.days.length}</h2><p>По записи от {dateLabel(execution.asOfDate)} · перелёт позади, первая прогулка состоялась.</p></div><button onClick={onJournal}><BookOpen size={18}/>Бортовой журнал<ArrowRight size={17}/></button></div>
  <div className="journey-meters"><div><div className="journey-meter-label"><span>Календарь поездки</span><b>{elapsed} из {plan.days.length} дней позади</b></div><Progress value={elapsed/Math.max(1,plan.days.length)*100} aria-label="Дни до даты последней записи"/><p>Текущий день ещё не завершён. Даты сами по себе не подтверждают посещения.</p></div><div><div className="journey-meter-label"><span>Места основного плана</span><b>{seen} из {places.length} посетили</b></div><Progress value={seen/Math.max(1,places.length)*100} aria-label="Посещённые места основного плана"/><p>По журналу и вашим отметкам. Необязательные и пропущенные места исключены.</p></div></div>
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
