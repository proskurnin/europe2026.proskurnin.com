import { mkdir, copyFile, access } from 'node:fs/promises';
await access('dist/client/index.html');
await access('dist/client/videos.html');
await mkdir('dist/client/videos', { recursive: true });
await copyFile('dist/client/videos.html', 'dist/client/videos/index.html');
console.log('Apache export ready: / and /videos/');
