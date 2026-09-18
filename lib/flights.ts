export type Flight = {id:string;number:string;from:string;to:string;fromAirport:string;toAirport:string;fromCountry:string;toCountry:string;fromFlag:string;toFlag:string;fromZone:string;toZone:string;date:string;departure:string|null;arrival:string|null};
// Verified against the source Google Doc on 18 September 2026. All times include UTC offsets.
export const flights:Flight[]=[
 {id:'ut785',number:'UT 785',from:'Москва',to:'Ереван',fromAirport:'Внуково · VKO',toAirport:'Звартноц · EVN',fromCountry:'Россия',toCountry:'Армения',fromFlag:'🇷🇺',toFlag:'🇦🇲',fromZone:'Europe/Moscow',toZone:'Asia/Yerevan',date:'2026-09-17',departure:'2026-09-17T20:50:00+03:00',arrival:'2026-09-18T01:25:00+04:00'},
 {id:'w46456',number:'W4 6456',from:'Ереван',to:'Милан',fromAirport:'Звартноц · EVN',toAirport:'Мальпенса · MXP',fromCountry:'Армения',toCountry:'Италия',fromFlag:'🇦🇲',toFlag:'🇮🇹',fromZone:'Asia/Yerevan',toZone:'Europe/Rome',date:'2026-09-19',departure:'2026-09-19T22:35:00+04:00',arrival:'2026-09-20T01:10:00+02:00'},
 {id:'fr5551',number:'FR 5551',from:'Бергамо',to:'Кёльн',fromAirport:'Орио-аль-Серио · BGY',toAirport:'Кёльн/Бонн · CGN',fromCountry:'Италия',toCountry:'Германия',fromFlag:'🇮🇹',toFlag:'🇩🇪',fromZone:'Europe/Rome',toZone:'Europe/Berlin',date:'2026-09-23',departure:'2026-09-23T07:40:00+02:00',arrival:'2026-09-23T09:05:00+02:00'},
 {id:'pegasus',number:'PC 1012',from:'Кёльн',to:'Стамбул',fromAirport:'Кёльн/Бонн · CGN',toAirport:'Сабиха Гёкчен · SAW',fromCountry:'Германия',toCountry:'Турция',fromFlag:'🇩🇪',toFlag:'🇹🇷',fromZone:'Europe/Berlin',toZone:'Europe/Istanbul',date:'2026-10-02',departure:'2026-10-02T13:20:00+02:00',arrival:'2026-10-02T17:30:00+03:00'},
 {id:'return',number:'Рейс уточняется',from:'Стамбул',to:'Москва',fromAirport:'Аэропорт уточняется',toAirport:'Аэропорт уточняется',fromCountry:'Турция',toCountry:'Россия',fromFlag:'🇹🇷',toFlag:'🇷🇺',fromZone:'Europe/Istanbul',toZone:'Europe/Moscow',date:'2026-10-04',departure:null,arrival:null}
];
export function nextFlight(now:number,completed:string[]=[],schedule:Flight[]=flights){
 return [...schedule].sort((a,b)=>(a.departure||a.date).localeCompare(b.departure||b.date)).find(f=>!completed.includes(f.id)&&(f.departure?Date.parse(f.departure)>now:new Intl.DateTimeFormat('en-CA',{timeZone:f.fromZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now))<=f.date));
}
export function flightTime(value:string,zone:string){return new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',timeZone:zone}).format(new Date(value));}
