// sw.js - Archivo de soporte obligatorio para liberar las notificaciones en sistemas móviles
self.addEventListener('notificationclick', (e) => e.notification.close());