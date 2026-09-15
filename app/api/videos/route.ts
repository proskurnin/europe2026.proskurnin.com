import { videoDb } from '@/lib/video-db';
import { validateVideoInput, type TripVideo } from '@/lib/videos';
import plan from '@/data/plan.json';

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
const owner = (request: Request) => request.headers.get('oai-authenticated-user-id');
function guard(request: Request) {
  if (!owner(request)) return json({ error: 'Войдите, чтобы открыть свой видеоотчёт.' }, 401);
  if (request.method !== 'GET' && request.headers.get('origin') !== new URL(request.url).origin) return json({ error: 'Обновите страницу и повторите действие.' }, 403);
  return null;
}
function unavailable(error: unknown) {
  console.error('Video storage request failed', error);
  return json({ error: 'Не удалось связаться с хранилищем. Ваш ввод сохранён — попробуйте ещё раз.' }, 503);
}
export async function GET(request: Request) {
  const blocked = guard(request); if (blocked) return blocked;
  try {
    const { results } = await videoDb().prepare('SELECT video_id AS videoId, title, day_id AS dayId, created_at AS createdAt FROM trip_videos WHERE owner_id = ? ORDER BY day_id IS NULL, day_id, created_at').bind(owner(request)).all<TripVideo>();
    return json({ videos: results });
  } catch (error) { return unavailable(error); }
}
async function save(request: Request, edit: boolean) {
  const blocked = guard(request); if (blocked) return blocked;
  let data: ReturnType<typeof validateVideoInput>;
  try {
    if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'Нужны данные в формате JSON.' }, 415);
    const body = await request.text();
    if (body.length > 4096) return json({ error: 'Слишком длинная запись.' }, 413);
    data = validateVideoInput(JSON.parse(body), plan.days.map(day => day.id));
  } catch (error) { return json({ error: error instanceof SyntaxError ? 'Не удалось прочитать запись.' : (error as Error).message }, 400); }
  try {
    const db = videoDb();
    if (edit) {
      const result = await db.prepare('UPDATE trip_videos SET title = ?, day_id = ? WHERE owner_id = ? AND video_id = ?').bind(data.title, data.dayId, owner(request), data.videoId).run();
      if (!result.meta.changes) return json({ error: 'Видео уже удалено. Обновите список.' }, 404);
    } else {
      const result = await db.prepare('INSERT INTO trip_videos (owner_id, video_id, title, day_id, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(owner_id, video_id) DO NOTHING').bind(owner(request), data.videoId, data.title, data.dayId, new Date().toISOString()).run();
      if (!result.meta.changes) return json({ error: 'Это видео уже есть в вашем видеоотчёте.' }, 409);
    }
    return json({ saved: true });
  } catch (error) { return unavailable(error); }
}
export const POST = (request: Request) => save(request, false);
export const PUT = (request: Request) => save(request, true);
export async function DELETE(request: Request) {
  const blocked = guard(request); if (blocked) return blocked;
  const id = new URL(request.url).searchParams.get('id');
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return json({ error: 'Неизвестное видео.' }, 400);
  try {
    await videoDb().prepare('DELETE FROM trip_videos WHERE owner_id = ? AND video_id = ?').bind(owner(request), id).run();
    return json({ deleted: true });
  } catch (error) { return unavailable(error); }
}
