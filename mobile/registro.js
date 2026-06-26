// ========================================================
// MOTOR LÓGICO DE REGISTRO SEGURO Y VERIFICACIÓN OTP (BAMBOO)
// ========================================================

// Instanciamos de forma global la alerta para evitar errores de Scope en el modal
window.mostrarNotificacionM = function(mensaje, tipo) {
    const alerta = document.getElementById('alertaRegistro');
    if (!alerta) return;
    alerta.textContent = mensaje;
    alerta.className = `notificacion mostrar ${tipo}`;
    alerta.style.display = 'block';

    setTimeout(() => {
        alerta.className = 'notificacion';
        alerta.style.display = 'none';
    }, 4000);
};

document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formRegistroUsuario');
    const formOTP = document.getElementById('formValidarOTP');
    const modalOTP = document.getElementById('modalVerificacionOTP');
    const inputsOTP = document.querySelectorAll('.otp-digit');

    let datosRegistroTemporales = null;

    // --- CONFIGURACIÓN DEL SALTO AUTOMÁTICO DE LOS INPUTS OTP ---
    inputsOTP.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < inputsOTP.length - 1) {
                inputsOTP[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
                inputsOTP[index - 1].focus();
            }
        });
    });

    // --- ENVÍO DEL FORMULARIO PRINCIPAL (SOLICITAR IP FIJA) ---
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('regNombre').value.trim();
            const correo = document.getElementById('regCorreo').value.trim();
            const telefono = document.getElementById('regTelefono').value.trim();
            const password = document.getElementById('regPassword').value;
            const passwordConfirm = document.getElementById('regPasswordConfirm').value;

            if (password !== passwordConfirm) {
                window.mostrarNotificacionM('Las contraseñas ingresadas no coinciden.', 'error');
                return;
            }

            datosRegistroTemporales = { nombre, correo, telefono, password };

            try {
                // ⚠️ CORRECCIÓN: Apuntamos directo a tu IP de red local
                const respuesta = await fetch('http://192.168.0.102:3000/api/auth/solicitar-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ telefono, correo })
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    if(modalOTP) modalOTP.style.display = 'flex';
                    if(inputsOTP[0]) inputsOTP[0].focus();
                    window.mostrarNotificacionM('Código enviado con éxito.', 'exito');
                } else {
                    window.mostrarNotificacionM(resultado.mensaje || 'Error al solicitar código.', 'error');
                }
            } catch (error) {
                console.error('Error en solicitud OTP:', error);
                window.mostrarNotificacionM('Error de conexión con el motor de BAMBOO.', 'error');
            }
        });
    }

    // --- ENVÍO DEL FORMULARIO OTP (VALIDACIÓN FINAL Y REGISTRO) ---
    if (formOTP) {
        formOTP.addEventListener('submit', async (e) => {
            e.preventDefault();

            let codigoOTP = '';
            inputsOTP.forEach(input => codigoOTP += input.value);

            if (codigoOTP.length < 4) {
                window.mostrarNotificacionM('Por favor completa los 4 dígitos del código.', 'error');
                return;
            }

            try {
                // ⚠️ CORRECCIÓN: Sincronizado con la IP operativa de Atlas
                const respuesta = await fetch('http://192.168.0.102:3000/api/auth/verificar-registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...datosRegistroTemporales,
                        codigo: codigoOTP
                    })
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    window.mostrarNotificacionM('¡Cuenta activada con éxito! Redirigiendo...', 'exito');
                    if(modalOTP) modalOTP.style.display = 'none';
                    formRegistro.reset();
                    formOTP.reset();

                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    window.mostrarNotificacionM(resultado.mensaje || 'Código incorrecto o expirado.', 'error');
                    inputsOTP.forEach(input => input.value = '');
                    inputsOTP[0].focus();
                }
            } catch (error) {
                console.error('Error al verificar OTP:', error);
                window.mostrarNotificacionM('Error crítico al enlazar la confirmación.', 'error');
            }
        });
    }
});

// --- FUNCIÓN GLOBAL CORREGIDA PARA DISPARARSE SIN FILTROS DE INTERRUPCIÓN ---
window.cancelarProcesoOTP = function() {
    const modalOTP = document.getElementById('modalVerificacionOTP');
    const formOTP = document.getElementById('formValidarOTP');
    const inputsOTP = document.querySelectorAll('.otp-digit');
    
    if (modalOTP) modalOTP.style.display = 'none';
    if (formOTP) formOTP.reset();
    inputsOTP.forEach(input => input.value = '');
    window.mostrarNotificacionM('Proceso de registro cancelado de forma segura.', 'error');
};