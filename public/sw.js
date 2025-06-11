const _CACHE_NAME = 'pickr-v1';
const STATIC_CACHE = 'pickr-static-v1';
const DYNAMIC_CACHE = 'pickr-dynamic-v1';

const STATIC_ASSETS = [
	'/',
	'/create',
	'/compare',
	'/results/shared',
	'/manifest.json',
	'/icon-32.svg',
	'/icon-72.svg',
	'/icon-96.svg',
	'/icon-128.svg',
	'/icon-144.svg',
	'/icon-152.svg',
	'/icon-180.svg',
	'/icon-192.svg',
	'/icon-384.svg',
	'/icon-512.svg',
	'/favicon.svg',
];

// Install event - cache static assets
self.addEventListener('install', event => {
	console.log('Service Worker installing...');
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then(cache => {
				console.log('Caching static assets');
				return cache.addAll(STATIC_ASSETS);
			})
			.then(() => {
				return self.skipWaiting();
			})
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
	console.log('Service Worker activating...');
	event.waitUntil(
		caches
			.keys()
			.then(cacheNames => {
				return Promise.all(
					cacheNames.map(cacheName => {
						if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
							console.log('Deleting old cache:', cacheName);
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => {
				return self.clients.claim();
			})
	);
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
	const { request } = event;
	const url = new URL(request.url);

	// Handle navigation requests (pages)
	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then(response => {
					// If network succeeds, cache and return
					const responseClone = response.clone();
					caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, responseClone));
					return response;
				})
				.catch(() => {
					// If network fails, try cache
					return caches.match(request).then(cachedResponse => {
						if (cachedResponse) {
							return cachedResponse;
						}
						// Fallback to index.html for SPA routes
						return caches.match('/');
					});
				})
		);
		return;
	}

	// Handle static assets with cache-first strategy
	if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
		event.respondWith(
			caches.match(request).then(cachedResponse => {
				return cachedResponse || fetch(request);
			})
		);
		return;
	}

	// Handle API calls and other resources with network-first strategy
	event.respondWith(
		fetch(request)
			.then(response => {
				// Only cache successful responses
				if (response.status === 200) {
					const responseClone = response.clone();
					caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, responseClone));
				}
				return response;
			})
			.catch(() => {
				// Fallback to cache if network fails
				return caches.match(request);
			})
	);
});

// Handle background sync for offline actions
self.addEventListener('sync', event => {
	if (event.tag === 'background-sync') {
		console.log('Background sync triggered');
		event.waitUntil(
			// Handle any pending offline actions here
			Promise.resolve()
		);
	}
});

// Handle push notifications (for future use)
self.addEventListener('push', event => {
	if (event.data) {
		const options = {
			body: event.data.text(),
			icon: '/icon-192.svg',
			badge: '/icon-192.svg',
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				primaryKey: 1,
			},
		};

		event.waitUntil(self.registration.showNotification('Pickr Notification', options));
	}
});
