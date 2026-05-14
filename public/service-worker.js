self.addEventListener('install', (event) => {
  console.log('Service Worker установлен');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker активирован');
});

self.addEventListener('fetch', (event) => {
  // Можно добавить кэширование
});
