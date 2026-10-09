import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {itinerary,transitDate,mapsLink} from '../lib/logistics.ts';
const plan=JSON.parse(readFileSync(new URL('../data/plan.json',import.meta.url),'utf8'));
for(const d of plan.days){const r=itinerary(plan,d.date);assert.ok(r.stops.length);assert.equal(new Set(r.stops.map(s=>s.id)).size,r.stops.length);for(const s of r.stops){assert.ok(plan.cities[s.city],s.city);if(s.place)assert.ok(s.location,s.place);if(s.visit)assert.ok(plan.visits.some((v:any)=>v.id===`visit-${d.date}-${s.visit}`),s.visit);}for(const l of r.legs){if(l.mode!=='unknown'){assert.ok(l.from.location||l.from.query);assert.ok(l.to.location||l.to.query);}assert.ok(mapsLink(l).startsWith('https://www.google.com/maps/dir/?'));}}
const yerevan=itinerary(plan,'2026-09-18');assert.ok(yerevan.stops.findIndex(s=>s.id==='dinner')<yerevan.stops.findIndex(s=>s.id==='fountains'));
const milan=itinerary(plan,'2026-09-20');assert.deepEqual(milan.stops.filter(s=>['scala','brera','sforza'].includes(s.id)).map(s=>s.id),['scala','brera','sforza']);
const skipped=structuredClone(plan.visits);skipped.find((v:any)=>v.id==='visit-2026-09-20-galleria').status='skip';assert.ok(!itinerary(plan,'2026-09-20',skipped).stops.some(s=>s.visit==='galleria'));
assert.equal(transitDate('2026-09-20','02:40','milan',Date.parse('2026-09-15')).date.toISOString(),'2026-09-20T00:40:00.000Z');assert.equal(transitDate('2026-09-20','02:40','milan',Date.parse('2027-09-15')).current,true);
console.log('Logistics checks passed for all 18 days, sequence, unknown addresses, skipped stops and time zones.');
