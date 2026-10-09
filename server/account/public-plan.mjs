// Public route data excludes the private budget, checklist and original document.
const financial=/(?:\d[\d\s.,–—-]*\s*(?:€|₽|\$|AMD|EUR|RUB|TRY|USD|руб)|[€₽$]\s*\d|стоимость|цена\s|средний чек)/iu;
const description=text=>typeof text==='string'?text.split(/(?<=[.!?])\s+|\n+/u).filter(part=>!financial.test(part)).join(' '):text;
export function publicPlan(plan){
 return {...plan,execution:plan.execution?{asOfDate:plan.execution.asOfDate,location:plan.execution.location}:undefined,sourceDocument:'',sourceTabs:[],expenses:[],checks:[],issues:[],
  days:plan.days.map(({sourceText,...day})=>({...day,sourceText:'',story:description(day.story),night:description(day.night)})),
  visits:plan.visits.map(({source,...visit})=>({...visit,description:description(visit.description),source:''}))};
}

// Targeted itinerary update also applied to the existing private server plan.
const routeUpdate = {
  "id": "yerevan-2026-09-19-metro-aznavour-cafe-v3",
  "dayId": "day-2026-09-19",
  "day": {
    "title": "Ереван: метро, «Мать Армения» и площадь Азнавура → Милан",
    "story": "Метро → «Мать Армения» → площадь Шарля Азнавура → обед и отдых в центре (кафе выберем на месте) → аэропорт. Рюкзаки весь день с собой, квартира не продлена. К парку и обратно в центр — на такси. Площадь и кафе — одна компактная остановка без дополнительных экскурсий. Выезд в аэропорт в 18:30, прибытие к 19:30, вылет в 22:35.",
    "sourceText": "Метро → «Мать Армения» → площадь Шарля Азнавура → обед и отдых в центре (кафе выберем на месте) → аэропорт. Рюкзаки весь день с собой, квартира не продлена. К парку и обратно в центр — на такси. Площадь и кафе — одна компактная остановка без дополнительных экскурсий. Выезд в аэропорт в 18:30, прибытие к 19:30, вылет в 22:35.\n«Площадь Республики» → «Еритасардакан»: одна остановка в сторону «Барекамутюн», без пересадок. Рюкзаки с собой; у сотрудника уточнить оплату для всей семьи.\nОт «Еритасардакан» — такси ко входу в парк Победы со стороны проспекта Азатутян, затем короткая прогулка к памятнику. Осмотр, панорама и отдых — 45–60 минут. Без подъёма через Каскад.\nИз парка Победы — на такси к площади перед кинотеатром «Москва». Короткая прогулка и фотографии: 15–20 минут. Затем обед и отдых рядом: кафе выберем на месте, без дополнительных экскурсий.\nКафе ещё не выбрано. Dalan, Абовяна, 12 — один из вариантов для обеда и отдыха, посещение необязательно. Выбираем на месте по свободным столикам и удобству с рюкзаками. К 18:00 проверить паспорта, пять посадочных и заряд телефонов; заказать машину на пять пассажиров с детским креслом.\n18:30–19:30: выезд от выбранного кафе в центре или ближайшей удобной точки посадки. На дорогу 40–60 минут с запасом на пробки. Машина на пять пассажиров с детским креслом. Цель — быть в аэропорту к 19:30.\nС 19:30 — необходимые формальности, досмотр и ожидание. Вылет в Милан-Мальпенса по билету в 22:35. Онлайн-регистрацию и пять посадочных проверить заранее; статус и выход — по табло.",
    "routeLinks": [
      {
        "text": "1. К метро «Площадь Республики»",
        "url": "https://www.google.com/maps/dir/?api=1&origin=Amiryan+4%2F2+Yerevan&destination=Republic+Square+metro+station+Yerevan&travelmode=walking"
      },
      {
        "text": "2. Метро: одна остановка",
        "url": "https://www.google.com/maps/dir/?api=1&origin=Republic+Square+metro+station+Yerevan&destination=Yeritasardakan+metro+station+Yerevan&travelmode=transit"
      },
      {
        "text": "3. К парку Победы",
        "url": "https://www.google.com/maps/dir/?api=1&origin=Yeritasardakan+metro+station+Yerevan&destination=Victory+Park+Azatutyan+Avenue+Yerevan&travelmode=driving"
      },
      {
        "text": "4. К площади Шарля Азнавура",
        "url": "https://www.google.com/maps/dir/?api=1&origin=Victory%20Park%20Azatutyan%20Avenue%20Yerevan&destination=Charles%20Aznavour%20Square%20Yerevan&travelmode=driving"
      },
      {
        "text": "5. Dalan — возможный вариант кафе",
        "url": "https://www.google.com/maps/dir/?api=1&origin=Charles%20Aznavour%20Square%20Yerevan&destination=Dalan%20Abovyan%2012%20Yerevan&travelmode=walking"
      },
      {
        "text": "6. В аэропорт из центра (точку посадки уточнить)",
        "url": "https://www.google.com/maps/dir/?api=1&origin=Charles%20Aznavour%20Square%20Yerevan&destination=Zvartnots%20International%20Airport&travelmode=driving"
      }
    ]
  },
  "places": [
    {
      "id": "republic-metro",
      "title": "Метро «Площадь Республики»",
      "city": "yerevan",
      "category": "station",
      "lat": 40.1786,
      "lng": 44.5153,
      "precision": "Ориентир на карте; вход уточняйте по адресу",
      "photo": null
    },
    {
      "id": "mother-armenia",
      "title": "Мать Армения",
      "city": "yerevan",
      "category": "sight",
      "lat": 40.1951,
      "lng": 44.5247,
      "precision": "Ориентир на карте; вход уточняйте по адресу",
      "photo": null
    },
    {
      "id": "aznavour-square",
      "title": "Площадь Шарля Азнавура",
      "city": "yerevan",
      "category": "sight",
      "lat": 40.1815,
      "lng": 44.5163,
      "precision": "Ориентир на карте; площадь перед кинотеатром «Москва»",
      "photo": null
    },
    {
      "id": "dalan",
      "title": "Dalan · Абовяна, 12",
      "city": "yerevan",
      "category": "food",
      "lat": 40.1808,
      "lng": 44.5156,
      "precision": "Приблизительный ориентир; вход по адресу Абовяна, 12",
      "photo": null
    }
  ],
  "visits": [
    {
      "dayId": "day-2026-09-19",
      "start": null,
      "end": null,
      "status": "planned",
      "optional": false,
      "source": "Согласованный маршрут в чате · 19.09.2026",
      "links": [],
      "id": "visit-2026-09-19-metro",
      "placeId": "republic-metro",
      "title": "Ереванское метро",
      "category": "station",
      "description": "«Площадь Республики» → «Еритасардакан»: одна остановка в сторону «Барекамутюн», без пересадок. Рюкзаки с собой; у сотрудника уточнить оплату для всей семьи."
    },
    {
      "dayId": "day-2026-09-19",
      "start": null,
      "end": null,
      "status": "planned",
      "optional": false,
      "source": "Согласованный маршрут в чате · 19.09.2026",
      "links": [],
      "id": "visit-2026-09-19-mother-armenia",
      "placeId": "mother-armenia",
      "title": "«Мать Армения» · парк Победы",
      "category": "sight",
      "description": "От «Еритасардакан» — такси ко входу в парк Победы со стороны проспекта Азатутян, затем короткая прогулка к памятнику. Осмотр, панорама и отдых — 45–60 минут. Без подъёма через Каскад."
    },
    {
      "dayId": "day-2026-09-19",
      "start": null,
      "end": null,
      "status": "planned",
      "optional": false,
      "source": "Согласованный маршрут в чате · 19.09.2026",
      "links": [],
      "id": "visit-2026-09-19-aznavour",
      "placeId": "aznavour-square",
      "title": "Площадь Шарля Азнавура",
      "category": "sight",
      "description": "Из парка Победы — на такси к площади перед кинотеатром «Москва». Короткая прогулка и фотографии: 15–20 минут. Затем обед и отдых рядом: кафе выберем на месте, без дополнительных экскурсий."
    },
    {
      "dayId": "day-2026-09-19",
      "start": null,
      "end": null,
      "status": "planned",
      "optional": true,
      "source": "Согласованный маршрут в чате · 19.09.2026",
      "links": [
        {
          "text": "Сайт Dalan",
          "url": "https://dalan.am/"
        }
      ],
      "id": "visit-2026-09-19-dalan",
      "placeId": "dalan",
      "title": "Dalan — возможный вариант кафе",
      "category": "food",
      "description": "Кафе ещё не выбрано. Dalan, Абовяна, 12 — один из вариантов для обеда и отдыха, посещение необязательно. Выбираем на месте по свободным столикам и удобству с рюкзаками. К 18:00 проверить паспорта, пять посадочных и заряд телефонов; заказать машину на пять пассажиров с детским креслом."
    },
    {
      "dayId": "day-2026-09-19",
      "start": "18:30",
      "end": "19:30",
      "status": "planned",
      "optional": false,
      "source": "Согласованный маршрут в чате · 19.09.2026",
      "links": [],
      "id": "visit-2026-09-19-evn",
      "placeId": "evn",
      "title": "Такси из центра в Звартноц",
      "category": "airport",
      "description": "18:30–19:30: выезд от выбранного кафе в центре или ближайшей удобной точки посадки. На дорогу 40–60 минут с запасом на пробки. Машина на пять пассажиров с детским креслом. Цель — быть в аэропорту к 19:30."
    },
    {
      "dayId": "day-2026-09-19",
      "start": "19:30",
      "end": "22:35",
      "status": "planned",
      "optional": false,
      "source": "Согласованный маршрут в чате · 19.09.2026",
      "links": [],
      "id": "visit-2026-09-19-event-7",
      "placeId": "evn",
      "title": "Вылет W4 6456 в Милан · 22:35",
      "category": "airport",
      "description": "С 19:30 — необходимые формальности, досмотр и ожидание. Вылет в Милан-Мальпенса по билету в 22:35. Онлайн-регистрацию и пять посадочных проверить заранее; статус и выход — по табло."
    }
  ]
};
function applyYerevanUpdate(plan) {
 if (!plan?.days?.some(d=>d.id===routeUpdate.dayId) || plan.appliedRouteUpdates?.includes(routeUpdate.id)) return plan;
 const next=structuredClone(plan);
 Object.assign(next.days.find(d=>d.id===routeUpdate.dayId),routeUpdate.day);
 for (const place of routeUpdate.places) if (!next.places.some(p=>p.id===place.id)) next.places.push(structuredClone(place));
 const first=next.visits.findIndex(v=>v.dayId===routeUpdate.dayId);
 const before=next.visits.filter(v=>v.dayId!==routeUpdate.dayId);
 before.splice(first<0?before.length:first,0,...structuredClone(routeUpdate.visits));
 next.visits=before;
 next.appliedRouteUpdates=[...(next.appliedRouteUpdates||[]),routeUpdate.id];
 next.version=next.version+'+'+routeUpdate.id;
 return next;
}

