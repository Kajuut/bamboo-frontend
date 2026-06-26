// ========================================================
// MOTOR LÓGICO DE REGISTRO SEGURO Y VERIFICACIÓN OTP (BAMBOO)
// ========================================================

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '192.168.0.102'
    ? 'http://192.168.0.102:3000' 
    : 'https://bamboo-backend-dmyg.onrender.com'; // Tu URL oficial de Render

document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formRegistroUsuario');
    const formOTP = document.getElementById('formValidarOTP');
    const modalOTP = document.getElementById('modalVerificacionOTP');
    const alerta = document.getElementById('alertaRegistro');
    const inputsOTP = document.querySelectorAll('.otp-digit');

    // Variables temporales para retener los datos del usuario antes de la validación física
    let datosRegistroTemporales = null;

    // --- 1. FUNCIÓN PARA MOSTRAR ALERTAS ESTILO TU LOGIN ---
    function mostrarNotificacion(mensaje, tipo) {
        alerta.textContent = mensaje;
        alerta.className = `notificacion mostrar ${tipo}`; // Inyecta las clases exito/error de tu CSS
        alerta.style.display = 'block';

        // Desaparece automáticamente después de 4 segundos
        setTimeout(() => {
            alerta.className = 'notificacion';
            alerta.style.display = 'none';
        }, 4000);
    }

    // --- 2. CONFIGURACIÓN DEL SALTO AUTOMÁTICO DE LOS INPUTS OTP ---
    inputsOTP.forEach((input, index) => {
        // Al escribir, avanza al siguiente cuadro
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < inputsOTP.length - 1) {
                inputsOTP[index + 1].focus();
            }
        });

        // Al presionar borrar (Backspace), retrocede al cuadro anterior
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
                inputsOTP[index - 1].focus();
            }
        });
    });

    // --- 3. ENVÍO DEL FORMULARIO PRINCIPAL (OBTENER CÓDIGO) ---
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('regNombre').value.trim();
            const correo = document.getElementById('regCorreo').value.trim();
            const telefono = document.getElementById('regTelefono').value.trim();
            const password = document.getElementById('regPassword').value;
            const passwordConfirm = document.getElementById('regPasswordConfirm').value;

            // Validación A: Que las contraseñas coincidan estrictamente
            if (password !== passwordConfirm) {
                mostrarNotificacion('Las contraseñas ingresadas no coinciden. Verifica los datos.', 'error');
                return;
            }

            // Guardamos los datos temporalmente en memoria
            datosRegistroTemporales = { nombre, correo, telefono, password };

            try {
                // Petición al backend para solicitar el envío del código OTP al celular
                const respuesta = await fetch(`${API_BASE_URL}/api/auth/solicitar-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ telefono, correo })
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    // Si el servidor generó y envió el código con éxito, abrimos el modal
                    modalOTP.style.display = 'flex';
                    inputsOTP[0].focus(); // Pone el cursor en el primer cuadrito
                    mostrarNotificacion('Código enviado con éxito. Revisa tu celular.', 'exito');
                } else {
                    mostrarNotificacion(resultado.mensaje || 'Error al solicitar el código de verificación.', 'error');
                }
            } catch (error) {
                console.error('Error en solicitud OTP:', error);
                mostrarNotificacion('Error de conexión con el motor de BAMBOO.', 'error');
            }
        });
    }

    // --- 4. ENVÍO DEL FORMULARIO OTP (VALIDACIÓN FINAL Y REGISTRO) ---
    if (formOTP) {
        formOTP.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Concatenamos los 4 dígitos individuales para formar el código string
            let codigoOTP = '';
            inputsOTP.forEach(input => codigoOTP += input.value);

            if (codigoOTP.length < 4) {
                mostrarNotificacion('Por favor completa los 4 dígitos del código.', 'error');
                return;
            }

            try {
                // Mandamos el código y los datos completos del usuario para el registro definitivo
                const respuesta = await fetch(`${API_BASE_URL}/api/auth/verificar-registro`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...datosRegistroTemporales,
                        codigo: codigoOTP
                    })
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    mostrarNotificacion('¡Cuenta activada y creada con éxito! Redirigiendo...', 'exito');
                    modalOTP.style.display = 'none';
                    formRegistro.reset();
                    formOTP.reset();

                    // Esperamos 2 segundos para que aprecie el éxito y mandamos al Login
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    mostrarNotificacion(resultado.mensaje || 'El código ingresado es incorrecto o expiró.', 'error');
                    // Limpiamos los inputs del OTP para un nuevo intento
                    inputsOTP.forEach(input => input.value = '');
                    inputsOTP[0].focus();
                }
            } catch (error) {
                console.error('Error al verificar OTP:', error);
                mostrarNotificacion('Error crítico al enlazar la confirmación.', 'error');
            }
        });
    }
});

// --- 5. FUNCIÓN GLOBAL PARA CANCELAR EL PROCESO ---
window.cancelarProcesoOTP = function() {
    const modalOTP = document.getElementById('modalVerificacionOTP');
    const formOTP = document.getElementById('formValidarOTP');
    const inputsOTP = document.querySelectorAll('.otp-digit');
    
    if (modalOTP) modalOTP.style.display = 'none';
    if (formOTP) formOTP.reset();
    inputsOTP.forEach(input => input.value = '');
    mostrarNotificacion('Proceso de registro cancelado de forma segura.', 'error');
};