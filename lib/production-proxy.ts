const production = 'https://europe2026.proskurnin.com';
const site = 'https://europe-2026-proskurnin.proskurnin.chatgpt.site';
const cookieName = '__Host-europe-session';

// Use the existing account service and database; never trust forwarded identity headers.
export async function proxyAccountRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (!/^\/api\/(account|trip)\/[a-zA-Z0-9/-]+$/.test(url.pathname))
    return Response.json({error:'Страница не найдена.'},{status:404});
  const mutating = !['GET','HEAD'].includes(request.method);
  if (mutating && request.headers.get('origin') !== site)
    return Response.json({error:'Запрос должен быть отправлен с сайта.'},{status:403});
  if (mutating && !request.headers.get('content-type')?.startsWith('application/json'))
    return Response.json({error:'Нужен JSON.'},{status:415});
  const headers = new Headers({Accept:'application/json'});
  const session = request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='));
  if (session) headers.set('Cookie',session);
  if (mutating) { headers.set('Origin',production); headers.set('Content-Type','application/json'); }
  try {
    const response = await fetch(production+url.pathname+url.search, {
      method:request.method, headers,
      body:mutating?await request.arrayBuffer():undefined,
      redirect:'manual', signal:AbortSignal.timeout(20000),
    });
    const outgoing = new Headers({'Content-Type':'application/json','Cache-Control':'no-store'});
    const setCookie = response.headers.get('set-cookie');
    if(setCookie?.startsWith(cookieName+'=')) outgoing.set('Set-Cookie',setCookie);
    return new Response(response.body,{status:response.status,headers:outgoing});
  } catch {
    return Response.json({error:'Сервер временно недоступен. Повторите попытку.'},{status:503,headers:{'Cache-Control':'no-store'}});
  }
}