// September 29 decision: two days at the family base, then an optional day trip.
function applySeptember29Update(plan) {
 const next=structuredClone(applyYerevanUpdate(plan));
 const id='dormagen-amsterdam-daytrip-2026-09-29';
 if(next.appliedRouteUpdates?.includes(id)) return next;
 const dates=['2026-09-28','2026-09-29','2026-09-30'];
 if(!dates.every(date=>next.days.some(d=>d.date===date))) return next;
 const map=(text,query)=>({text,url:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query)});
 const walking={text:'Маршрут дня пешком',url:'https://www.google.com/maps/dir/?api=1&origin=Amsterdam+Centraal&destination=Amsterdam+Centraal&waypoints=NEMO+Science+Museum+Oosterdok+2+Amsterdam%7CStromma+Prins+Hendrikkade+37+Amsterdam&travelmode=walking'};
 const station=map('Amsterdam Centraal · Stationsplein, Amsterdam','Amsterdam Centraal Stationsplein');
 const visits=[];
 const add=(date,key,placeId,title,start,end,category,description,links=[])=>visits.push({id:key,dayId:'day-'+date,placeId,title,start,end,category,description,links,status:'planned',optional:date==='2026-09-30',source:'Уточнение маршрута 29.09.2026; часы — плановые ориентиры'});
 for(const date of dates.slice(0,2)) {
  const day=next.days.find(d=>d.date===date);
  const story=date==='2026-09-28'?'День проведён в Дормагене. Отдых и время с семьёй, без выездной программы.':'День в Дормагене: отдых и время с семьёй. Междугородних поездок сегодня нет.';
  Object.assign(day,{title:'Дормаген · отдых с семьёй',city:'dormagen',country:'Германия',night:'У родственников · Дормаген',story,sourceText:story,routeLinks:[]});
  add(date,'visit-'+date+'-rest','city-dormagen','Отдых в Дормагене',null,null,'rest',story);
 }
 add('2026-09-30','visit-2026-09-29-event-1','city-amsterdam','Ранний поезд в Амстердам · рейс ещё не выбран','06:00','11:00','station','Плановое окно: отправление из Dormagen 06:00–07:00, прибытие Amsterdam Centraal около 10:00–11:00. Региональный поезд до Düsseldorf Hbf, затем прямой ICE. Ориентир 3–4 часа между станциями; на пересадку 30–45 минут. Путь от дома до Dormagen Bahnhof добавить отдельно. Это не подтверждённое расписание. Сначала выбрать оба поезда, проверить обратную пересадку и купить места вместе.',[map('Dormagen Bahnhof · Willy-Brandt-Platz, 41539 Dormagen','Dormagen Bahnhof Willy-Brandt-Platz'),map('Düsseldorf Hbf · Konrad-Adenauer-Platz 14','Dusseldorf Hbf Konrad-Adenauer-Platz 14'),station,{text:'Выбрать поезда DB',url:'https://www.bahn.de/'}]);
 add('2026-09-30','visit-2026-09-29-nemo','nemo','Музей науки NEMO','12:00','14:30','sight','Oosterdok 2, 1011 VX Amsterdam. От Centraal пешком 20–25 минут. Временной слот покупать после поездов, оставив минимум час после прибытия. Время посещения предварительное; стоимость и наличие проверить при покупке.',[map('NEMO · Oosterdok 2','NEMO Science Museum Oosterdok 2 Amsterdam'),{text:'NEMO: билеты',url:'https://www.nemosciencemuseum.nl/en/plan-your-visit'}]);
 add('2026-09-30','visit-2026-09-29-event-3','city-amsterdam','Обед и отдых','14:30','15:30','food','Обед возле NEMO или по пути к причалу. Кафе выбрать на месте. Далее 20–30 минут пешком к Stromma у центрального вокзала.');
 add('2026-09-30','visit-2026-09-29-canals','canals','Круиз по каналам · предварительно','16:00','17:15','sight','Stromma Central Station Bridge, Prins Hendrikkade 37, Amsterdam. Круговой круиз 60–75 минут с возвращением к тому же причалу. Точный причал и отправление сверить в билете. Завершить минимум за час до обратного поезда.',[map('Причал · Prins Hendrikkade 37','Stromma Prins Hendrikkade 37 Amsterdam'),{text:'Stromma: причалы',url:'https://www.stromma.com/en-nl/amsterdam/customer-service/ticket-shops-departure-points/central-station/'}]);
 add('2026-09-30','visit-2026-09-30-event-3','city-amsterdam','Вечерний поезд обратно в Дормаген','18:00','23:30','station','Плановое отправление Amsterdam Centraal 18:00–19:00, через Düsseldorf Hbf в Dormagen. Дома ориентировочно 21:30–23:30. Быть на вокзале за 30 минут. Конкретные рейсы, цена и последняя региональная пересадка пока не подтверждены; нужен запасной вариант. При задержке сократить прогулку, а не запас до поезда.',[station,{text:'Расписание DB',url:'https://www.bahn.de/'}]);
 const day=next.days.find(d=>d.date==='2026-09-30');
 const story='Предварительно: Амстердам одним днём, NEMO и круиз по каналам. Ранний поезд туда, вечерний обратно. Без ночёвки, Вондельпарка и дополнительных музеев. Всего около 3–4 км пешком. Основные вещи оставить в Дормагене; взять документы, воду, перекус и защиту от дождя. Состав участников уточнить перед покупкой. Если неудобные поезда или мало сил — остаться в Дормагене. Все часы — ориентиры, билеты ещё не подтверждены.';
 Object.assign(day,{title:'Амстердам одним днём · предварительно',city:'amsterdam',country:'Нидерланды',night:'У родственников · Дормаген',story,sourceText:story+'\n'+visits.filter(v=>v.dayId===day.id).map(v=>v.description).join('\n'),routeLinks:[walking,{text:'Dormagen → Düsseldorf → Amsterdam',url:'https://www.google.com/maps/dir/?api=1&origin=Dormagen+Bahnhof&destination=Amsterdam+Centraal&travelmode=transit'}]});
 const first=next.visits.findIndex(v=>dates.some(d=>v.dayId==='day-'+d));
 next.visits=next.visits.filter(v=>!dates.some(d=>v.dayId==='day-'+d));
 next.visits.splice(first<0?next.visits.length:first,0,...visits);
 next.checks=(next.checks||[]).map(c=>c.id==='check-8'?{...c,text:'Амстердам 30.09 — предварительно одним днём. Подтвердить состав, купить поезда туда и обратно с местами рядом и запасом на пересадку; затем слот NEMO и круговой круиз. Отель и хранение вещей после выселения не нужны.'}:c);
 next.expenses=(next.expenses||[]).filter(e=>e.id!=='unknown-ams-hotel');
 next.appliedRouteUpdates=[...(next.appliedRouteUpdates||[]),id];
 next.version=next.version+'+'+id;
 return next;
}


