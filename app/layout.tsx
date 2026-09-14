import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'Европа 2026 — семейное путешествие',description:'Интерактивный маршрут семьи: 17 сентября — 4 октября 2026. Карта, расписание и бюджет.',icons:{icon:'/favicon.svg?v=20260909',shortcut:'/favicon.svg?v=20260909'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ru"><body>{children}</body></html>}
