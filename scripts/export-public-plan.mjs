import {readFileSync,writeFileSync} from 'node:fs';
import {publicPlan,applyRouteUpdates} from '../server/account/public-plan.mjs';
const plan=JSON.parse(readFileSync('data/plan.json','utf8'));
writeFileSync('data/public-plan.json',JSON.stringify(publicPlan(applyRouteUpdates(plan)),null,2)+'\n');
