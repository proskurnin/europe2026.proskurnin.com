import {readFileSync,writeFileSync} from 'node:fs';
import {publicPlan} from '../server/account/public-plan.mjs';
const plan=JSON.parse(readFileSync('data/plan.json','utf8'));
writeFileSync('data/public-plan.json',JSON.stringify(publicPlan(plan),null,2)+'\n');
