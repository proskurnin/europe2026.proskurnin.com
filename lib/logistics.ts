import type {Trip} from './trip';

export type Mode='walk'|'taxi'|'metro'|'train'|'bus'|'ferry'|'flight'|'unknown';
export type Stop={id:string;title:string;city:string;query?:string;place?:string;visit?:string;mode?:Mode;note?:string;time?:string;leave?:string;location?:{lat:number;lng:number}};
export type Leg={id:string;from:Stop;to:Stop;mode:Mode;note?:string};
export const modes:Record<Mode,{label:string;icon:string;color:string}>={walk:{label:'Пешком',icon:'🚶',color:'#26734d'},taxi:{label:'Такси / минивэн',icon:'🚕',color:'#b86b09'},metro:{label:'Метро',icon:'Ⓜ',color:'#7654b0'},train:{label:'Поезд',icon:'🚆',color:'#4364ac'},bus:{label:'Автобус',icon:'🚌',color:'#ba4d69'},ferry:{label:'Паром / вапоретто',icon:'⛴',color:'#137f9a'},flight:{label:'Перелёт',icon:'✈',color:'#9a764c'},unknown:{label:'Уточнить',icon:'?',color:'#737373'}};
const p=(place:string,city:string,mode:Mode='walk',visit?:string):Stop=>({id:place,place,title:'',city,mode,visit:visit||place});
const q=(id:string,title:string,city:string,query:string,mode:Mode='walk',visit?:string,note?:string):Stop=>({id,title,city,query,mode,visit,note});
const gap=(id:string,title:string,city:string,visit?:string):Stop=>({id,title,city,visit,mode:'unknown',note:'Точный адрес пока не указан. Этот участок не прокладывается через условный центр города.'});
const dormagen=()=>q('dormagen-station','Вокзал Дормагена','dormagen','Dormagen Bahnhof, Germany','train');
const veniceStation=()=>q('venice-station','Venezia Santa Lucia','venice','Venezia Santa Lucia railway station, Venice, Italy','train');
const amsterdamStation=()=>q('amsterdam-station','Amsterdam Centraal','amsterdam','Amsterdam Centraal, Netherlands','train');
// Reviewed against the trip document. Modes on a stop describe the leg INTO it.
// Alternatives are explicit proposals, never silent geocoding of city-centre placeholders.
const days:Record<string,Stop[]>={
 '2026-09-17':[q('vko','Внуково · терминал A','moscow','Vnukovo Airport Terminal A, Moscow','taxi','main')],
 '2026-09-18':[p('evn','yerevan'),gap('stay','Stylish City Center Retreat','yerevan','rooftop'),q('breakfast','Tumanyan Shaurma · завтрак','yerevan','Tumanyan Shaurma, 32 Tumanyan Street, Yerevan','walk','event-4','Из вариантов завтрака выбран Tumanyan Shaurma; выбор можно изменить в плане.'),p('republic','yerevan'),q('lunch','Карас · обед','yerevan','Karas, 20 Mashtots Avenue, Yerevan','walk','event-6','Из вариантов обеда выбран Карас. При усталости переключите участок на такси.'),p('cascade','yerevan'),p('northern','yerevan'),q('dinner','Tavern Yerevan · ужин','yerevan','Tavern Yerevan, 5 Amiryan Street, Yerevan','walk','event-10','Выбран первый вариант ужина из плана.'),{...p('republic','yerevan','walk','event-9'),id:'fountains',title:'Площадь Республики · фонтаны'},gap('return-stay','Возвращение в апартаменты','yerevan')],
 '2026-09-19':[p('republic-metro','yerevan','walk','metro'),q('yeritasardakan','Метро «Еритасардакан»','yerevan','Yeritasardakan metro station Yerevan','metro','metro','Одна остановка в сторону «Барекамутюн», без пересадок.'),q('victory-entrance','Вход в парк Победы · Азатутян','yerevan','Victory Park Azatutyan Avenue Yerevan','taxi'),p('mother-armenia','yerevan'),{...p('gum','yerevan','taxi','event-3'),title:'Район ГУМа · обед, рынок и отдых',note:'Кафе выбрать рядом; вещи с собой. Без возврата к квартире.'},{...p('evn','yerevan','taxi'),note:'Выезд из района ГУМа в 18:30, к 19:30 в аэропорту. Пять пассажиров и детское кресло.'}],
 '2026-09-20':[p('mxp','milan'),{...p('centrale','milan','bus'),note:'Ночной шаттл: плановый выезд 02:40, сверить перевозчика и дату.',time:'02:40'},gap('stay','8th floor – Milano view · заселение','milan','event-3'),q('breakfast','Princi · поздний завтрак','milan','Princi, Piazza della Scala 10, Milano','walk','event-4','Для непрерывной прогулки выбран Princi у Ла Скала из двух вариантов плана.'),p('duomo','milan'),p('sorbillo','milan'),p('galleria','milan'),q('scala','Ла Скала','milan','Teatro alla Scala, Milano','walk','galleria'),q('brera','Квартал Брера','milan','Via Brera 28, Milano','walk','galleria'),q('sforza','Замок Сфорца','milan','Castello Sforzesco, Milano','walk','galleria'),p('sempione','milan'),gap('return-stay','Возвращение в апартаменты','milan')],
 '2026-09-21':[gap('stay','Выселение из апартаментов','milan','event-1'),p('centrale','milan','taxi'),veniceStation(),gap('bags','Venice Villa House / хранение рюкзаков · подтвердить','venice','event-3'),q('ferrovia','Причал Ferrovia','venice','Ferrovia ACTV, Venezia','walk','grand-canal'),q('san-marco-pier','Причал San Marco Vallaresso','venice','San Marco Vallaresso ACTV, Venezia','ferry','grand-canal','По плану нужен вапоретто №1 по Гранд-каналу. Если Google предложит другую линию, сверьте №1 в ACTV.'),p('san-marco','venice'),q('lunch',"Dal Moro’s · обед",'venice',"Dal Moro's Fresh Pasta To Go, Calle Casseleria 5324, Venezia",'walk','event-6','Вариант обеда из плана.'),p('doge','venice'),p('rialto','venice'),gap('return-stay','Ночёвка · бронь ещё подтвердить','venice')],
 '2026-09-22':[gap('stay','Выселение и хранение рюкзаков','venice','event-1'),p('cannaregio','venice'),gap('bags','Забрать рюкзаки','venice','event-3'),veniceStation(),p('bergamo-station','bergamo','train'),gap('bergamo-stay','FEEL – Palazzo Ortelli · заселение','bergamo','event-6')],
 '2026-09-23':[gap('stay','FEEL – Palazzo Ortelli','bergamo','event-1'),{...p('bgy','bergamo','taxi'),note:'Заказать минивэн заранее; в аэропорту к 05:40.'},q('cgn','Аэропорт Кёльн/Бонн','cologne','Cologne Bonn Airport, Germany','flight','event-4'),dormagen(),gap('home','Дом родственников','dormagen','event-6')],
 '2026-09-24':[dormagen(),{...p('remise','dusseldorf','train'),note:'По плану поезд до Düsseldorf Hbf и городской транспорт; Google уточняет пересадки.'},p('fortuna','dusseldorf','metro'),p('schumacher','dusseldorf'),{...dormagen(),id:'return-station'},gap('home','Дом родственников','dormagen')],
 '2026-09-25':[dormagen(),q('koln-hbf','Köln Hbf','cologne','Köln Hauptbahnhof, Germany','train'),p('cathedral','cologne'),p('chocolate','cologne'),gap('france','Выезд во Францию · вокзал / остановку выбрать','cologne')],
 '2026-09-26':[q('chessy','Marne-la-Vallée – Chessy','disneyland','Marne la Vallée Chessy station, France'),p('disney','disneyland'),q('village','Disney Village · ужин','disneyland','Disney Village, Chessy, France'),q('valdeurope','Val d’Europe · станция','disneyland',"Val d'Europe RER station, Serris, France",'train',undefined,'Ориентир района проживания; отель ещё не выбран.'),gap('stay','Отель возле Disneyland','disneyland','unconfirmed')],
 '2026-09-27':[gap('stay','Выселение из отеля','disneyland','event-1'),q('valdeurope','Val d’Europe · RER A','disneyland',"Val d'Europe RER station, Serris, France"),q('tuileries','Сад Тюильри','paris','Jardin des Tuileries, Paris','train','trocadero'),q('seine','Набережная Сены · Concorde','paris','Pont de la Concorde, Paris','walk','trocadero'),p('trocadero','paris','metro'),gap('departure','Вокзал выезда · по выбранному билету','paris','event-3')],
 '2026-09-28':[gap('home','Отдых и прогулка по Дормагену · свободный день','dormagen','event-1')],
 '2026-09-29':[dormagen(),amsterdamStation(),p('nemo','amsterdam'),q('lunch',"Stubbe’s Haring · обед",'amsterdam',"Stubbe's Haring, Amsterdam",'walk','event-3'),gap('cruise','Круиз по каналам · выбрать оператора и причал','amsterdam','canals'),gap('stay','Отель в Амстердаме','amsterdam')],
 '2026-09-30':[gap('stay','Отель в Амстердаме','amsterdam'),p('vondel','amsterdam'),gap('bags','Забрать рюкзаки из отеля','amsterdam','event-2'),amsterdamStation(),dormagen(),gap('home','Дом родственников','dormagen')],
 '2026-10-01':[gap('home','Сборы и отдых в Дормагене','dormagen','event-1'),gap('dinner','Прощальный ужин · город и ресторан выбрать','dormagen','event-2')],
 '2026-10-02':[dormagen(),q('cgn','Аэропорт Кёльн/Бонн','cologne','Cologne Bonn Airport, Germany','train','event-1'),p('saw','istanbul','flight'),q('sultanahmet','Султанахмет · район проживания','istanbul','Sultanahmet Square, Istanbul','taxi','event-3','Предложение: минивэн на пятерых до района; точный адрес отеля уточняется.'),gap('stay','Отель в Стамбуле','istanbul')],
 '2026-10-03':[gap('stay','Отель в Стамбуле','istanbul'),p('hagia','istanbul'),q('blue-mosque','Голубая мечеть','istanbul','Sultan Ahmed Mosque, Istanbul','walk','hagia'),p('galata','istanbul'),q('eminonu-pier','Причал Эминёню','istanbul','Eminönü Kadıköy ferry pier, Istanbul','walk','eminonu'),q('kadikoy','Причал Кадыкёй','istanbul','Kadıköy Şehir Hatları ferry pier, Istanbul','ferry','eminonu'),gap('return-stay','Возвращение · согласовать после прогулки','istanbul')],
 '2026-10-04':[gap('stay','Отель в Стамбуле','istanbul'),p('baklava','istanbul'),gap('airport','Аэропорт вылета в Москву · рейс не выбран','istanbul','unconfirmed')],
};

