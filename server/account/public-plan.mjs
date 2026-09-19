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
  "id": "yerevan-2026-09-19-metro-gum-v1",
  "dayId": "day-2026-09-19",
  "day": {
    "title": "Ереван: метро, «Мать Армения» и ГУМ → Милан",
    "story": "Метро → «Мать Армения» → обед и рынок ГУМ → отдых → аэропорт. Квартира не продлена, рюкзаки весь день с собой. Без возвращения к квартире. Вернисаж, Каскад и Английский парк сегодня исключены. Подъём к парку — на такси. Выезд в аэропорт в 18:30, прибытие к 19:30, вылет в 22:35. Дневные пункты идут по порядку без жёстких часов.",
    "sourceText": "Метро → «Мать Армения» → обед и рынок ГУМ → отдых → аэропорт. Квартира не продлена, рюкзаки весь день с собой. Без возвращения к квартире. Вернисаж, Каскад и Английский парк сегодня исключены. Подъём к парку — на такси. Выезд в аэропорт в 18:30, прибытие к 19:30, вылет в 22:35. Дневные пункты идут по порядку без жёстких часов.\n«Площадь Республики» → «Еритасардакан»: одна остановка в сторону «Барекамутюн», без пересадок. Рюкзаки с собой; у сотрудника уточнить оплату для всей семьи.\nОт «Еритасардакан» — такси ко входу в парк Победы со стороны проспекта Азатутян, затем короткая прогулка к памятнику. Осмотр, панорама и отдых — 45–60 минут. Без подъёма через Каскад.\nИз парка — такси к рынку ГУМ, ул. Мовсеса Хоренаци, 35. Сначала спокойный обед и отдых в кафе поблизости. Заведение не забронировано; возможность посидеть подольше с рюкзаками уточнить до заказа.\nПосле обеда — 20–30 минут на сухофрукты, сладости и лаваш. Рюкзаки с собой. Посещение совмещено с обедом, без дополнительных прогулок.\nОстаток времени — сидячий отдых в том же районе. Квартира не продлена, возвращаться за вещами не нужно. К 18:00 проверить паспорта и пять посадочных, заряд телефонов; заказать машину на пять пассажиров с детским креслом. При усталости выехать раньше.\n18:30–19:30: выезд от фактического кафе или удобного входа у рынка ГУМ. На дорогу 40–60 минут с запасом на пробки. Машина на пять пассажиров. Цель — быть в аэропорту к 19:30.\nС 19:30 — необходимые формальности, досмотр и ожидание. Вылет в Милан-Мальпенса по билету в 22:35. Онлайн-регистрацию и пять посадочных проверить заранее; статус и выход — по табло.",
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
        "text": "4. К рынку ГУМ",
        "url": "https://www.google.com/maps/dir/?api=1&origin=Victory+Park+Azatutyan+Avenue+Yerevan&destination=GUM+Market+35+Movses+Khorenatsi+Yerevan&travelmode=driving"
      },
      {
        "text": "5. В аэропорт",
        "url": "https://www.google.com/maps/dir/?api=1&origin=GUM+Market+35+Movses+Khorenatsi+Yerevan&destination=Zvartnots+International+Airport&travelmode=driving"
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
    }
  ],
  "visits": [
    {
      "dayId": "day-2026-09-19",
      "start": null,
      "end": null,
      "status": "planned",
      "optional": false,
      "source": "Google Docs · согласованный маршрут 19.09.2026",
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
      "source": "Google Docs · согласованный маршрут 19.09.2026",
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
      "source": "Google Docs · согласованный маршрут 19.09.2026",
      "links": [],
      "id": "visit-2026-09-19-event-3",
      "placeId": "gum",
      "title": "Обед возле рынка ГУМ",
      "category": "food",
      "description": "Из парка — такси к рынку ГУМ, ул. Мовсеса Хоренаци, 35. Сначала спокойный обед и отдых в кафе поблизости. Заведение не забронировано; возможность посидеть подольше с рюкзаками уточнить до заказа."
    },
    {
      "dayId": "day-2026-09-19",
      "start": null,
      "end": null,
      "status": "planned",
      "optional": false,
      "source": "Google Docs · согласованный маршрут 19.09.2026",
      "links": [],
      "id": "visit-2026-09-19-gum",
      "placeId": "gum",
      "title": "Рынок ГУМ",
      "category": "sight",
      "description": "После обеда — 20–30 минут на сухофрукты, сладости и лаваш. Рюкзаки с собой. Посещение совмещено с обедом, без дополнительных прогулок."
    },
    {
      "dayId": "day-2026-09-19",
      "start": null,
      "end": null,
      "status": "planned",
      "optional": false,
      "source": "Google Docs · согласованный маршрут 19.09.2026",
      "links": [],
      "id": "visit-2026-09-19-gum-rest",
      "placeId": "gum",
      "title": "Отдых возле ГУМа до выезда",
      "category": "rest",
      "description": "Остаток времени — сидячий отдых в том же районе. Квартира не продлена, возвращаться за вещами не нужно. К 18:00 проверить паспорта и пять посадочных, заряд телефонов; заказать машину на пять пассажиров с детским креслом. При усталости выехать раньше."
    },
    {
      "dayId": "day-2026-09-19",
      "start": "18:30",
      "end": "19:30",
      "status": "planned",
      "optional": false,
      "source": "Google Docs · согласованный маршрут 19.09.2026",
      "links": [],
      "id": "visit-2026-09-19-evn",
      "placeId": "evn",
      "title": "Такси от ГУМа в Звартноц",
      "category": "airport",
      "description": "18:30–19:30: выезд от фактического кафе или удобного входа у рынка ГУМ. На дорогу 40–60 минут с запасом на пробки. Машина на пять пассажиров. Цель — быть в аэропорту к 19:30."
    },
    {
      "dayId": "day-2026-09-19",
      "start": "19:30",
      "end": "22:35",
      "status": "planned",
      "optional": false,
      "source": "Google Docs · согласованный маршрут 19.09.2026",
      "links": [],
      "id": "visit-2026-09-19-event-7",
      "placeId": "evn",
      "title": "Вылет W4 6456 в Милан · 22:35",
      "category": "airport",
      "description": "С 19:30 — необходимые формальности, досмотр и ожидание. Вылет в Милан-Мальпенса по билету в 22:35. Онлайн-регистрацию и пять посадочных проверить заранее; статус и выход — по табло."
    }
  ]
};
export function applyRouteUpdates(plan) {
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
