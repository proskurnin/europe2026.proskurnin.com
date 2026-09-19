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
  "id": "yerevan-2026-09-19-metro-aznavour-dalan-v2",
  "dayId": "day-2026-09-19",
  "day": {
    "title": "Ереван: метро, «Мать Армения», площадь Азнавура и Dalan → Милан",
    "story": "Метро → «Мать Армения» → площадь Шарля Азнавура → обед и отдых в Dalan → аэропорт. Рюкзаки весь день с собой, квартира не продлена. К парку и обратно в центр — на такси. Площадь и кафе — одна компактная остановка без дополнительных экскурсий. Выезд в аэропорт в 18:30, прибытие к 19:30, вылет в 22:35.",
    "sourceText": "Метро → «Мать Армения» → площадь Шарля Азнавура → обед и отдых в Dalan → аэропорт. Рюкзаки весь день с собой, квартира не продлена. К парку и обратно в центр — на такси. Площадь и кафе — одна компактная остановка без дополнительных экскурсий. Выезд в аэропорт в 18:30, прибытие к 19:30, вылет в 22:35.\n«Площадь Республики» → «Еритасардакан»: одна остановка в сторону «Барекамутюн», без пересадок. Рюкзаки с собой; у сотрудника уточнить оплату для всей семьи.\nОт «Еритасардакан» — такси ко входу в парк Победы со стороны проспекта Азатутян, затем короткая прогулка к памятнику. Осмотр, панорама и отдых — 45–60 минут. Без подъёма через Каскад.\nИз парка Победы — на такси к площади перед кинотеатром «Москва». Короткая прогулка и фотографии: 15–20 минут. Затем пешком к Dalan на улице Абовяна, 12; без дополнительных экскурсий.\nАбовяна, 12: обед и сидячий отдых после прогулки по площади. Рюкзаки с собой. Столик не забронирован; наличие мест во дворике и возможность посидеть подольше уточнить при входе. К 18:00 проверить паспорта и пять посадочных, заряд телефонов; заказать машину на пять пассажиров с детским креслом. При усталости выехать раньше.\n18:30–19:30: выезд от кафе Dalan, Абовяна, 12, или ближайшей удобной точки посадки. На дорогу 40–60 минут с запасом на пробки. Машина на пять пассажиров с детским креслом. Цель — быть в аэропорту к 19:30.\nС 19:30 — необходимые формальности, досмотр и ожидание. Вылет в Милан-Мальпенса по билету в 22:35. Онлайн-регистрацию и пять посадочных проверить заранее; статус и выход — по табло.",
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
        "text": "5. К кафе Dalan",
        "url": "https://www.google.com/maps/dir/?api=1&origin=Charles%20Aznavour%20Square%20Yerevan&destination=Dalan%20Abovyan%2012%20Yerevan&travelmode=walking"
      },
      {
        "text": "6. В аэропорт",
        "url": "https://www.google.com/maps/dir/?api=1&origin=Dalan%20Abovyan%2012%20Yerevan&destination=Zvartnots%20International%20Airport&travelmode=driving"
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
      "description": "Из парка Победы — на такси к площади перед кинотеатром «Москва». Короткая прогулка и фотографии: 15–20 минут. Затем пешком к Dalan на улице Абовяна, 12; без дополнительных экскурсий."
    },
    {
      "dayId": "day-2026-09-19",
      "start": null,
      "end": null,
      "status": "planned",
      "optional": false,
      "source": "Согласованный маршрут в чате · 19.09.2026",
      "links": [
        {
          "text": "Сайт Dalan",
          "url": "https://dalan.am/"
        }
      ],
      "id": "visit-2026-09-19-dalan",
      "placeId": "dalan",
      "title": "Dalan · обед и отдых в красивом дворике",
      "category": "food",
      "description": "Абовяна, 12: обед и сидячий отдых после прогулки по площади. Рюкзаки с собой. Столик не забронирован; наличие мест во дворике и возможность посидеть подольше уточнить при входе. К 18:00 проверить паспорта и пять посадочных, заряд телефонов; заказать машину на пять пассажиров с детским креслом. При усталости выехать раньше."
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
      "title": "Такси от Dalan в Звартноц",
      "category": "airport",
      "description": "18:30–19:30: выезд от кафе Dalan, Абовяна, 12, или ближайшей удобной точки посадки. На дорогу 40–60 минут с запасом на пробки. Машина на пять пассажиров с детским креслом. Цель — быть в аэропорту к 19:30."
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