export function itinerary(plan:Trip,date:string,visits=plan.visits):{stops:Stop[];legs:Leg[]}{
 const seenVisits=new Set<string>();
 const stops=(days[date]||[]).filter(s=>!s.visit||visits.find(v=>v.id===`visit-${date}-${s.visit}`)?.status!=='skip').map(s=>{
  const place=plan.places.find(p=>p.id===s.place),v=visits.find(v=>v.id===`visit-${date}-${s.visit}`);
  const first=v&&!seenVisits.has(v.id);if(v)seenVisits.add(v.id);
  return {...s,visit:v?s.visit:undefined,title:s.place==='galleria'?'Галерея Виктора Эммануила II':s.place==='trocadero'?'Площадь Трокадеро':s.title||place?.title||s.place||'',time:s.time||(first?v?.start:undefined),leave:v?.end||v?.start,location:place?{lat:place.lat,lng:place.lng}:undefined};
 });
 const legs=stops.slice(1).map((to,i)=>({id:`${date}:${stops[i].id}:${to.id}`,from:stops[i],to,mode:(!to.query&&!to.location)||(!stops[i].query&&!stops[i].location)?'unknown' as Mode:to.mode||'walk',note:to.note}));
 return {stops,legs};
}
export function mapsLink(leg:Leg,mode=leg.mode){
 const endpoint=(s:Stop)=>s.query||(s.location?`${s.location.lat},${s.location.lng}`:s.title);
 const params=new URLSearchParams({api:'1',origin:endpoint(leg.from),destination:endpoint(leg.to),travelmode:mode==='walk'?'walking':mode==='taxi'?'driving':'transit'});
 return 'https://www.google.com/maps/dir/?'+params;
}
export function transitDate(date:string,time:string|undefined,city:string,now=Date.now()){
 const offset=city==='yerevan'?'+04:00':city==='moscow'||city==='istanbul'?'+03:00':'+02:00';
 const scheduled=new Date(`${date}T${time||'10:00'}:00${offset}`);
 const available=scheduled.getTime()>=now-6*86400000&&scheduled.getTime()<=now+99*86400000;
 return {date:available?scheduled:new Date(now),current:!available};
}
