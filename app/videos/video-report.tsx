'use client';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, ExternalLink, Film, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { validateVideoInput, type TripVideo } from '@/lib/videos';
import plan from '@/data/plan.json';

const dateLabel = (date: string) => new Date(date + 'T12:00:00Z').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
export default function VideoReport() {
  const [videos, setVideos] = useState<TripVideo[]>([]);
  const [loading, setLoading] = useState(true), [saving, setSaving] = useState(false), [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState(''), [formError, setFormError] = useState(''), [deleteError, setDeleteError] = useState('');
  const [needsSignin, setNeedsSignin] = useState(false), [notice, setNotice] = useState('');
  const [url, setUrl] = useState(''), [title, setTitle] = useState(''), [dayId, setDayId] = useState('');
  const [editing, setEditing] = useState<TripVideo | null>(null), [removing, setRemoving] = useState<TripVideo | null>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const load = useCallback(async () => {
    setLoading(true); setLoadError('');
    try {
      const response = await fetch('/api/videos', { cache: 'no-store' });
      const data = await response.json() as { videos?: TripVideo[]; error?: string };
      setNeedsSignin(response.status === 401);
      if (!response.ok) throw new Error(data.error || 'Не удалось загрузить видео.');
      setVideos(data.videos || []);
    } catch (error) { setLoadError(error instanceof Error ? error.message : 'Не удалось загрузить видео.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  function reset() { setUrl(''); setTitle(''); setDayId(''); setEditing(null); setFormError(''); }
  function edit(video: TripVideo) {
    setEditing(video); setUrl('https://www.youtube.com/watch?v=' + video.videoId); setTitle(video.title); setDayId(video.dayId || ''); setFormError(''); setNotice('');
    titleInput.current?.focus();
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setFormError(''); setNotice('');
    try { validateVideoInput({ url, title, dayId }, plan.days.map(day => day.id)); }
    catch (error) { setFormError((error as Error).message); return; }
    setSaving(true);
    try {
      const response = await fetch('/api/videos', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, title, dayId }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Не удалось сохранить видео.');
      setNotice(editing ? 'Изменения сохранены.' : 'Видео добавлено.'); reset(); await load();
    } catch (error) { setFormError(error instanceof Error ? error.message : 'Не удалось сохранить. Попробуйте ещё раз.'); }
    finally { setSaving(false); }
  }
  async function remove() {
    if (!removing) return;
    setDeleting(true); setDeleteError('');
    try {
      const response = await fetch('/api/videos?id=' + encodeURIComponent(removing.videoId), { method: 'DELETE' });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Не удалось убрать видео.');
      if (editing?.videoId === removing.videoId) reset();
      setVideos(previous => previous.filter(video => video.videoId !== removing.videoId)); setRemoving(null); setNotice('Ссылка убрана из видеоотчёта.');
    } catch (error) { setDeleteError(error instanceof Error ? error.message : 'Не удалось убрать видео.'); }
    finally { setDeleting(false); }
  }
  return <main className="video-page">
    <header><Link href="/" className="brand"><Compass aria-hidden="true"/><b>Европа 2026</b></Link><Link href="/" className="video-back"><ArrowLeft size={17}/>К маршруту</Link></header>
    <div className="video-page-heading"><div><small>НАШЕ ПУТЕШЕСТВИЕ В КАДРЕ</small><h1>Видеоотчёт</h1><p>Собираем здесь видео нашей поездки.</p></div><Film size={38} aria-hidden="true"/></div>
    <div className="video-workspace">
      <aside className="video-editor">
        <h2>{editing ? 'Изменить запись' : 'Добавить видео'}</h2>
        <form onSubmit={submit}>
          <label htmlFor="video-url">Ссылка на YouTube<Input id="video-url" type="url" required maxLength={2048} placeholder="https://youtu.be/…" value={url} readOnly={!!editing} disabled={saving || needsSignin} onChange={event => setUrl(event.target.value)} aria-describedby="video-url-help"/></label>
          <p id="video-url-help" className="video-field-hint">Подойдут обычные ролики, Shorts и записи трансляций.</p>
          <label htmlFor="video-title">Название <span className="video-optional">необязательно</span><Input ref={titleInput} id="video-title" maxLength={160} value={title} disabled={saving || needsSignin} placeholder="Например, первый день в Ереване" onChange={event => setTitle(event.target.value)}/></label>
          <label htmlFor="video-day">День поездки <span className="video-optional">необязательно</span><select id="video-day" value={dayId} disabled={saving || needsSignin} onChange={event => setDayId(event.target.value)}><option value="">Вся поездка</option>{plan.days.map(day => <option key={day.id} value={day.id}>{dateLabel(day.date)} · {day.title}</option>)}</select></label>
          {formError && <p className="video-error" role="alert">{formError}</p>}
          <div className="video-form-actions"><Button type="submit" className="primary" disabled={saving || needsSignin || !url.trim()}>{saving ? 'Сохраняем…' : editing ? 'Сохранить изменения' : <><Plus size={17}/>Добавить видео</>}</Button>{editing && <Button type="button" variant="outline" disabled={saving} onClick={reset}>Отмена</Button>}</div>
        </form>
        <p className="video-storage-note">Ссылки сохраняются в вашем видеоотчёте и доступны после входа с другого устройства.</p>
      </aside>
      <section className="video-collection" aria-label="Видео поездки" aria-busy={loading}>
        <div className="video-collection-heading"><h2>Наши видео</h2><Button type="button" variant="ghost" size="icon" disabled={loading} onClick={load} aria-label="Обновить список видео"><RefreshCw size={17}/></Button></div>
        {notice && <p className="video-success" role="status">{notice}</p>}
        {loadError && <div className="video-error" role="alert"><p>{loadError}</p>{needsSignin ? <a className="text-link" href="/signin-with-chatgpt?return_to=/videos" target="_top">Войти через ChatGPT</a> : <Button type="button" variant="outline" onClick={load}>Повторить</Button>}</div>}
        {loading && videos.length === 0 && <p className="video-loading" role="status">Загружаем видеоотчёт…</p>}
        {!loading && !loadError && videos.length === 0 && <div className="video-empty"><Film size={42} aria-hidden="true"/><h3>Первое видео ещё впереди</h3><p>Когда опубликуете ролик на YouTube, добавьте сюда ссылку.</p></div>}
        <div className="video-grid">{videos.map(video => {
          const day = plan.days.find(day => day.id === video.dayId);
          return <article className="video-card" key={video.videoId}>
            <iframe src={'https://www.youtube.com/embed/' + video.videoId + '?playsinline=1&rel=0'} title={video.title} loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>
            <div className="video-card-body"><p className="video-day">{day ? dateLabel(day.date) + ' · ' + day.title : 'Вся поездка'}</p><h3>{video.title}</h3><div className="video-card-actions"><a href={'https://www.youtube.com/watch?v=' + video.videoId} target="_blank" rel="noreferrer">На YouTube <ExternalLink size={14}/></a><Button type="button" size="icon" variant="ghost" aria-label={'Изменить: ' + video.title} disabled={saving} onClick={() => edit(video)}><Pencil size={16}/></Button><Button type="button" size="icon" variant="ghost" aria-label={'Убрать: ' + video.title} onClick={() => { setRemoving(video); setDeleteError(''); }}><Trash2 size={16}/></Button></div></div>
          </article>;
        })}</div>
        {videos.length > 0 && <p className="video-playback-note">Если автор ограничил просмотр на других сайтах, откройте ролик по ссылке «На YouTube».</p>}
      </section>
    </div>
    <AlertDialog open={!!removing} onOpenChange={open => { if (!open && !deleting) setRemoving(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Убрать видео из отчёта?</AlertDialogTitle><AlertDialogDescription>«{removing?.title}» исчезнет из списка. Сам ролик на YouTube останется, а ссылку можно будет добавить снова.</AlertDialogDescription></AlertDialogHeader>{deleteError && <p role="alert" className="video-error">{deleteError}</p>}<AlertDialogFooter><Button variant="outline" disabled={deleting} onClick={() => setRemoving(null)}>Оставить</Button><Button variant="destructive" disabled={deleting} onClick={remove}>{deleting ? 'Убираем…' : 'Убрать ссылку'}</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </main>;
}
