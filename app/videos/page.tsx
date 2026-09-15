import type { Metadata } from 'next';
import VideoReport from './video-report';
export const metadata: Metadata = { title: 'Видеоотчёт — Европа 2026', description: 'Видео нашего семейного путешествия по Европе.' };
export default function VideosPage() { return <VideoReport/>; }
