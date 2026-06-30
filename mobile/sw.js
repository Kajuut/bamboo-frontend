// sw.js - Archivo de soporte obligatorio para liberar las notificaciones en sistemas móviles
self.addEventListener('notificationclick', (e) => e.notification.close());
self.addEventListener('fetch', (event) => {
    // Deja pasar las peticiones normalmente, solo sirve de pasaporte para el sistema
});