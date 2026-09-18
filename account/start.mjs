import {createApp} from './app.mjs';
const origin=process.env.SITE_ORIGIN||'https://europe2026.proskurnin.com';
createApp({dbPath:process.env.DB_PATH||'/data/europe.sqlite',planPath:process.env.PLAN_PATH||'/app/plan.json',origin,secure:!origin.startsWith('http://127.0.0.1:')}).listen(Number(process.env.PORT||3220),process.env.BIND_HOST||'0.0.0.0',()=>console.log('Europe account service ready'));
