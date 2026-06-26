
const loginForm = document.getElementById('loginForm');
const notificacion = document.getElementById('notificacion');

// Función elegante para mostrar mensajes en pantalla
function mostrarMensaje(mensaje, tipo) {
    // Le ponemos el texto
    notificacion.textContent = mensaje;
    
    // Le asignamos las clases para que aparezca con el color correcto (exito o error)
    notificacion.className = `notificacion mostrar ${tipo}`;
    
    // Lo ocultamos automáticamente después de 4 segundos
    setTimeout(() => {
        notificacion.className = 'notificacion';
    }, 4000);
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    try {
        const respuesta = await fetch('http://192.168.0.102:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, password })
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            // Guardamos el gafete digital
            localStorage.setItem('bamboo_token', data.token);
            localStorage.setItem('bamboo_usuario', JSON.stringify(data.usuario));

            // Mostramos el mensaje verde de éxito
            mostrarMensaje(`¡Bienvenido al sistema, ${data.usuario.nombre}!`, 'exito');

            // Hacemos una pausa de 1.5 segundos para que se alcance a leer el mensaje, y luego lo mandamos al panel
            setTimeout(() => {
                 window.location.href = 'panel.html'; 
            }, 1500);
            
        } else {
            // Mostramos el mensaje rojo de error (Ej. Contraseña incorrecta)
            mostrarMensaje(`Error: ${data.mensaje}`, 'error');
        }

    } catch (error) {
        console.error('Fallo en la comunicación:', error);
        mostrarMensaje('Error de conexión. Asegúrate de que el motor de BAMBOO esté encendido.', 'error');
    }
});