// Confirmed September 30: stay in Germany; replace the tentative Netherlands trip.
function applySeptember30Update(plan) {
 const next=structuredClone(applySeptember29Update(plan));
 const id='germany-neuss-2026-09-30';
 if(next.appliedRouteUpdates?.includes(id)) return next;
 if(!next.days.some(d=>d.date==='2026-09-30')) return next;
 const map=(text,query)=>({text,url:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query)});
 const route=(text,from,to,mode='walking',via=[])=>({text,url:'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(from)+'&destination='+encodeURIComponent(to)+'&travelmode='+mode+(via.length?'&waypoints='+encodeURIComponent(via.join('|')):'')});
 const oldPlaces=new Set(next.places.filter(p=>p.city==='amsterdam').map(p=>p.id));
 next.visits=next.visits.filter(v=>!oldPlaces.has(v.placeId)&&!['day-2026-09-29','day-2026-09-30'].includes(v.dayId));
 next.places=next.places.filter(p=>p.city!=='amsterdam');
 delete next.cities.amsterdam;
 next.cities.neuss=['Нойс',51.1984,6.6919,'Europe/Berlin'];
 next.places.push({id:'city-neuss',title:'Нойс',lat:51.1984,lng:6.6919,city:'neuss',category:'city',precision:'Центр города; точные адреса остановок указаны в маршруте',photo:null});
 next.transfers=next.transfers.filter(t=>t.from!=='amsterdam'&&t.to!=='amsterdam');
 const nl=/Амстердам|Нидерланд|Amsterdam|NEMO|Stromma|Вондельпарк/i;
 next.checks=next.checks.filter(c=>!nl.test(c.text));
 next.issues=next.issues.filter(t=>!nl.test(t));
 next.expenses=next.expenses.filter(e=>e.status==='paid'||!nl.test(JSON.stringify(e)));
 const add=(date,key,title,category,description,links=[],optional=false,status='planned')=>next.visits.push({id:'visit-'+date+'-'+key,dayId:'day-'+date,placeId:date==='2026-09-29'?'city-dormagen':'city-neuss',title,start:null,end:null,category,description,links,status,optional,source:'Уточнение пользователя 30.09.2026; время в пути ориентировочное'});
 const yesterday=next.days.find(d=>d.date==='2026-09-29');
 const fact='Весь день провели в Дормагене, сходили в магазин. Междугородних поездок не было. Название магазина не указано.';
 if(yesterday)Object.assign(yesterday,{title:'Дормаген · день в городе и магазин',city:'dormagen',country:'Германия',night:'У родственников · Дормаген',story:fact,sourceText:fact,routeLinks:[]});
 add('2026-09-29','rest','День в Дормагене и поход в магазин','rest',fact,[],false,'visited');
 const out=route('Дормаген → Нойс · поезд','Dormagen Bahnhof','Neuss Hbf','transit');
 const walk=route('Прогулка: вокзал → центр → Обертор','Neuss Hbf','Obertor Neuss','walking',['Buechel Neuss','Quirinus Muenster Muensterplatz 23 Neuss','Markt Neuss']);
 const backWalk=route('Возвращение пешком к вокзалу','Obertor Neuss','Neuss Hbf');
 const back=route('Нойс → Дормаген · поезд','Neuss Hbf','Dormagen Bahnhof','transit');
 add('2026-09-30','out','Поезд Дормаген → Нойс','station','От Dormagen Bahnhof (Willy-Brandt-Platz, 41539 Dormagen) до Neuss Hbf (Further Straße 1, 41462 Neuss). Выбрать прямой региональный поезд или S-Bahn в DB Navigator: ориентир 11–25 минут между вокзалами; ещё 10–20 минут на ожидание и подход к платформе. Дорога от дома до станции отдельно. Час выезда свободный, конкретный рейс не выбран. Билет купить до посадки; цену для фактического состава группы проверить в приложении.',[out,{text:'Расписание DB',url:'https://www.bahn.de/'}]);
 add('2026-09-30','center','Центральная улица: Niederstraße → Büchel','sight','От Neuss Hbf около 15–20 минут пешком к пешеходному центру. Адреса: Niederstraße и Büchel, 41460 Neuss. Спокойная прогулка, витрины и остановки по желанию, без обязательных магазинов.',[map('Niederstraße · центр Нойса','Niederstrasse Neuss'),map('Büchel · пешеходная улица','Buechel Neuss')]);
 add('2026-09-30','minster','Старый город: Квиринусмюнстер и Markt','sight','Quirinus-Münster: Münsterplatz 23, 41460 Neuss. Осмотреть собор и площадь снаружи; зайти внутрь только если открыт и нет ограничений из-за службы. Затем Markt, 41460 Neuss — площадь у ратуши. Между точками 5–10 минут пешком; на осмотр и отдых около 45–60 минут.',[map('Собор · Münsterplatz 23','Quirinus Muenster Muensterplatz 23 Neuss'),map('Рыночная площадь · Markt','Markt Neuss')]);
 add('2026-09-30','lunch','Обед или кофе в центре','food','Около Markt или Neustraße, 41460 Neuss. Выбрать кафе на месте по свободным столикам и меню. Заложить 45–60 минут, без предварительного бронирования.',[map('Neustraße · кафе и прогулка','Neustrasse Neuss')]);
 add('2026-09-30','obertor','Обертор · по желанию','sight','Obertor, Am Obertor, 41460 Neuss. От Markt по Oberstraße около 10–15 минут пешком. Средневековые городские ворота, осмотр снаружи 10–15 минут. Если устали, пропустить и вернуться к вокзалу прямо из центра.',[map('Обертор · Am Obertor','Obertor Am Obertor Neuss')],true);
 add('2026-09-30','return','Возвращение в Дормаген','station','От Obertor до Neuss Hbf около 25–35 минут пешком, от Markt около 15–20 минут. Затем прямой поезд до Dormagen Bahnhof: ориентир 11–25 минут плюс ожидание. Вечер и ночёвка в Дормагене; время возвращения выбираем по самочувствию. Расписание и платформу проверить перед отправлением.',[backWalk,back]);
 const story='Нойс одним днём из Дормагена: центральная пешеходная улица, старый город, Квиринусмюнстер и Markt. Обертор — дополнительная остановка по силам. На прогулку с обедом 3–4 часа, около 3–4 км пешком с возвращением на вокзал. Без жёсткого раннего выезда. Вечером обратно в Дормаген. До завершения европейской части поездки остаёмся в Германии.';
 const day=next.days.find(d=>d.date==='2026-09-30');
 Object.assign(day,{title:'Нойс · прогулка по центру и старому городу',city:'neuss',country:'Германия',night:'У родственников · Дормаген',story,sourceText:story+'\n'+next.visits.filter(v=>v.dayId===day.id).map(v=>v.description).join('\n'),routeLinks:[walk,out,backWalk,back]});
 next.visits=next.visits.map(v=>({...v,description:v.description.replace('Переезды во Францию и Нидерланды не являются вывозом из ЕС.','Переезд во Францию не является вывозом из ЕС.')}));
 next.checks.push({id:'check-neuss-20260930',text:'30.09: перед выездом проверить прямой поезд Dormagen ↔ Neuss и билеты на фактический состав группы. Прогулка без обязательных платных посещений.'});
 next.appliedRouteUpdates=[...(next.appliedRouteUpdates||[]),id];
 next.version+='+'+id;
 return next;
}

// October 1 is conditional on dry weather; flight preparation remains mandatory.
export function applyRouteUpdates(plan) {
 const next=structuredClone(applySeptember30Update(plan));
 const id='zons-weather-option-2026-10-01';
 if(next.appliedRouteUpdates?.includes(id))return next;
 const day=next.days.find(d=>d.date==='2026-10-01');
 if(!day)return next;
 const map=(text,query)=>({text,url:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query)});
 const route=(text,from,to,mode='walking',via=[])=>({text,url:'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(from)+'&destination='+encodeURIComponent(to)+'&travelmode='+mode+(via.length?'&waypoints='+encodeURIComponent(via.join('|')):'')});
 const zons={id:'zons-old-town',title:'Цонз · старый город',city:'dormagen',lat:51.1227,lng:6.8503,category:'sight',precision:'Ориентир старого города; входы и остановки уточняются по адресам маршрута',photo:null};
 if(!next.places.some(p=>p.id===zons.id))next.places.push(zons);
 const walk=route('Цонз · прогулка по старому городу и к Рейну','Rheintor Zons','Rheintor Zons','walking',['Tourist Information Schlossstrasse 2-4 Zons','Schloss Friedestrom Zons','Rheinufer Zons']);
 const out=route('Dormagen Bahnhof → Zons · автобус','Dormagen Bahnhof','Zons Schlossstrasse','transit');
 const back=route('Zons → Dormagen Bahnhof · автобус','Zons Schlossstrasse','Dormagen Bahnhof','transit');
 const source='Уточнение пользователя 30.09.2026: ехать утром 01.10 только при отсутствии дождя; часы — ориентиры';
 const v=(key,title,start,end,category,description,links)=>({id:'visit-2026-10-01-'+key,dayId:day.id,placeId:zons.id,title,start,end,category,description,links,status:'planned',optional:true,source});
 const additions=[
  v('zons-out','Цонз при сухой погоде · выезд утром','10:00','10:45','station','Утром проверить почасовой прогноз и дождь на месте. Если сухо — выезд ориентировочно после 10:00; при дожде всю прогулку отменяем. Прямой городской автобус 886 идёт от Dormagen Bahnhof через Zons. Ориентир на дорогу между вокзалом и Zons 15–25 минут, на ожидание и подход 15–20 минут; путь от дома до остановки добавить отдельно. Конкретный рейс и ближайшую остановку выхода проверить в VRR или Stadtbus перед выездом. Оплату/действительность имеющегося билета проверить до посадки; бесплатный проезд в Москве не означает бесплатный проезд в Германии. Альтернатива — машина с родственниками, если договоритесь.',[out,map('Dormagen Bahnhof · Willy-Brandt-Platz, 41539 Dormagen','Dormagen Bahnhof Willy-Brandt-Platz'),{text:'Stadtbus · действующие расписания',url:'https://stadtbus-dormagen.de/de/fahrplaene'}]),
  v('zons-walk','Цонз · старый город и берег Рейна','10:45','12:30','sight','Спокойная прогулка: Rheintor (Rheinstraße, 41541 Dormagen-Zons) → Schloßstraße → Tourist-Info (Schloßstraße 2–4) → Schloss Friedestrom (Schloßstraße 1) → берег Рейна → Rheintor. Осматриваем улицы, ворота и крепость снаружи; платные музеи, экскурсии и подъём на башню не обязательны. Ориентир 1,5–2 часа и 2–3 км пешком с паузами. К воде выходим только при сухой погоде и удобном проходе; при начавшемся дожде сокращаем прогулку.',[walk,map('Rheintor · Rheinstraße, Zons','Rheintor Zons'),map('Tourist-Info · Schloßstraße 2–4','Tourist Information Schlossstrasse 2-4 Zons'),map('Schloss Friedestrom · Schloßstraße 1','Schloss Friedestrom Schlossstrasse 1 Zons'),map('Берег Рейна · Zons','Rheinufer Zons'),{text:'Цонз · официальный путеводитель',url:'https://www.dormagen.de/tourismus-freizeit/stadtportraet/stadtteile/zons/'}]),
  v('zons-lunch','Кофе или обед в Цонзе · по желанию','12:30','13:15','food','Выбрать кафе на Schloßstraße или Rheinstraße по свободным столикам и меню. Заложить 30–45 минут. Можно вместо этого пообедать дома; конкретное заведение не забронировано.',[map('Кафе · Schloßstraße / Rheinstraße, Zons','Restaurants Schlossstrasse Zons')]),
  v('zons-return','Возвращение в Дормаген','13:15','14:15','station','Вернуться к выбранной остановке Zons; автобус 886 в направлении Dormagen Bahnhof. Ориентир 15–25 минут в автобусе плюс ожидание и дорога домой. Конкретный рейс сверить перед выходом из кафе. Вторая половина дня и ночёвка в Дормагене, без обязательного выезда в Кёльн или Дюссельдорф.',[back])
 ];
 const prep=next.visits.find(v=>v.id==='visit-2026-10-01-event-1');
 if(prep)Object.assign(prep,{start:'15:00',end:'17:30',description:prep.description.replace('10:00 – 14:00:','15:00–17:30 (или утром, если Цонз отменён):').replace('При необходимости — резервный визит в Apple Schildergasse или Düsseldorf во время поездки на прощальный ужин, после проверки наличия.','Дополнительные поездки за покупками сегодня не обязательны: оставить запас времени на сборы и отдых.')});
 const dinner=next.visits.find(v=>v.id==='visit-2026-10-01-event-2');
 if(dinner)Object.assign(dinner,{title:'Прощальный ужин и отдых в Дормагене',start:'18:00',end:'20:00',description:'Спокойный ужин в Дормагене с родными. Место выбираем на месте; обязательной поездки в Кёльн или Дюссельдорф нет. Затем отдых перед вылетом 2 октября.'});
 next.visits=next.visits.filter(v=>v.dayId!==day.id).concat(additions,[prep,dinner].filter(Boolean));
 const story='Утром Цонз, только если нет дождя: старый город, крепость снаружи и Рейн, кофе или обед по желанию. Ориентировочный выезд после 10:00, возвращение к 14:00–14:30. При дожде остаёмся в Дормагене. После прогулки — билеты Pegasus, посадочные, рюкзаки и Tax Free; вечером ужин с родными и отдых перед вылетом 2 октября. Часы не являются расписанием автобусов.';
 Object.assign(day,{title:'Дормаген → Цонз · если сухо',city:'dormagen',country:'Германия',night:'У родственников · Дормаген',story,sourceText:story+'\n'+next.visits.filter(v=>v.dayId===day.id).map(v=>v.description).join('\n'),routeLinks:[walk,out,back]});
 next.checks.push({id:'check-zons-20261001',text:'01.10: утром проверить дождь и расписание 886. Цонз — только при сухой погоде; сборы к вылету и проверку билетов выполнить в любом случае.'});
 next.appliedRouteUpdates=[...(next.appliedRouteUpdates||[]),id];
 next.version+='+'+id;
 return next;
}
