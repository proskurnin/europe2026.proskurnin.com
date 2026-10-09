import { mkdir, copyFile, access } from 'node:fs/promises';
await access('dist/client/index.html');
await access('dist/client/videos.html');
await mkdir('dist/client/videos', { recursive: true });
await copyFile('dist/client/videos.html', 'dist/client/videos/index.html');
console.log('Apache export ready: / and /videos/');

await access('dist/client/account.html');
await mkdir('dist/client/account', { recursive: true });
await copyFile('dist/client/account.html', 'dist/client/account/index.html');
