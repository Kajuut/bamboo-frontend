const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '192.168.0.102'
    ? 'http://192.168.0.102:3000'
    : 'https://bamboo-backend-dmyg.onrender.com'; // Tu URL de Render

document.addEventListener('DOMContentLoaded', () => {

    // ========================================================
    // 🔔 DESPERTADOR DE NOTIFICACIONES NATIVAS (WEB PUSH ACTUATOR)
    // ========================================================
    function inicializarPermisosNotificacionesMovi() {
        if ('Notification' in window) {
            // Evaluamos si el navegador móvil ya tiene bloqueado o activo el canal
            if (Notification.permission === 'default') {
                console.log("⏱️ Solicitando canal de alertas operativas para el Staff...");
                Notification.requestPermission().then(permiso => {
                    if (permiso === 'granted') {
                        console.log("✅ Canal web push autorizado para BAMBOO.");
                        if (typeof window.mostrarAlerta === 'function') {
                            window.mostrarAlerta("🔔 ¡Notificaciones activadas! Recibirás avisos de eventos y movimientos financieros.");
                        }
                    } else {
                        console.warn("⚠️ El operador declinó el uso de alertas push en este dispositivo.");
                    }
                });
            } else if (Notification.permission === 'granted') {
                console.log("⚡ Notificaciones activas previamente en este navegador.");
            }
        } else {
            console.error("❌ Este navegador móvil no soporta la API nativa de notificaciones web.");
        }
    }

    // Ejecutamos la solicitud visual en el instante en que el operario inicia su jornada
    inicializarPermisosNotificacionesMovi();

   // ========================================================
    // 🧪 BOTÓN FLOTANTE OPERATIVO PARA TEST DE ALERTAS
    // ========================================================
    function inyectarBotonPruebaNotificacion() {
        // 1. Creamos un botón físico real y llamativo desde el código
        const btnTest = document.createElement('button');
        btnTest.textContent = "🧪 PROBAR ALERTA EN VIVO";
        
        // Estilos elegantes para que flote arriba del contenido móvil sin estorbar
        btnTest.style.cssText = `
            position: fixed;
            top: 85px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 99999;
            background-color: var(--bamboo-dorado, #C5A059);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.8rem;
            font-weight: 700;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        `;

        // Lo inyectamos directamente en el cuerpo de la página
        document.body.appendChild(btnTest);

        // 2. Programamos el momento exacto del envío al hacerle clic
        btnTest.addEventListener('click', async () => {
            try {
                if (!('serviceWorker' in navigator)) {
                    alert("❌ Tu navegador móvil no soporta Service Workers.");
                    return;
                }

                // Registramos el archivo de soporte técnico obligatorio
                const registro = await navigator.serviceWorker.register('sw.js');
                
                // Forzamos la solicitud de aduana si estuviera en modo espera
                if (Notification.permission === 'default') {
                    await Notification.requestPermission();
                }

                if (Notification.permission !== 'granted') {
                    alert(`⚠️ Permiso denegado en el teléfono: ${Notification.permission}`);
                    return;
                }

                // 🚀 MOMENTO DEL DESPACHO: El Service Worker dispara la notificación nativa
                await registro.showNotification("🎋 Salón BAMBOO", {
                    body: "Alerta Operativa: ¡El sistema de notificaciones push móviles está respondiendo a la perfección!",
                    icon: "favico.svg",
                    badge: "favico.svg",
                    vibrate: [200, 100, 200]
                });

            } catch (error) {
                alert(`⚠️ Error en aduana móvil: ${error.message}`);
            }
        });
    }

    // Activamos la inyección del botón de pruebas
    inyectarBotonPruebaNotificacion();

    // ========================================================
    // 1. PRIMER FILTRO SEGURO: CONTROL DE SESIÓN Y TOKENS
    // ========================================================
    const token = localStorage.getItem('bamboo_token');
    const usuarioStr = localStorage.getItem('bamboo_usuario');

    // Si no hay token o no hay usuario, expulsión inmediata antes de pintar nada
    if (!token || !usuarioStr) {
        window.location.href = 'login.html';
        return;
    }

    const usuarioLogueado = JSON.parse(usuarioStr);
    
    // Pintamos el saludo en la interfaz
    const txtNombre = document.getElementById('nombreUsuario');
    if (txtNombre) txtNombre.textContent = `Hola, ${usuarioLogueado.nombre}`;

    // ========================================================
    // 2. FUNCIÓN DE CAPACIDADES IMPENETRABLE (MATRIZ INTEGRAL)
    // ========================================================
    function usuarioTienePermiso(nombrePermiso) {
        // Regla Suprema: Si el rol es estrictamente 'admin', tiene acceso total por decreto corporativo
        if (usuarioLogueado.role === 'admin' || usuarioLogueado.rol === 'admin') return true; 
        
        // Si es un cliente o staff limitado, validamos contra su matriz específica en Atlas
        if (usuarioLogueado.permisos && usuarioLogueado.permisos[nombrePermiso] === true) {
            return true;
        }
        return false; // De lo contrario, denegado rotundo
    }

    // Exponemos la función al scope global por seguridad para componentes externos
    window.bambooTienePermiso = usuarioTienePermiso;

    // ========================================================
    // 3. APLICACIÓN DE CANDADOS EN LA INTERFAZ (FRENO DE MANO REAL)
    // ========================================================
    function aplicarCandadosEstructuralesAlArranque() {
        // Filtro supremo para clientes de la calle
        if (usuarioLogueado.rol === 'cliente') {
            const pestañaPersonal = document.getElementById('btnMenuUsuarios'); 
            if (pestañaPersonal) pestañaPersonal.remove();

            const pestañaPrecios = document.getElementById('btnMenuPrecios');
            if (pestañaPrecios) pestañaPrecios.remove();

            const contenedorStats = document.getElementById('contenedor-estadisticas'); 
            if (contenedorStats) contenedorStats.style.display = 'none';
            return; 
        }

        // --- FILTRO UNIFICADO PARA EL STAFF (KARLA / EMPLEADOS) EN BASE A SUS LLAVES REALES ---
        
        // Candado A: Control Financiero y Pagos
        if (!usuarioTienePermiso('acceso_modulo_pagos')) {
            const bloqueFinanzas = document.getElementById('resumen-financiero'); 
            if (bloqueFinanzas) bloqueFinanzas.remove(); 
        }

        // Candado B: Pestaña de Control de Usuarios y Personal
        if (!usuarioTienePermiso('gestionar_usuarios')) {
            const pestañaPersonal = document.getElementById('btnMenuUsuarios'); 
            if (pestañaPersonal) pestañaPersonal.remove();
        }

        // Candado C: Pestaña de Configuración del Salón
        if (!usuarioTienePermiso('acceso_vista_configuraciones')) {
            const pestañaPrecios = document.getElementById('btnMenuPrecios');
            if (pestañaPrecios) pestañaPrecios.remove();
        }

        // Candado D: Pestaña de Creación de Reservaciones / Cotizador
        if (!usuarioTienePermiso('crear_nueva_reserva')) {
            const pestañaCrear = document.getElementById('btnMenuCrear');
            if (pestañaCrear) pestañaCrear.remove();
        }

        // Candado E: Módulo de Calendarios Operativos y Métricas
        if (!usuarioTienePermiso('acceso_vista_metricas')) {
            const contenedorStats = document.getElementById('contenedor-estadisticas'); 
            if (contenedorStats) contenedorStats.style.display = 'none';
        }
    }

    // Ejecutamos la purga visual en el instante cero del arranque
    aplicarCandadosEstructuralesAlArranque();

    // ========================================================
    // 4. CARGA DE DATOS CONDICIONADA
    // ========================================================
    async function cargarEstadisticas() {
        // Evitamos peticiones innecesarias al servidor si el cliente no tiene permiso de ver métricas
        if (!usuarioTienePermiso('acceso_vista_metricas')) return;

        try {
            const respuesta = await fetch(`${API_BASE_URL}/api/reservas/estadisticas`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (respuesta.ok) {
                const datos = await respuesta.json();
                if(document.getElementById('statNuevas')) document.getElementById('statNuevas').textContent = datos.nuevas;
                if(document.getElementById('statProximas')) document.getElementById('statProximas').textContent = datos.proximas;
                if(document.getElementById('statConfirmadas')) document.getElementById('statConfirmadas').textContent = datos.confirmadas;
            }
        } catch (error) {
            console.error("Error de red al buscar estadísticas:", error);
        }
    }

    cargarEstadisticas();
    cargarAgendaSemanal();

    // Control de salida seguro
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            localStorage.removeItem('bamboo_token');
            localStorage.removeItem('bamboo_usuario');
            window.location.href = 'login.html';
        });
    }

    // ========================================================
    // 5. SISTEMA DE MODALES PERSONALIZADOS (EXCLUSIVOS DE BAMBOO)
    // ========================================================
    const modalConfirmacion = document.getElementById('modalConfirmacion');
    const modalAlerta = document.getElementById('modalAlerta');
    const btnAceptarConfirmacion = document.getElementById('btnAceptarConfirmacion');
    const btnCancelarConfirmacion = document.getElementById('btnCancelarConfirmacion');
    const btnAceptarAlerta = document.getElementById('btnAceptarAlerta');
    const textoConfirmacion = document.getElementById('textoConfirmacion');
    const textoAlerta = document.getElementById('textoAlerta');

    window.mostrarAlerta = function(mensaje) {
        if (textoAlerta && modalAlerta) {
            textoAlerta.textContent = mensaje;
            modalAlerta.style.display = 'flex';
        }
    };

    if (btnAceptarAlerta) {
        btnAceptarAlerta.addEventListener('click', () => {
            modalAlerta.style.display = 'none';
        });
    }

    window.mostrarConfirmacion = function(mensaje) {
        return new Promise((resolve) => {
            if (!textoConfirmacion || !modalConfirmacion) {
                resolve(false);
                return;
            }
            textoConfirmacion.textContent = mensaje;
            modalConfirmacion.style.display = 'flex';

            btnCancelarConfirmacion.onclick = () => {
                modalConfirmacion.style.display = 'none';
                resolve(false);
            };

            btnAceptarConfirmacion.onclick = () => {
                modalConfirmacion.style.display = 'none';
                resolve(true);
            };
        });
    };

    // ========================================================
    // 6. NAVEGACIÓN BLINDADA ENTRE PANTALLAS DEL MENÚ
    // ========================================================
    const btnMenuInicio = document.getElementById('btnMenuInicio');
    const btnMenuPrecios = document.getElementById('btnMenuPrecios');
    const btnMenuReservas = document.getElementById('btnMenuReservas');
    const btnMenuCrear = document.getElementById('btnMenuCrear');
    const btnMenuCalendarioReal = document.getElementById('btnMenuCalendario');

    const vistaInicio = document.getElementById('vista-inicio');
    const vistaPrecios = document.getElementById('vista-precios');
    const vistaReservaciones = document.getElementById('vista-reservaciones');
    const vistaDetalleReserva = document.getElementById('vista-detalle-reserva');
    const vistaCrear = document.getElementById('vista-crear');
    const vistaCalendarioGigante = document.getElementById('vista-calendario');

    let origenNavegacionDetalles = 'tabla';
    let fechaNavegacionG = new Date();
    let modoEdicionActivo = false;
    let idReservaSeleccionada = null;

    function apagarTodasLasVistas() {
        const vistaUsuarios = document.getElementById('vista-usuarios');
        
        [
            vistaInicio, 
            vistaPrecios, 
            vistaReservaciones, 
            vistaDetalleReserva, 
            vistaCrear, 
            vistaCalendarioGigante,
            vistaUsuarios
        ].forEach(v => {
            if (v) v.style.display = 'none';
        });
        
        [
            btnMenuInicio, 
            btnMenuPrecios, 
            btnMenuReservas, 
            btnMenuCrear, 
            btnMenuCalendarioReal,
            document.getElementById('btnMenuUsuarios')
        ].forEach(b => {
            if (b) b.classList.remove('activo');
        });
    }

    if (btnMenuInicio) {
        btnMenuInicio.addEventListener('click', (e) => {
            e.preventDefault();
            apagarTodasLasVistas();
            vistaInicio.style.display = 'block';
            btnMenuInicio.classList.add('activo');
            cargarEstadisticas();
            cargarAgendaSemanal();
        });
    }

    if (btnMenuPrecios) {
        btnMenuPrecios.addEventListener('click', (e) => {
            e.preventDefault();
            if (!usuarioTienePermiso('acceso_vista_configuraciones')) return mostrarAlerta("No tienes autorización para alterar los costos base.");
            
            apagarTodasLasVistas();
            vistaPrecios.style.display = 'block';
            btnMenuPrecios.classList.add('activo');
            cargarPreciosActuales();
        });
    }

    if (btnMenuReservas) {
        btnMenuReservas.addEventListener('click', (e) => {
            e.preventDefault();
            if (!usuarioTienePermiso('acceso_vista_reservas')) return mostrarAlerta("Módulo restringido por la administración.");
            
            apagarTodasLasVistas();
            vistaReservaciones.style.display = 'block';
            btnMenuReservas.classList.add('activo');
            cargarReservaciones();
        });
    }

    if (btnMenuCalendarioReal) {
        btnMenuCalendarioReal.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!usuarioTienePermiso('acceso_panel_maestro')) return mostrarAlerta("Calendario Maestro bloqueado.");
            
            apagarTodasLasVistas();
            if (vistaCalendarioGigante) vistaCalendarioGigante.style.display = 'block';
            btnMenuCalendarioReal.classList.add('activo');
            
            await descargarYClasificarFechas();
            renderCalendarioMaestroGeneral();
        });
    }

    // ========================================================
    // 7. CENTRAL DEL CALENDARIO MAESTRO GENERAL
    // ========================================================
    function renderCalendarioMaestroGeneral() {
        const grid = document.getElementById('calendarioGiganteGrid');
        const mesTexto = document.getElementById('mesGActual');
        const anioSubtitulo = document.getElementById('anioGSubtitulo');
        if (!grid) return;
        grid.innerHTML = '';

        const mes = fechaNavegacionG.getMonth();
        const anio = fechaNavegacionG.getFullYear();

        const mesesEspanol = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        if(mesTexto) mesTexto.textContent = mesesEspanol[mes];
        if(anioSubtitulo) anioSubtitulo.textContent = anio;

        const primerDiaMes = new Date(anio, mes, 1).getDay();
        const diasEnMes = new Date(anio, mes + 1, 0).getDate();

        const hoySistema = new Date();
        hoySistema.setHours(0,0,0,0);

        let celdasInyectadas = 0;

        for (let i = 0; i < primerDiaMes; i++) {
            const divVacio = document.createElement('div');
            divVacio.className = 'dia-bamboo-vacio';
            grid.appendChild(divVacio);
            celdasInyectadas++;
        }

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const celda = document.createElement('div');
            celda.className = 'dia-bamboo-celda';
            
            const numeroDia = document.createElement('strong');
            numeroDia.textContent = dia;
            celda.appendChild(numeroDia);

            const mesStr = String(mes + 1).padStart(2, '0');
            const diaStr = String(dia).padStart(2, '0');
            const fechaStringISO = `${anio}-${mesStr}-${diaStr}`;

            const fechaCell = new Date(anio, mes, dia);
            fechaCell.setHours(0,0,0,0);

            const reservaAsociada = listaReservasGlobal.find(r => r.fecha_evento && r.fecha_evento.substring(0, 10) === fechaStringISO && r.estado !== 'cancelada');

            if (fechaCell < hoySistema && reservaAsociada) {
                celda.classList.add('concluido');
                celda.innerHTML += `<span class="label-estado">Concluido</span>`;
                
                // CANDADO REAL: Solo interactivo si tiene permiso de acceso al panel maestro
                if (usuarioTienePermiso('acceso_panel_maestro')) {
                    celda.classList.add('interactivo');
                    celda.addEventListener('click', () => {
                        origenNavegacionDetalles = 'calendario';
                        window.verDetalle(reservaAsociada._id);
                    });
                }
            }
            else if (reservaAsociada) {
                if (reservaAsociada.estado === 'visita_agendada') {
                    celda.classList.add('visita');
                    celda.innerHTML += `<span class="label-estado">Visita</span>`;
                } else if (reservaAsociada.estado === 'concluido') {
                    celda.classList.add('concluido');
                    celda.innerHTML += `<span class="label-estado">Concluido</span>`;
                } else {
                    celda.classList.add('ocupado');
                    celda.innerHTML += `<span class="label-estado">Ocupado</span>`;
                }

                // CANDADO REAL: Solo interactivo si tiene permiso de acceso al panel maestro
                if (usuarioTienePermiso('acceso_panel_maestro')) {
                    celda.classList.add('interactivo');
                    celda.addEventListener('click', () => {
                        origenNavegacionDetalles = 'calendario';
                        window.verDetalle(reservaAsociada._id);
                    });
                }
            }
            else {
                celda.classList.add('disponible');
                celda.style.cursor = 'default';
            }

            grid.appendChild(celda);
            celdasInyectadas++;
        }

        const totalCeldasRequeridas = 42;
        while (celdasInyectadas < totalCeldasRequeridas) {
            const divRellenoFin = document.createElement('div');
            divRellenoFin.className = 'dia-bamboo-vacio';
            grid.appendChild(divRellenoFin);
            celdasInyectadas++;
        }
    }

    const btnGAnteriorReal = document.getElementById('btnGAnterior');
    const btnGSiguienteReal = document.getElementById('btnGSiguiente');

    if (btnGAnteriorReal) {
        btnGAnteriorReal.onclick = null;
        btnGAnteriorReal.addEventListener('click', (e) => {
            e.preventDefault();
            fechaNavegacionG.setDate(1);
            fechaNavegacionG.setMonth(fechaNavegacionG.getMonth() - 1);
            renderCalendarioMaestroGeneral();
        });
    }

    if (btnGSiguienteReal) {
        btnGSiguienteReal.onclick = null;
        btnGSiguienteReal.addEventListener('click', (e) => {
            e.preventDefault();
            fechaNavegacionG.setDate(1);
            fechaNavegacionG.setMonth(fechaNavegacionG.getMonth() + 1);
            renderCalendarioMaestroGeneral();
        });
    }

    // ========================================================
    // 8. GESTOR DE PRECIOS GLOBALES (CONFIG)
    // ========================================================
    async function cargarPreciosActuales() {
        try {
            const respuesta = await fetch(`${API_BASE_URL}/api/config`);
            if (respuesta.ok) {
                const config = await respuesta.json();
                document.getElementById('precio_p1_sem').value = config.precio_paquete1_semana || 0;
                document.getElementById('precio_p1_fin').value = config.precio_paquete1_fin || 0;
                document.getElementById('precio_p2_sem').value = config.precio_paquete2_semana || 0;
                document.getElementById('precio_p2_fin').value = config.precio_paquete2_fin || 0;
                document.getElementById('precio_p3_sem').value = config.precio_paquete3_semana || 0;
                document.getElementById('precio_p3_fin').value = config.precio_paquete3_fin || 0;
                document.getElementById('precio_p4_sem').value = config.precio_paquete4_semana || 0;
                document.getElementById('precio_p4_fin').value = config.precio_paquete4_fin || 0;
                document.getElementById('precio_hora').value = config.precio_hora_extra || 0;
                document.getElementById('precio_silla').value = config.precio_silla_extra || 0;
                document.getElementById('precio_mesa').value = config.precio_mesa_extra || 0;
                
                // CANDADO REAL: Si puede ver los precios pero no editarlos, congelamos los inputs
                const cambiarAtributosForm = !usuarioTienePermiso('modificar_precios_paquetes');
                formPrecios.querySelectorAll('input').forEach(inp => inp.disabled = cambiarAtributosForm);
                const btnSavePrecios = formPrecios.querySelector('button[type="submit"]');
                if(btnSavePrecios && cambiarAtributosForm) btnSavePrecios.remove();
            }  
        } catch (error) {
            console.error("Error al cargar los precios", error);
        }  
    }

    const formPrecios = document.getElementById('formPrecios');
    const mensajeConfig = document.getElementById('mensajeConfig');

    if (formPrecios) {
        formPrecios.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!usuarioTienePermiso('modificar_precios_paquetes')) return mostrarAlerta("Privilegios insuficientes para sobreescribir tarifas.");

            const nuevosPrecios = {
                precio_paquete1_semana: parseInt(document.getElementById('precio_p1_sem').value) || 0,
                precio_paquete1_fin: parseInt(document.getElementById('precio_p1_fin').value) || 0,
                precio_paquete2_semana: parseInt(document.getElementById('precio_p2_sem').value) || 0,
                precio_paquete2_fin: parseInt(document.getElementById('precio_p2_fin').value) || 0,
                precio_paquete3_semana: parseInt(document.getElementById('precio_p3_sem').value) || 0,
                precio_paquete3_fin: parseInt(document.getElementById('precio_p3_fin').value) || 0,
                precio_paquete4_semana: parseInt(document.getElementById('precio_p4_sem').value) || 0,
                precio_paquete4_fin: parseInt(document.getElementById('precio_p4_fin').value) || 0,
                precio_hora_extra: parseInt(document.getElementById('precio_hora').value) || 0,
                precio_silla_extra: parseInt(document.getElementById('precio_silla').value) || 0,
                precio_mesa_extra: parseInt(document.getElementById('precio_mesa').value) || 0
            };

            try {
                const respuesta = await fetch(`${API_BASE_URL}/api/config/actualizar`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(nuevosPrecios)
                });

                if (respuesta.ok) {
                    mensajeConfig.textContent = "Todos los precios base se han sincronizado con la base de datos.";
                    mensajeConfig.style.display = "block";
                    mensajeConfig.style.backgroundColor = "#D8F3DC"; 
                    mensajeConfig.style.color = "#1B4332"; 
                    setTimeout(() => mensajeConfig.style.display = "none", 3000);
                }  
            } catch (error) {
                console.error("Error al guardar precios", error);
            }  
        });
    }

    // ========================================================
    // 9. TABLA DE SOLICITUDES Y DETALLES MAESTRO-DETALLE
    // ========================================================
    const btnVolverReservas = document.getElementById('btnVolverReservas');
    const tablaReservasBody = document.getElementById('tablaReservasBody');
    let listaReservasGlobal = [];

    if (btnVolverReservas) {
        const nuevoBtnVolver = btnVolverReservas.cloneNode(true);
        btnVolverReservas.parentNode.replaceChild(nuevoBtnVolver, btnVolverReservas);
        
        nuevoBtnVolver.addEventListener('click', () => {
            const vistaDetailReserva = document.getElementById('vista-detalle-reserva');
            if (vistaDetailReserva) vistaDetailReserva.style.display = 'none';
            
            // ⚠️ AJUSTE: Si venimos del inicio, volvemos a mostrar el Inicio
            if (origenNavegacionDetalles === 'calendario') {
                if (vistaCalendarioGigante) vistaCalendarioGigante.style.display = 'block';
            } else if (origenNavegacionDetalles === 'inicio') {
                if (vistaInicio) vistaInicio.style.display = 'block'; // Regresa al tablero principal
            } else {
                if (vistaReservaciones) vistaReservaciones.style.display = 'block';
            }
        });
    }

    async function cargarReservaciones() {
        try {
            if (tablaReservasBody) {
                tablaReservasBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Cargando reservaciones...</td></tr>';
            }
            const respuesta = await fetch(`${API_BASE_URL}/api/reservas/todas`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (respuesta.ok) {
                listaReservasGlobal = await respuesta.json();
                mostrarTabla(listaReservasGlobal);
            } else {
                if (tablaReservasBody) {
                    tablaReservasBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Error al cargar datos del servidor.</td></tr>';
                }
            }
        } catch (error) {
            console.error("Error conectando con la base de datos:", error);
            if (tablaReservasBody) {
                tablaReservasBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Error de conexión. Revisa el servidor.</td></tr>';
            }
        }
    }

    function mostrarTabla(reservas) {
        if (!tablaReservasBody) return;
        tablaReservasBody.innerHTML = '';
        if (reservas.length === 0) {
            tablaReservasBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay reservaciones aún.</td></tr>';
            return;
        }

        // CANDADO INTEGRAL DE FILTRADO PARA CLIENTES: Un cliente común SOLO puede ver sus propias reservas
        let reservasAMostrar = reservas;
        if (usuarioLogueado.rol === 'cliente') {
            reservasAMostrar = reservas.filter(r => r.telefono === usuarioLogueado.telefono || r.correo === usuarioLogueado.correo);
        }

        reservasAMostrar.forEach((reserva) => {
            const fecha = reserva.fecha_evento ? new Date(reserva.fecha_evento).toLocaleDateString('es-MX', { timeZone: 'UTC' }) : 'Sin fecha';
            const nombre = reserva.nombre_cliente || 'Cliente sin registrar';
            const paquete = reserva.paquete || 'Ninguno';
            const estado = reserva.estado || 'en_carrito';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${fecha}</strong></td>
                <td>${nombre}</td>
                <td>${paquete}</td>
                <td><span class="badge ${estado}">${estado.replace('_', ' ')}</span></td>
                <td><button class="btn-ver-detalle" onclick="abrirDesdeTabla('${reserva._id}')">Ver Detalle</button></td>
            `;
            tablaReservasBody.appendChild(tr);
        });
    }

    window.abrirDesdeTabla = function(idReserva) {
        origenNavegacionDetalles = 'tabla';
        window.verDetalle(idReserva);
    };

    // ========================================================
    // PUENTE DE NAVEGACIÓN INTELIGENTE DESDE LA AGENDA DE INICIO
    // ========================================================
    window.abrirDesdeInicio = async function(idReserva) {
        origenNavegacionDetalles = 'inicio'; // Marcamos que venimos del inicio

        // 🔍 COMPROBACIÓN CRÍTICA: Si la lista global está vacía (al arrancar el sistema)
        // obligamos al script a descargarla de Atlas antes de continuar.
        if (!listaReservasGlobal || listaReservasGlobal.length === 0) {
            await cargarReservaciones();
        }

        // Verificamos que ahora sí exista en los registros locales
        const existeReserva = listaReservasGlobal.find(r => r._id === idReserva);
        
        if (!existeReserva) {
            mostrarAlerta("⚠️ No se pudo recuperar el expediente de esta reservación de la base de datos.");
            return;
        }

        // Si todo está en orden, hacemos la transición limpia de pantallas
        if (vistaInicio) vistaInicio.style.display = 'none'; // Apagamos el tablero principal
        window.verDetalle(idReserva); // Desplegamos la tarjeta de detalles real
    };

   window.verDetalle = function(idReserva) {
        idReservaSeleccionada = idReserva;
        modoEdicionActivo = false;       
        const btnMod = document.getElementById('btnModificar');
        if(btnMod) btnMod.textContent = "✏️ Modificar";

        const reserva = listaReservasGlobal.find(r => r._id === idReserva);
        if (reserva) {
            const fecha = reserva.fecha_evento ? new Date(reserva.fecha_evento).toLocaleDateString('es-MX', { timeZone: 'UTC' }) : 'Sin fecha';

            document.getElementById('detalleFolio').textContent = `Folio: ${reserva._id.substring(0, 8).toUpperCase()}`;
            if (document.getElementById('detCreadoPor')) {
    document.getElementById('detCreadoPor').textContent = reserva.creado_por || 'Cliente Web / Manual';
}
            document.getElementById('detNombre').textContent = reserva.nombre_cliente || 'Cliente sin registrar';
            document.getElementById('detCorreo').textContent = reserva.correo || 'No proporcionado';
            document.getElementById('detTelefono').textContent = reserva.telefono || 'No proporcionado';
            document.getElementById('detFecha').textContent = fecha;
            document.getElementById('detHorario').textContent = `${reserva.hora_inicio || '--:--'} a ${reserva.hora_fin || '--:--'}`;
            document.getElementById('detEstado').className = `badge ${reserva.estado || 'en_carrito'}`;
            document.getElementById('detEstado').textContent = (reserva.estado || 'Pendiente').replace('_', ' ');

            document.getElementById('detPaquete').textContent = reserva.paquete || 'Ninguno';
            document.getElementById('detHorasExtra').textContent = reserva.horas_extras || 0;
            document.getElementById('detSillas').textContent = reserva.sillas_adicionales || 0;
            document.getElementById('detMesas').textContent = reserva.mesas_adicionales || 0;
            
            // ⚠️ REPARADO: Pintamos las solicitudes mapeando tu ID real 'detdatos'
            const elementoNotas = document.getElementById('detdatos');
            if (elementoNotas) {
                elementoNotas.textContent = reserva.solicitudes_adicionales || 'Sin especificaciones o notas extras.';
            }

            // ✨ INTERCEPCIÓN QUIRÚRGICA: CAMBIO C
            const btnDescargar = document.getElementById('btnDescargarRecibo');
            const btnPurgar = document.getElementById('btnPurgarRecibo');

            if (btnDescargar && btnPurgar) {
                // Si la reserva tiene un PDF activo en el servidor, mostramos los controles
                if (reserva.recibo_url && reserva.recibo_url !== '') {
                    btnDescargar.style.display = 'inline-block';
                    btnPurgar.style.display = 'inline-block';
                    
                    btnDescargar.onclick = (e) => { e.preventDefault(); window.open(reserva.recibo_url, '_blank'); };
                    
                    btnPurgar.onclick = async (e) => {
                        e.preventDefault();
                        const confirmaPurga = await mostrarConfirmacion("¿Deseas purgar permanentemente el archivo PDF de este recibo? Esta acción se registrará en la bitácora.");
                        if (!confirmaPurga) return;

                        try {
                            const resPurga = await fetch(`${API_BASE_URL}/api/reservas/${idReservaSeleccionada}/recibo`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ usuario_accion: usuarioLogueado.nombre })
                            });
                            if (resPurga.ok) {
                                mostrarAlerta("El archivo físico del recibo ha sido eliminado del servidor.");
                                await cargarReservaciones();
                                window.verDetalle(idReservaSeleccionada);
                            }
                        } catch(err) { console.error(err); }
                    };
                } else {
                    btnDescargar.style.display = 'none';
                    btnPurgar.style.display = 'none';
                }
            }

            const totalPagar = reserva.total_calculado || 0;
            const pagado = reserva.anticipo_pagado || 0;
            const pendiente = totalPagar - pagado;

            const divResumenFinanciero = document.getElementById('detTotal').parentNode.parentNode; 
            if (!usuarioTienePermiso('acceso_modulo_pagos')) {
                if(divResumenFinanciero) divResumenFinanciero.style.display = 'none';
            } else {
                if(divResumenFinanciero) divResumenFinanciero.style.display = 'block';

                document.getElementById('detTotal').textContent = `$${totalPagar.toLocaleString('es-MX')} MXN`;
                document.getElementById('detPagado').textContent = `$${pagado.toLocaleString('es-MX')} MXN`;
                
                const elementoPendiente = document.getElementById('detPendiente');
                if (pendiente === 0) {
                    elementoPendiente.textContent = "✅ EVENTO PAGADO";
                    elementoPendiente.style.color = "#1B4332";
                    elementoPendiente.style.fontSize = "1.8rem";
                } else if (pendiente < 0) {
                    elementoPendiente.textContent = `Saldo a Favor: -$${Math.abs(pendiente).toLocaleString('es-MX')} MXN`;
                    elementoPendiente.style.color = "#2D6A4F";
                    elementoPendiente.style.fontSize = "1.8rem";
                } else {
                    elementoPendiente.textContent = `$${pendiente.toLocaleString('es-MX')} MXN`;
                    elementoPendiente.style.color = "#721C24";
                    elementoPendiente.style.fontSize = "2.5rem";
                }
            }

            if (!usuarioTienePermiso('editar_reservaciones')) { if(btnMod) btnMod.style.display = 'none'; } else { if(btnMod) btnMod.style.display = 'inline-block'; }
            if (!usuarioTienePermiso('eliminar_reservaciones')) { if(btnEliminarReservaReal) btnEliminarReservaReal.style.display = 'none'; } else { if(btnEliminarReservaReal) btnEliminarReservaReal.style.display = 'inline-block'; }

            const btnRegistrarPagoDetalle = document.getElementById('btnAbonar');
            if (btnRegistrarPagoDetalle) {
                if (!usuarioTienePermiso('registrar_pagos_anticipos')) {
                    btnRegistrarPagoDetalle.style.display = 'none';
                } else {
                    btnRegistrarPagoDetalle.style.display = 'inline-block';
                    const clonPagoBtn = btnRegistrarPagoDetalle.cloneNode(true);
                    btnRegistrarPagoDetalle.parentNode.replaceChild(clonPagoBtn, btnRegistrarPagoDetalle);

                    clonPagoBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const modalAnticipo = document.getElementById('modalAnticipo');
                        if (modalAnticipo) {
                            const txtDeuda = document.getElementById('textoDeuda');
                            if (txtDeuda) {
                                txtDeuda.innerHTML = `<strong>Cliente:</strong> ${reserva.nombre_cliente}<br><strong>Saldo Pendiente:</strong> $${pendiente.toLocaleString('es-MX')} MXN`;
                            }
                            const inputMonto = document.getElementById('inputMontoAnticipo');
                            if (inputMonto) {
                                inputMonto.value = '';
                                inputMonto.max = pendiente;
                            }
                            const errAnticipo = document.getElementById('errorAnticipo');
                            if (errAnticipo) errAnticipo.style.display = 'none';
                            modalAnticipo.style.display = 'flex';
                        }
                    });
                }
            }

            const btnConfirmarAnticipo = document.getElementById('btnConfirmarAnticipo');
            if (btnConfirmarAnticipo) {
                const clonConfirmarBtn = btnConfirmarAnticipo.cloneNode(true);
                btnConfirmarAnticipo.parentNode.replaceChild(clonConfirmarBtn, btnConfirmarAnticipo);

                clonConfirmarBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const inputMonto = document.getElementById('inputMontoAnticipo');
                    const errAnticipo = document.getElementById('errorAnticipo');
                    const montoAAbonar = parseFloat(inputMonto.value) || 0;

                    if (montoAAbonar <= 0) {
                        if (errAnticipo) {
                            errAnticipo.textContent = "⚠️ Ingresa una cantidad válida mayor a $0.";
                            errAnticipo.style.display = 'block';
                        }
                        return;
                    }
                    if (montoAAbonar > pendiente) {
                        if (errAnticipo) {
                            errAnticipo.textContent = `⚠️ Error: El monto excede la deuda. Solo faltan $${pendiente.toLocaleString('es-MX')} MXN para liquidar el evento.`;
                            errAnticipo.style.display = 'block';
                        }
                        return;
                    }

                    if (errAnticipo) errAnticipo.style.display = 'none';

                    try {
                        const respuesta = await fetch(`${API_BASE_URL}/api/reservas/${idReservaSeleccionada}/anticipo`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    // Sincronizado con los requerimientos de tu nuevo controlador del backend
    body: JSON.stringify({ 
        monto_adicional: montoAAbonar,
        tipo_cobro: document.getElementById('inputTipoCobroAnticipo').value,
        usuario_accion: usuarioLogueado.nombre
    })
                        });

                        const datosRespuesta = await respuesta.json();

                        if (respuesta.ok) {
                            const modalAnticipo = document.getElementById('modalAnticipo');
                            if (modalAnticipo) modalAnticipo.style.display = 'none';
                            mostrarAlerta(`¡Pago de $${montoAAbonar.toLocaleString('es-MX')} MXN registrado con éxito!`);
                            await cargarReservaciones();
                            window.verDetalle(idReservaSeleccionada);
                        } else {
                            if (errAnticipo) {
                                errAnticipo.textContent = `⚠️ ${datosRespuesta.mensaje || "Error al procesar el anticipo."}`;
                                errAnticipo.style.display = 'block';
                            }
                        }
                    } catch (error) {
                        console.error("Error inyectando cobro:", error);
                        if (errAnticipo) {
                            errAnticipo.textContent = "Error de comunicación. Revisa tu conexión con el servidor.";
                            errAnticipo.style.display = 'block';
                        }
                    }
                });
            }

            // --- REFACTORIZACIÓN SUPREMA DEL CLIC DE MODIFICACIONES ---
            const btnModificarReal = document.getElementById('btnModificar');
            if (btnModificarReal) {
                const nuevoBtnModificar = btnModificarReal.cloneNode(true);
                btnModificarReal.parentNode.replaceChild(nuevoBtnModificar, btnModificarReal);

                nuevoBtnModificar.addEventListener('click', async () => {
                    if (!usuarioTienePermiso('editar_reservaciones')) return mostrarAlerta("Acción prohibida para tu perfil de usuario.");

                    if (!modoEdicionActivo) {
                        const seConfirma = await mostrarConfirmacion("¿Deseas abrir los controles de modificación para esta reservación?");
                        if (!seConfirma) return;

                        modoEdicionActivo = true;
                        nuevoBtnModificar.textContent = "💾 Guardar Cambios";

                        convertirTextoAInput('detNombre', 'text');
                        convertirTextoAInput('detCorreo', 'email');
                        convertirTextoAInput('detTelefono', 'text');
                        const elHorasExtra = document.getElementById('detHorasExtra');
if (elHorasExtra) {
    const hrsActuales = parseInt(elHorasExtra.textContent) || 0;
    elHorasExtra.innerHTML = `
        <select id="input_detHorasExtra" class="editable-input">
            <option value="0" ${hrsActuales === 0 ? 'selected' : ''}>0 horas</option>
            <option value="1" ${hrsActuales === 1 ? 'selected' : ''}>1 hora extra</option>
            <option value="2" ${hrsActuales === 2 ? 'selected' : ''}>2 horas extras</option>
            <option value="3" ${hrsActuales === 3 ? 'selected' : ''}>3 horas extras</option>
        </select>`;
}
                        convertirTextoAInput('detSillas', 'number');
                        convertirTextoAInput('detMesas', 'number');

                        // ⚠️ REPARADO: Transformamos el id real de tu HTML 'detdatos' en el textarea editable
                        const elNotas = document.getElementById('detdatos');
                        if (elNotas) {
                            const valorActualNotas = (elNotas.textContent === 'Sin especificaciones o notas extras.') ? '' : elNotas.textContent;
                            elNotas.innerHTML = `<textarea id="input_detNotas" class="editable-input" style="width: 100%; height: 80px; font-family: inherit; padding: 6px; border: 1px solid #1A3626; border-radius: 4px; resize: vertical;">${valorActualNotas}</textarea>`;
                        }

                        const fechaFormat = reserva.fecha_evento ? reserva.fecha_evento.substring(0, 10) : '';
                        document.getElementById('detFecha').innerHTML = `<input type="date" id="input_detFecha" class="editable-input" value="${fechaFormat}">`;

                        document.getElementById('detHorario').innerHTML = `
                            <div style="display: flex; gap: 5px; align-items: center;">
                                <input type="time" id="input_detHoraInicio" class="editable-input" value="${reserva.hora_inicio || ''}"> a 
                                <input type="time" id="input_detHoraFin" class="editable-input" value="${reserva.hora_fin || ''}" readonly>
                            </div>`;

                        document.getElementById('detEstado').innerHTML = `
                            <select id="input_detEstado" class="editable-input">
                                <option value="en_carrito" ${reserva.estado === 'en_carrito' ? 'selected' : ''}>En Carrito</option>
                                <option value="visita_agendada" ${reserva.estado === 'visita_agendada' ? 'selected' : ''}>Visita Agendada</option>
                                <option value="pendiente_pago" ${reserva.estado === 'pendiente_pago' ? 'selected' : ''}>Pendiente de Pago</option>
                                <option value="confirmada" ${reserva.estado === 'confirmada' ? 'selected' : ''}>Confirmada</option>
                                ${usuarioTienePermiso('aprobar_cancelar_reservas') ? `
                                <option value="concluido" ${reserva.estado === 'concluido' ? 'selected' : ''}>Concluido</option>
                                <option value="cancelada" ${reserva.estado === 'cancelada' ? 'selected' : ''}>Cancelada</option>
                                ` : ''}
                            </select>`;

                        document.getElementById('detPaquete').innerHTML = `
                            <select id="input_detPaquete" class="editable-input">
                                <option value="Ninguno" ${reserva.paquete === 'Ninguno' ? 'selected' : ''}>Ninguno</option>
                                <option value="Paquete 1 (30 personas)" ${reserva.paquete === 'Paquete 1 (30 personas)' ? 'selected' : ''}>Paquete 1 (30 personas)</option>
                                <option value="Paquete 2 (50 personas)" ${reserva.paquete === 'Paquete 2 (50 personas)' ? 'selected' : ''}>Paquete 2 (50 personas)</option>
                                <option value="Paquete 3 (70 personas)" ${reserva.paquete === 'Paquete 3 (70 personas)' ? 'selected' : ''}>Paquete 3 (70 personas)</option>
                                <option value="Paquete 4 (100 personas)" ${reserva.paquete === 'Paquete 4 (100 personas)' ? 'selected' : ''}>Paquete 4 (100 personas)</option>
                            </select>`;

                        ['input_detFecha', 'input_detPaquete', 'input_detHorasExtra', 'input_detSillas', 'input_detMesas'].forEach(id => {
                            const el = document.getElementById(id);
                            if(el) {
                                el.addEventListener('input', recalcularPrecioEdicionEnVivo);
                                el.addEventListener('change', recalcularPrecioEdicionEnVivo);
                            }
                        });

                        const inHora = document.getElementById('input_detHoraInicio');
                        const inHorasEx = document.getElementById('input_detHorasExtra');
                        if (inHora) inHora.addEventListener('input', sincronizarHoraSalidaEdicion);
                        if (inHorasEx) inHorasEx.addEventListener('input', sincronizarHoraSalidaEdicion);

                    } else {
    // Desplegamos la consulta de acción al operador
    const quiereRegenerar = await mostrarConfirmacion("¿Deseas guardar los cambios y REGENERAR el recibo PDF con los nuevos parámetros monetarios?");
    
    const motivoRedactado = await solicitarMotivoChangeSistema();
    if (motivoRedactado === null) return;

    const totalFinalCalculado = await recalcularPrecioEdicionEnVivo();
    const txtAreaNotas = document.getElementById('input_detNotas') || document.getElementById('input_detSolicitudes');

    const payloadActualizado = {
        nombre_cliente: document.getElementById('input_detNombre').value,
        correo: document.getElementById('input_detCorreo').value,
        telefono: document.getElementById('input_detTelefono').value,
        fecha_evento: document.getElementById('input_detFecha').value,
        hora_inicio: document.getElementById('input_detHoraInicio').value,
        hora_fin: document.getElementById('input_detHoraFin').value,
        estado: document.getElementById('input_detEstado').value,
        paquete: document.getElementById('input_detPaquete').value,
        horas_extras: parseInt(document.getElementById('input_detHorasExtra').value) || 0,
        sillas_adicionales: parseInt(document.getElementById('input_detSillas').value) || 0,
        mesas_adicionales: parseInt(document.getElementById('input_detMesas').value) || 0,
        solicitudes_adicionales: txtAreaNotas ? txtAreaNotas.value.trim() : '', 
        total_calculado: totalFinalCalculado,
        motivo_modificacion: motivoRedactado,
        usuario_accion: usuarioLogueado.nombre,
        // 🚩 PALANCA CRÍTICA DEL BACKEND: Determina si se destruye el PDF viejo y se compila uno nuevo
        regenerar_recibo: quiereRegenerar 
    };

    try {
        const respuesta = await fetch(`${API_BASE_URL}/api/reservas/${idReservaSeleccionada}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payloadActualizado)
        });

        if (respuesta.ok) {
            mostrarAlerta(quiereRegenerar ? "¡Reservación y recibo digital actualizados con éxito!" : "¡Modificaciones guardadas en la bitácora de auditoría!");
            modoEdicionActivo = false;
            nuevoBtnModificar.textContent = "✏️ Modificar";
            
            await cargarReservaciones();
            window.verDetalle(idReservaSeleccionada);
        } else {
            mostrarAlerta("Error al intentar actualizar la reservación.");
        }
    } catch (error) {
        mostrarAlerta("Error de comunicación con el servidor.");
    }
}
                });
            }

            const btnCerrarModal = document.getElementById('btnCerrarModal');
            if (btnCerrarModal) {
                btnCerrarModal.onclick = (e) => {
                    e.preventDefault();
                    const modalAnticipo = document.getElementById('modalAnticipo');
                    if (modalAnticipo) modalAnticipo.style.display = 'none';
                };
            }

            const logContenedor = document.getElementById('contenedorListaHistorial');
            if (!usuarioTienePermiso('aprobar_cancelar_reservas')) {
                if(logContenedor) logContenedor.innerHTML = `<p style="color:#721C24; font-style:italic;">No cuentas con los privilegios de auditoría para examinar este registro.</p>`;
            } else {
                pintarHistorialEnDetalles(reserva);
            }

            if (vistaReservaciones) vistaReservaciones.style.display = 'none';
            if (vistaCalendarioGigante) vistaCalendarioGigante.style.display = 'none';
            if (vistaDetalleReserva) vistaDetalleReserva.style.display = 'block';
        }
    };

    function pintarHistorialEnDetalles(reserva) {
        const contenedor = document.getElementById('contenedorListaHistorial');
        if (!contenedor) return;
        contenedor.innerHTML = '';

        if (!reserva.historial_modificaciones || reserva.historial_modificaciones.length === 0) {
            contenedor.innerHTML = `<p style="color: #8C8A85; font-style: italic;">No se registran modificaciones en esta reservación.</p>`;
            return;
        }

        const listaInvertida = [...reserva.historial_modificaciones].reverse();

        listaInvertida.forEach(cambio => {
            const fechaLegible = new Date(cambio.fecha_change || cambio.fecha_cambio).toLocaleDateString('es-MX', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const card = document.createElement('div');
            card.className = 'ticket-cambio-card';
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:700; color:#1A3626;">
                    <span>👤 Modificado por: ${cambio.usuario}</span>
                    <span style="color:#8C8A85; font-size:0.75rem;">📅 ${fechaLegible}</span>
                </div>
                <div style="margin-bottom:4px;"><strong>Motivo:</strong> <span style="color:#52796F;">${cambio.motivo}</span></div>
                <div style="font-size:0.8rem; color:#6E6C68; border-top:1px dashed #EAE6DF; padding-top:4px;"><strong>Cambios:</strong> ${cambio.detalles}</div>
            `;
            contenedor.appendChild(card);
        });
    }

    // ========================================================
    // 10. CREACIÓN DE RESERVAS Y VISITAS POR PASOS CON COTIZADOR
    // ========================================================
    const crearPaso1 = document.getElementById('crear-paso1');
    const crearPaso2 = document.getElementById('crear-paso2');
    const crearPaso3 = document.getElementById('crear-paso3');
    const btnContinuarCalendario = document.getElementById('btnContinuarCalendario');
    const btnRegresarPaso1 = document.getElementById('btnRegresarPaso1');
    const btnContinuarPaso3 = document.getElementById('btnContinuarPaso3');
    const btnRegresarPaso2 = document.getElementById('btnRegresarPaso2');

    // Elementos del Motor de Modos (Reserva / Visita)
    const btnModoReserva = document.getElementById('btnModoReserva');
    const btnModoVisita = document.getElementById('btnModoVisita');
    const grupoHoraVisita = document.getElementById('grupoHoraVisita');
    const grupoNotasVisita = document.getElementById('grupoNotasVisita');
    const btnGuardarNuevaVisita = document.getElementById('btnGuardarNuevaVisita');
    const tituloPaso1 = document.getElementById('tituloPaso1');
    const tituloPaso2 = document.getElementById('tituloPaso2');

    let tipoCreacionActivo = 'reserva'; 
    let fechaSeleccionada = null;
    let fechaNavegacion = new Date();
    let mapaEventosFechas = {};

    let horasExtrasGlobalCrear = 0;
    let sillasExtrasGlobalCrear = 0;
    let mesasExtrasGlobalCrear = 0;

    // --- INTERRUPTORES DE MODO (RESERVA VS VISITA) ---
    if (btnModoReserva) {
        btnModoReserva.addEventListener('click', (e) => {
            e.preventDefault();
            tipoCreacionActivo = 'reserva';
            btnModoReserva.className = 'btn-accion activo';
            btnModoVisita.className = 'btn-volver';
            btnModoVisita.style.borderColor = '#8C8A85';
            
            tituloPaso1.textContent = "Paso 1: Datos del Cliente";
            tituloPaso2.textContent = "Paso 2: Selecciona la Fecha";
            if(grupoHoraVisita) grupoHoraVisita.style.display = 'none';
            if(grupoNotasVisita) grupoNotasVisita.style.display = 'none';
        });
    }

    if (btnModoVisita) {
        btnModoVisita.addEventListener('click', (e) => {
            e.preventDefault();
            tipoCreacionActivo = 'visita';
            btnModoVisita.className = 'btn-accion activo';
            btnModoReserva.className = 'btn-volver';
            btnModoReserva.style.borderColor = '#8C8A85';

            tituloPaso1.textContent = "Paso 1: Datos y Horario de la Visita";
            tituloPaso2.textContent = "Paso 2: Selecciona la Fecha de la Visita";
            if(grupoHoraVisita) grupoHoraVisita.style.display = 'inline-block';
            if(grupoNotasVisita) grupoNotasVisita.style.display = 'inline-block';
        });
    }

    if (btnMenuCrear) {
        btnMenuCrear.addEventListener('click', (e) => {
            e.preventDefault();
            if (!usuarioTienePermiso('crear_nueva_reserva')) return mostrarAlerta("No tienes permisos de cotización.");
            
            apagarTodasLasVistas();
            if (vistaCrear) vistaCrear.style.display = 'block';
            if (crearPaso1) crearPaso1.style.display = 'block';
            if (crearPaso2) crearPaso2.style.display = 'none';
            if (crearPaso3) crearPaso3.style.display = 'none';
            btnMenuCrear.classList.add('activo');

            if(btnModoReserva) btnModoReserva.click();
        });
    }

    async function descargarYClasificarFechas() {
        try {
            const respuesta = await fetch(`${API_BASE_URL}/api/reservas/todas`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (respuesta.ok) {
                listaReservasGlobal = await respuesta.json();
                mapaEventosFechas = {};

                listaReservasGlobal.forEach(reserva => {
                    if (reserva.fecha_evento) {
                        const ISOFecha = reserva.fecha_evento.substring(0, 10);
                        if (reserva.estado === 'visita_agendada') {
                            mapaEventosFechas[ISOFecha] = 'visita';
                        } else if (reserva.estado !== 'cancelada') {
                            mapaEventosFechas[ISOFecha] = 'ocupado';
                        }
                    }
                });
            }
        } catch (error) {
            console.error("Error al sincronizar mapa de estados de fechas:", error);
        }
    }

    function dibujarCalendarioVisual() {
        const grid = document.getElementById('calendarioGrid');
        const mesTexto = document.getElementById('mesAnioActual');
        const anioSubtitulo = document.getElementById('anioSubtitulo');
        if(!grid) return;
        grid.innerHTML = '';

        const mes = fechaNavegacion.getMonth();
        const anio = fechaNavegacion.getFullYear();

        if (mesTexto) mesTexto.textContent = fechaNavegacion.toLocaleDateString('es-MX', { month: 'long' });
        if (anioSubtitulo) anioSubtitulo.textContent = anio;

        const primerDiaMes = new Date(anio, mes, 1).getDay();
        const diasEnMes = new Date(anio, mes + 1, 0).getDate();

        const hoySistema = new Date();
        hoySistema.setHours(0,0,0,0);

        let celdasInyectadas = 0;

        for (let i = 0; i < primerDiaMes; i++) {
            const divVacio = document.createElement('div');
            divVacio.className = 'dia-bamboo-vacio';
            grid.appendChild(divVacio);
            celdasInyectadas++;
        }

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const celda = document.createElement('div');
            celda.className = 'dia-bamboo-celda';
            
            const numeroDia = document.createElement('strong');
            numeroDia.textContent = dia;
            celda.appendChild(numeroDia);

            const mesStr = String(mes + 1).padStart(2, '0');
            const diaStr = String(dia).padStart(2, '0');
            const fechaStringISO = `${anio}-${mesStr}-${diaStr}`;

            const fechaCelda = new Date(anio, mes, dia);
            fechaCelda.setHours(0,0,0,0);

            const estadoDia = mapaEventosFechas[fechaStringISO];

            if (fechaCelda < hoySistema) {
                celda.classList.add('pasado');
                celda.classList.add('no-clickable');
            } 
            else if (estadoDia === 'ocupado') {
                celda.classList.add('ocupado');
                celda.innerHTML += `<span class="label-estado">Ocupado</span>`;
                celda.classList.add('no-clickable');
            } else if (estadoDia === 'visita') {
                celda.classList.add('visita');
                celda.innerHTML += `<span class="label-estado">Visita</span>`;
                celda.classList.add('no-clickable');
            } else {
                celda.classList.add('disponible');
                if (fechaSeleccionada === fechaStringISO) {
                    celda.classList.add('seleccionado-bamboo');
                }

                celda.addEventListener('click', () => {
                    fechaSeleccionada = fechaStringISO;
                    const ft = document.getElementById('fechaSeleccionadaTexto');
                    if (ft) ft.textContent = `Fecha Seleccionada: ${fechaStringISO}`;
                    dibujarCalendarioVisual();
                });
            }
            grid.appendChild(celda);
            celdasInyectadas++;
        }

        const totalCeldasRequeridas = 42;
        while (celdasInyectadas < totalCeldasRequeridas) {
            const divRellenoFin = document.createElement('div');
            divRellenoFin.className = 'dia-bamboo-vacio';
            grid.appendChild(divRellenoFin);
            celdasInyectadas++;
        }
    }

    const btnMesAnterior = document.getElementById('btnMesAnterior');
    if (btnMesAnterior) {
        btnMesAnterior.addEventListener('click', () => {
            fechaNavegacion.setMonth(fechaNavegacion.getMonth() - 1);
            dibujarCalendarioVisual();
        });
    }
    
    const btnMesSiguiente = document.getElementById('btnMesSiguiente');
    if (btnMesSiguiente) {
        btnMesSiguiente.addEventListener('click', () => {
            fechaNavegacion.setMonth(fechaNavegacion.getMonth() + 1);
            dibujarCalendarioVisual();
        });
    }

    if (btnContinuarCalendario) {
        btnContinuarCalendario.addEventListener('click', async () => {
            const nombre = document.getElementById('nuevoNombre').value;
            const telefono = document.getElementById('nuevoTelefono').value;
            if (!nombre || !telefono) return mostrarAlerta("Nombre y Teléfono son obligatorios.");
            
            if (tipoCreacionActivo === 'visita') {
                const horaVisita = document.getElementById('nuevaHoraVisita').value;
                if (!horaVisita) return mostrarAlerta("Debes seleccionar una hora para la asistencia de la visita.");
            }

            await descargarYClasificarFechas();
            if (crearPaso1) crearPaso1.style.display = 'none';
            if (crearPaso2) crearPaso2.style.display = 'block';
            dibujarCalendarioVisual();

            // ⚠️ ADICIÓN CRÍTICA: Forzamos la actualización visual de los botones basándonos en el DOM real
            const liveBtnContinuarPaso3 = document.getElementById('btnContinuarPaso3');
            const liveBtnGuardarNuevaVisita = document.getElementById('btnGuardarNuevaVisita');
            
            if (tipoCreacionActivo === 'visita') {
                if (liveBtnContinuarPaso3) liveBtnContinuarPaso3.style.display = 'none';
                if (liveBtnGuardarNuevaVisita) liveBtnGuardarNuevaVisita.style.display = 'inline-block';
            } else {
                if (liveBtnContinuarPaso3) liveBtnContinuarPaso3.style.display = 'inline-block';
                if (liveBtnGuardarNuevaVisita) liveBtnGuardarNuevaVisita.style.display = 'none';
            }
        });
    }

    if (btnRegresarPaso1) {
        btnRegresarPaso1.addEventListener('click', () => {
            if (crearPaso2) crearPaso2.style.display = 'none';
            if (crearPaso1) crearPaso1.style.display = 'block';
        });
    }

    if (btnContinuarPaso3) {
        btnContinuarPaso3.addEventListener('click', () => {
            if (!fechaSeleccionada) return mostrarAlerta("Debes seleccionar una fecha disponible en el calendario.");
            const partes = fechaSeleccionada.split('-');
            const fSel = document.getElementById('fechaSeleccionadaPaso3');
            if (fSel) fSel.textContent = `${partes[2]} / ${partes[1]} / ${partes[0]}`;
            if (crearPaso2) crearPaso2.style.display = 'none';
            if (crearPaso3) crearPaso3.style.display = 'block';
            
            const inputAnticipo = document.getElementById('nuevoAnticipo');
            if(inputAnticipo && !usuarioTienePermiso('registrar_pagos_anticipos')) {
                inputAnticipo.value = 0;
                inputAnticipo.disabled = true;
            }
            
            calcularPrecioEnVivoCrear();
        });
    }

    if (btnRegresarPaso2) {
        btnRegresarPaso2.addEventListener('click', () => {
            if (crearPaso3) crearPaso3.style.display = 'none';
            if (crearPaso2) crearPaso2.style.display = 'block';
        });
    }

    // --- COTIZADOR EN VIVO RESERVAS ---
    async function calcularPrecioEnVivoCrear() {
        let configPrecios = {};
        try {
            const resp = await fetch(`${API_BASE_URL}/api/config`);
            if(resp.ok) {
                const data = await resp.json();
                configPrecios = Array.isArray(data) ? (data[0] || {}) : data;
            }
        } catch(e) {}

        const getPrecio = (campo) => Number(configPrecios[campo]) || 0;
        const paqueteInput = document.getElementById('nuevoPaquete').value;
        
        let horasInput = parseInt(document.getElementById('nuevasHoras').value) || 0;
        if (horasInput > 3) { horasInput = 3; document.getElementById('nuevasHoras').value = 3; }
        if (horasInput < 0) { horasInput = 0; document.getElementById('nuevasHoras').value = 0; }
        
        const sillasInput = Math.max(0, parseInt(document.getElementById('nuevasSillas').value) || 0);
        const mesasInput = Math.max(0, parseInt(document.getElementById('nuevasMesas').value) || 0);

        horasExtrasGlobalCrear = horasInput;
        sillasExtrasGlobalCrear = sillasInput;
        mesasExtrasGlobalCrear = mesasInput;

        const horaInicioInput = document.getElementById('nuevaHoraInicio').value;
        const horaFinElemento = document.getElementById('nuevaHoraFin');

        if (horaInicioInput && horaFinElemento) {
            let [horas, minutos] = horaInicioInput.split(':').map(Number);
            let totalHorasASumar = 8 + horasInput;
            let nuevasHorasFinales = (horas + totalHorasASumar) % 24;
            
            horaFinElemento.value = `${String(nuevasHorasFinales).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
            horaFinElemento.readOnly = true; 
        }

        let totalEstimado = 0;
        if (fechaSeleccionada) {
            const partesFecha = fechaSeleccionada.split('-');
            const fechaObj = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);
            const diaSemana = fechaObj.getDay();
            const esFinDeSemana = (diaSemana === 0 || diaSemana === 5 || diaSemana === 6);

            if (paqueteInput.includes('Paquete 1')) {
                totalEstimado += esFinDeSemana ? getPrecio('precio_paquete1_fin') : getPrecio('precio_paquete1_semana');
            } else if (paqueteInput.includes('Paquete 2')) {
                totalEstimado += esFinDeSemana ? getPrecio('precio_paquete2_fin') : getPrecio('precio_paquete2_semana');
            } else if (paqueteInput.includes('Paquete 3')) {
                totalEstimado += esFinDeSemana ? getPrecio('precio_paquete3_fin') : getPrecio('precio_paquete3_semana');
            } else if (paqueteInput.includes('Paquete 4')) {
                totalEstimado += esFinDeSemana ? getPrecio('precio_paquete4_fin') : getPrecio('precio_paquete4_semana');
            }
        }

        totalEstimado += (horasInput * getPrecio('precio_hora_extra'));
        totalEstimado += (sillasInput * getPrecio('precio_silla_extra'));
        totalEstimado += (mesasInput * getPrecio('precio_mesa_extra'));

        const tEnVivo = document.getElementById('totalEnVivoCrear');
        if (tEnVivo) tEnVivo.textContent = `$${totalEstimado.toLocaleString('es-MX')} MXN`;
        return totalEstimado;
    }

    const inputHoraInicioReal = document.getElementById('nuevaHoraInicio');
    if (inputHoraInicioReal) {
        inputHoraInicioReal.addEventListener('input', () => {
            if (fechaSeleccionada) {
                calcularPrecioEnVivoCrear();
            }
        });
    }

    ['nuevoPaquete', 'nuevasHoras', 'nuevasSillas', 'nuevasMesas'].forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.addEventListener('input', calcularPrecioEnVivoCrear);
            inputElement.addEventListener('change', calcularPrecioEnVivoCrear);
        }
    });

    // ✨ INTERCEPCIÓN QUIRÚRGICA: CAMBIO A
    const inputAnticipoCrear = document.getElementById('nuevoAnticipo');
    if (inputAnticipoCrear) {
        inputAnticipoCrear.addEventListener('input', () => {
            const monto = parseFloat(inputAnticipoCrear.value) || 0;
            const grupoCobro = document.getElementById('grupoTipoCobro');
            if (grupoCobro) {
                grupoCobro.style.display = (monto > 0) ? 'block' : 'none';
            }
        });
    }

    // --- ACCIÓN: GUARDAR RESERVACIÓN (PASO 3 MODAL RESERVA) ---
    const btnGuardarNuevaReservaReal = document.getElementById('btnGuardarNuevaReserva');
    if(btnGuardarNuevaReservaReal) {
        const clonBtn = btnGuardarNuevaReservaReal.cloneNode(true);
        btnGuardarNuevaReservaReal.parentNode.replaceChild(clonBtn, btnGuardarNuevaReservaReal);

        clonBtn.addEventListener('click', async () => {
            const horaInicio = document.getElementById('nuevaHoraInicio').value;
            const horaFin = document.getElementById('nuevaHoraFin').value;
            const paqueteInput = document.getElementById('nuevoPaquete').value;
            const anticipoInput = usuarioTienePermiso('registrar_pagos_anticipos') ? (parseFloat(document.getElementById('nuevoAnticipo').value) || 0) : 0;

            if (!horaInicio || !horaFin) return mostrarAlerta("Establece un horario válido.");
            if (paqueteInput === 'Ninguno') return mostrarAlerta("Es obligatorio elegir un paquete para continuar.");

            const totalFinal = await calcularPrecioEnVivoCrear();
            if(anticipoInput > totalFinal) return mostrarAlerta(`El anticipo ($${anticipoInput}) no puede superar al total ($${totalFinal}).`);

            let estadoInicial = 'en_carrito';
            if (anticipoInput > 0 && anticipoInput < totalFinal) estadoInicial = 'pendiente_pago';
            else if (anticipoInput === totalFinal && totalFinal > 0) estadoInicial = 'confirmada';

            const inputNotasHTML = document.getElementById('nuevasSolicitudes');

            const payload = {
                tipo_solicitud: "reserva",
                nombre_cliente: document.getElementById('nuevoNombre').value,
                correo: document.getElementById('nuevoCorreo').value || "No proporcionado",
                telefono: document.getElementById('nuevoTelefono').value,
                fecha_evento: fechaSeleccionada,
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                paquete: paqueteInput,
                horas_extras: horasExtrasGlobalCrear,
                sillas_adicionales: sillasExtrasGlobalCrear,
                mesas_adicionales: mesasExtrasGlobalCrear,
                anticipo_pagado: anticipoInput,
                total_calculado: totalFinal,
                estado: estadoInicial,
                tipo_cobro: (anticipoInput > 0) ? document.getElementById('nuevoTipoCobro').value : 'ninguno',
                solicitudes_adicionales: inputNotasHTML ? inputNotasHTML.value.trim() : "",
                creado_por: usuarioLogueado.nombre
            };

            await ejecutarPeticionGuardadoGlobal(payload, "Reservación agendada con éxito!");
        });
    }

    // --- ACCIÓN EXCLUSIVA: COMPLETAR AGENDA DE VISITA (PASO 2 DIRECTO) ---
    if(btnGuardarNuevaVisita) {
        const clonVisitaBtn = btnGuardarNuevaVisita.cloneNode(true);
        btnGuardarNuevaVisita.parentNode.replaceChild(clonVisitaBtn, btnGuardarNuevaVisita);

        clonVisitaBtn.addEventListener('click', async () => {
            if (!fechaSeleccionada) return mostrarAlerta("Debes seleccionar una fecha para la visita en el calendario.");
            
            const horaVisita = document.getElementById('nuevaHoraVisita').value;
            const txtNotasVisita = document.getElementById('nuevasNotasVisita');

            const payloadVisita = {
                tipo_solicitud: "visita",
                nombre_cliente: document.getElementById('nuevoNombre').value,
                telefono: document.getElementById('nuevoTelefono').value,
                correo: document.getElementById('nuevoCorreo').value || "No proporcionado",
                fecha_evento: fechaSeleccionada,
                hora_inicio: horaVisita,
                hora_fin: horaVisita, 
                paquete: "Ninguno",
                horas_extras: 0,
                sillas_adicionales: 0,
                mesas_adicionales: 0,
                anticipo_pagado: 0,
                total_calculado: 0,
                estado: "visita_agendada" 
            };

            await ejecutarPeticionGuardadoGlobal(payloadVisita, "Cita de visita al salón agendada con éxito!");
        });
    }

    // Función auxiliar para compactar el guardado de ambas vías
    async function ejecutarPeticionGuardadoGlobal(datosPayload, mensajeExito) {
        try {
            const respuesta = await fetch(`${API_BASE_URL}/api/reservas/nueva`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(datosPayload)
            });

            if (respuesta.ok) {
                mostrarAlerta(mensajeExito);
                
                document.getElementById('nuevoNombre').value = '';
                document.getElementById('nuevoTelefono').value = '';
                document.getElementById('nuevoCorreo').value = '';
                document.getElementById('nuevaHoraVisita').value = '16:00';
                if(document.getElementById('nuevasNotasVisita')) document.getElementById('nuevasNotasVisita').value = '';
                
                horasExtrasGlobalCrear = 0;
                sillasExtrasGlobalCrear = 0;
                mesasExtrasGlobalCrear = 0;
                fechaSeleccionada = null;
                
                apagarTodasLasVistas();
                if (vistaReservaciones) vistaReservaciones.style.display = 'block';
                if (btnMenuReservas) btnMenuReservas.classList.add('activo');
                cargarReservaciones();
            } else { 
                mostrarAlerta("Error al intentar procesar la solicitud en el servidor."); 
            }
        } catch (error) { 
            mostrarAlerta("Error de comunicación con el servidor."); 
        }
    }

    // ========================================================
    // 11. LOGICA DE EDICIÓN Y AUDITORÍA RECALCULADA
    // ========================================================
    async function recalcularPrecioEdicionEnVivo() {
        if (!modoEdicionActivo) return 0;

        let configPrecios = {};
        try {
            const respPrecios = await fetch(`${API_BASE_URL}/api/config`);
            if(respPrecios.ok) {
                const data = await respPrecios.json();
                configPrecios = Array.isArray(data) ? (data[0] || {}) : data;
            }
        } catch(e) {}

        const getPrecio = (campo) => Number(configPrecios[campo]) || 0;

        const fechaInput = document.getElementById('input_detFecha').value;
        const paqueteInput = document.getElementById('input_detPaquete').value;
        const horasInput = parseInt(document.getElementById('input_detHorasExtra').value) || 0;
        const sillasInput = parseInt(document.getElementById('input_detSillas').value) || 0;
        const mesasInput = parseInt(document.getElementById('input_detMesas').value) || 0;

        let nuevoTotal = 0;
        let esFinDeSemana = false;
        
        if (fechaInput) {
            const partesFecha = fechaInput.split('-');
            const fechaObj = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);
            const diaSemana = fechaObj.getDay();
            esFinDeSemana = (diaSemana === 0 || diaSemana === 5 || diaSemana === 6);
        }

        if (paqueteInput.includes('Paquete 1')) nuevoTotal += esFinDeSemana ? getPrecio('precio_paquete1_fin') : getPrecio('precio_paquete1_semana');
        else if (paqueteInput.includes('Paquete 2')) nuevoTotal += esFinDeSemana ? getPrecio('precio_paquete2_fin') : getPrecio('precio_paquete2_semana');
        else if (paqueteInput.includes('Paquete 3')) nuevoTotal += esFinDeSemana ? getPrecio('precio_paquete3_fin') : getPrecio('precio_paquete3_semana');
        else if (paqueteInput.includes('Paquete 4')) nuevoTotal += esFinDeSemana ? getPrecio('precio_paquete4_fin') : getPrecio('precio_paquete4_semana');

        nuevoTotal += (horasInput * getPrecio('precio_hora_extra'));
        nuevoTotal += (sillasInput * getPrecio('precio_silla_extra'));
        nuevoTotal += (mesasInput * getPrecio('precio_mesa_extra'));

        const dTotal = document.getElementById('detTotal');
        if (dTotal && usuarioTienePermiso('acceso_modulo_pagos')) {
            dTotal.textContent = `$${nuevoTotal.toLocaleString('es-MX')} MXN`;
        }
        return nuevoTotal;
    }

    function solicitarMotivoChangeSistema() {
        return new Promise((resolve) => {
            const modalMotivo = document.getElementById('modalMotivoChange') || document.getElementById('modalMotivoCambio');
            const txtInput = document.getElementById('txtMotivoCambioInput');
            const btnAceptar = document.getElementById('btnAceptarMotivo');
            const btnCancelar = document.getElementById('btnCancelarMotivo');

            if(!modalMotivo) {
                resolve("Actualización de rutina de parámetros del evento.");
                return;
            }

            if (txtInput) txtInput.value = '';
            modalMotivo.style.display = 'flex';

            if (btnCancelar) {
                btnCancelar.onclick = () => {
                    modalMotivo.style.display = 'none';
                    resolve(null);
                };
            }

            if (btnAceptar) {
                btnAceptar.onclick = () => {
                    const explicacion = txtInput ? txtInput.value.trim() : "";
                    modalMotivo.style.display = 'none';
                    resolve(explicacion || "Actualización de rutina de parámetros del evento.");
                };
            }
        });
    }

    const btnModificarReal = document.getElementById('btnModificar');
    if(btnModificarReal) {
        const nuevoBtnModificar = btnModificarReal.cloneNode(true);
        btnModificarReal.parentNode.replaceChild(nuevoBtnModificar, btnModificarReal);

        function sincronizarHoraSalidaEdicion() {
            const horaInicioInput = document.getElementById('input_detHoraInicio');
            const horasExtrasInput = document.getElementById('input_detHorasExtra');
            const horaFinInput = document.getElementById('input_detHoraFin');

            if (horaInicioInput && horaFinInput) {
                const horaInicio = horaInicioInput.value;
                if (!horaInicio) return;

                let [horas, minutos] = horaInicio.split(':').map(Number);
                let horasExtras = horasExtrasInput ? (parseInt(horasExtrasInput.value) || 0) : 0;
                
                if (horasExtras > 3) { horasExtras = 3; if(horasExtrasInput) horasExtrasInput.value = 3; }
                if (horasExtras < 0) { horasExtras = 0; if(horasExtrasInput) horasExtrasInput.value = 0; }

                let totalHoras = 8 + horasExtras;
                let nuevaHoraFin = (horas + totalHoras) % 24;

                horaFinInput.value = `${String(nuevaHoraFin).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
            }
        }

        nuevoBtnModificar.addEventListener('click', async () => {
            if (!usuarioTienePermiso('editar_reservaciones')) return mostrarAlerta("Acción prohibida para tu perfil de usuario.");

            const reserva = listaReservasGlobal.find(r => r._id === idReservaSeleccionada);

            if (!modoEdicionActivo) {
                const seConfirma = await mostrarConfirmacion("¿Estás seguro de que deseas abrir los controles de modificación para esta reservación?");
                if (!seConfirma) return;

                modoEdicionActivo = true;
                nuevoBtnModificar.textContent = "💾 Guardar Cambios";

                convertirTextoAInput('detNombre', 'text');
                convertirTextoAInput('detCorreo', 'email');
                convertirTextoAInput('detTelefono', 'text');
                convertirTextoAInput('detHorasExtra', 'number');
                convertirTextoAInput('detSillas', 'number');
                convertirTextoAInput('detMesas', 'number');

                const fechaFormat = reserva.fecha_evento ? reserva.fecha_evento.substring(0, 10) : '';
                document.getElementById('detFecha').innerHTML = `<input type="date" id="input_detFecha" class="editable-input" value="${fechaFormat}">`;

                document.getElementById('detHorario').innerHTML = `
                    <div style="display: flex; gap: 5px; align-items: center;">
                        <input type="time" id="input_detHoraInicio" class="editable-input" value="${reserva.hora_inicio || ''}"> a 
                        <input type="time" id="input_detHoraFin" class="editable-input" value="${reserva.hora_fin || ''}" readonly>
                    </div>`;

                const tienePermisoEstadoCritico = usuarioTienePermiso('autorizar_cambio_estado');
                
                document.getElementById('detEstado').innerHTML = `
                    <select id="input_detEstado" class="editable-input">
                        <option value="en_carrito" ${reserva.estado === 'en_carrito' ? 'selected' : ''}>En Carrito</option>
                        <option value="visita_agendada" ${reserva.estado === 'visita_agendada' ? 'selected' : ''}>Visita Agendada</option>
                        <option value="pendiente_pago" ${reserva.estado === 'pendiente_pago' ? 'selected' : ''}>Pendiente de Pago</option>
                        <option value="confirmada" ${reserva.estado === 'confirmada' ? 'selected' : ''}>Confirmada</option>
                        ${tienePermisoEstadoCritico ? `
                        <option value="concluido" ${reserva.estado === 'concluido' ? 'selected' : ''}>Concluido</option>
                        <option value="cancelada" ${reserva.estado === 'cancelada' ? 'selected' : ''}>Cancelada</option>
                        ` : ''}
                    </select>`;

                document.getElementById('detPaquete').innerHTML = `
                    <select id="input_detPaquete" class="editable-input">
                        <option value="Ninguno" ${reserva.paquete === 'Ninguno' ? 'selected' : ''}>Ninguno</option>
                        <option value="Paquete 1 (30 personas)" ${reserva.paquete === 'Paquete 1 (30 personas)' ? 'selected' : ''}>Paquete 1 (30 personas)</option>
                        <option value="Paquete 2 (50 personas)" ${reserva.paquete === 'Paquete 2 (50 personas)' ? 'selected' : ''}>Paquete 2 (50 personas)</option>
                        <option value="Paquete 3 (70 personas)" ${reserva.paquete === 'Paquete 3 (70 personas)' ? 'selected' : ''}>Paquete 3 (70 personas)</option>
                        <option value="Paquete 4 (100 personas)" ${reserva.paquete === 'Paquete 4 (100 personas)' ? 'selected' : ''}>Paquete 4 (100 personas)</option>
                    </select>`;

                ['input_detFecha', 'input_detPaquete', 'input_detHorasExtra', 'input_detSillas', 'input_detMesas'].forEach(id => {
                    const el = document.getElementById(id);
                    if(el) {
                        el.addEventListener('input', recalcularPrecioEdicionEnVivo);
                        el.addEventListener('change', recalcularPrecioEdicionEnVivo);
                    }
                });

                const inHora = document.getElementById('input_detHoraInicio');
                const inHorasEx = document.getElementById('input_detHorasExtra');
                if (inHora) inHora.addEventListener('input', sincronizarHoraSalidaEdicion);
                if (inHorasEx) inHorasEx.addEventListener('input', sincronizarHoraSalidaEdicion);

            } else {
                const motivoRedactado = await solicitarMotivoChangeSistema();
                if (motivoRedactado === null) return;

                const totalFinalCalculado = await recalcularPrecioEdicionEnVivo();
                
                // ⚠️ CAPTURA BLINDADA: Aseguramos capturar el textarea de notas por su ID exacto de edición
                const txtAreaNotas = document.getElementById('input_detNotas') || document.getElementById('input_detSolicitudes');

                const payloadActualizado = {
                    nombre_cliente: document.getElementById('input_detNombre').value,
                    correo: document.getElementById('input_detCorreo').value,
                    telefono: document.getElementById('input_detTelefono').value,
                    fecha_evento: document.getElementById('input_detFecha').value,
                    hora_inicio: document.getElementById('input_detHoraInicio').value,
                    hora_fin: document.getElementById('input_detHoraFin').value,
                    estado: document.getElementById('input_detEstado').value,
                    paquete: document.getElementById('input_detPaquete').value,
                    horas_extras: parseInt(document.getElementById('input_detHorasExtra').value) || 0,
                    sillas_adicionales: parseInt(document.getElementById('input_detSillas').value) || 0,
                    mesas_adicionales: parseInt(document.getElementById('input_detMesas').value) || 0,
                    // Sincronizado al 100% con la base de datos
                    solicitudes_adicionales: txtAreaNotas ? txtAreaNotas.value.trim() : '', 
                    total_calculado: totalFinalCalculado,
                    motivo_modificacion: motivoRedactado
                };

                try {
                    const respuesta = await fetch(`${API_BASE_URL}/api/reservas/${idReservaSeleccionada}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(payloadActualizado)
                    });

                    if (respuesta.ok) {
                        mostrarAlerta("¡Reservación recalculada, guardada y registrada en la bitácora de auditoría!");
                        modoEdicionActivo = false;
                        nuevoBtnModificar.textContent = "✏️ Modificar";
                        
                        await cargarReservaciones();
                        window.verDetalle(idReservaSeleccionada);
                    } else {
                        mostrarAlerta("Error al intentar actualizar la reservación.");
                    }
                } catch (error) {
                    mostrarAlerta("Error de comunicación con el servidor.");
                }
            }
        });
    }

    const btnEliminarReservaReal = document.getElementById('btnEliminarReserva');
    if (btnEliminarReservaReal) {
        const nuevoBtnEliminar = btnEliminarReservaReal.cloneNode(true);
        btnEliminarReservaReal.parentNode.replaceChild(nuevoBtnEliminar, btnEliminarReservaReal);

        nuevoBtnEliminar.addEventListener('click', async () => {
            if (!usuarioTienePermiso('eliminar_reservaciones')) return mostrarAlerta("No tienes autorización para eliminar registros de reservas.");

            const primerPaso = await mostrarConfirmacion("¿Estás completamente seguro de que deseas eliminar esta reservación del sistema?");
            if (!primerPaso) return;

            const segundoPaso = await mostrarConfirmacion("⚠️ ATENCIÓN: Esta acción es completamente irreversible, liberará la fecha y borrará las finanzas. ¿Proceder con la eliminación definitiva?");
            if (!segundoPaso) return;

            try {
                const respuesta = await fetch(`${API_BASE_URL}/api/reservas/eliminar/${idReservaSeleccionada}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (respuesta.ok) {
                    mostrarAlerta("La reservación ha sido eliminada permanentemente del sistema.");
                    if (btnMenuReservas) btnMenuReservas.click();
                } else { mostrarAlerta("Error al intentar eliminar la reservación."); }
            } catch (error) { mostrarAlerta("Error de comunicación con el servidor."); }
        });
    }

    function convertirTextoAInput(idElemento, tipoInput) {
        const elemento = document.getElementById(idElemento);
        if (elemento) {
            const valorActual = elemento.textContent;
            elemento.innerHTML = `<input type="${tipoInput}" id="input_${idElemento}" class="editable-input" value="${valorActual}">`;
        }
    }

    // ========================================================
    // 12. MOTOR DE FILTRADO AVANZADO HORIZONTAL EN TIEMPO REAL
    // ========================================================
    const filtroNombre = document.getElementById('filtroNombre');
    const filtroMes = document.getElementById('filtroMes');
    const filtroAnio = document.getElementById('filtroAnio');
    const filtroEstado = document.getElementById('filtroEstado');
    const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');

    function ejecutarFiltradoDeTabla() {
        if (!filtroNombre || !filtroMes || !filtroAnio || !filtroEstado) return;
        const busquedaNombre = filtroNombre.value.toLowerCase().trim();
        const seleccionMes = filtroMes.value;
        const seleccionAnio = filtroAnio.value;
        const seleccionEstado = filtroEstado.value;

        const reservasFiltradas = listaReservasGlobal.filter(reserva => {
            const cumpleNombre = !busquedaNombre || 
                (reserva.nombre_cliente && reserva.nombre_cliente.toLowerCase().includes(busquedaNombre));

            const fechaISO = reserva.fecha_evento ? reserva.fecha_evento.substring(0, 10) : '';
            const [anioR, mesR] = fechaISO.split('-');

            const cumpleMes = seleccionMes === 'todos' || mesR === seleccionMes;
            const cumpleAnio = seleccionAnio === 'todos' || anioR === seleccionAnio;
            const cumpleEstado = seleccionEstado === 'todos' || reserva.estado === seleccionEstado;

            return cumpleNombre && cumpleMes && cumpleAnio && cumpleEstado;
        });

        mostrarTabla(reservasFiltradas);
    }

    if (filtroNombre) filtroNombre.addEventListener('input', ejecutarFiltradoDeTabla);
    if (filtroMes) filtroMes.addEventListener('change', ejecutarFiltradoDeTabla);
    if (filtroAnio) filtroAnio.addEventListener('change', ejecutarFiltradoDeTabla);
    if (filtroEstado) filtroEstado.addEventListener('change', ejecutarFiltradoDeTabla);

    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', () => {
            filtroNombre.value = '';
            filtroMes.value = 'todos';
            filtroAnio.value = 'todos';
            filtroEstado.value = 'todos';
            mostrarTabla(listaReservasGlobal);
        });
    }

    // ========================================================
    // 13. GESTOR DE USUARIOS, EXPEDIENTES Y MATRIZ MODULAR
    // ========================================================
    const btnMenuUsuariosReal = document.getElementById('btnMenuUsuarios');
    const vistaUsuarios = document.getElementById('vista-usuarios');
    let listaUsuariosGlobal = []; 
    let idUsuarioSeleccionadoPermisos = null;

    // MATRIZ DE PERMISOS DEFINITIVA Y SINCRONIZADA AL 100% CON LAS LLAVES DE ATLAS
    const CONFIG_MATRIZ_PERMISOS = [
        {
            segmento: "A. Módulo de Reservaciones y Agenda",
            capacidades: [
                { id: "acceso_vista_reservas", texto: "Acceso general a pestaña Reservaciones" },
                { id: "editar_reservaciones", texto: "Habilitar botón Modificar parámetros" },
                { id: "eliminar_reservaciones", texto: "Permiso crítico: Eliminar registros de reservas" }
            ]
        },
        {
            segmento: "B. Módulo de Calendarios Operativos y Métricas",
            capacidades: [
                { id: "acceso_panel_maestro", texto: "Acceso general al Calendario Maestro" },
                { id: "acceso_vista_metricas", texto: "Ver estadísticas generales, gráficas y cuadros de inicio" }
            ]
        },
        {
            segmento: "C. Módulo de Creación y Cotizaciones",
            capacidades: [
                { id: "crear_nueva_reserva", texto: "Acceso general para crear cotizaciones por pasos" },
                { id: "aprobar_cancelar_reservas", texto: "Permitir autorizar estados críticos (Concluido/Cancelado)" }
            ]
        },
        {
            segmento: "D. Módulo de Control Financiero y Pagos",
            capacidades: [
                { id: "acceso_modulo_pagos", texto: "Ver detalles de costos, saldos e ingresos monetarios" },
                { id: "registrar_pagos_anticipos", texto: "Permitir teclear montos de anticipos en Paso 3" },
                { id: "emitir_comprobantes", texto: "Permiso para generar tickets o comprobantes de pago" }
            ]
        },
        {
            segmento: "E. Módulo de Configuración del Salón",
            capacidades: [
                { id: "acceso_vista_configuraciones", texto: "Acceso general a pestaña de Configuración" },
                { id: "modificar_precios_paquetes", texto: "Permitir actualizar los costos de paquetes y extras" },
                { id: "bloquear_fechas_calendario", texto: "Habilitar bloqueo manual de fechas en agenda" },
                { id: "editar_datos_contacto", texto: "Modificar información pública de contacto del salón" }
            ]
        },
        {
            segmento: "F. Módulo de Control de Usuarios y Personal",
            capacidades: [
                { id: "gestionar_usuarios", texto: "Acceso supremo a pestaña Usuarios del Sistema y expedientes" },
                { id: "modificar_matriz_permisos", texto: "Control absoluto: Modificar palancas de permisos de empleados" }
            ]
        }
    ];

    if (btnMenuUsuariosReal) {
        const clonUsuariosBtn = btnMenuUsuariosReal.cloneNode(true);
        btnMenuUsuariosReal.parentNode.replaceChild(clonUsuariosBtn, btnMenuUsuariosReal);

        clonUsuariosBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!usuarioTienePermiso('gestionar_usuarios')) return mostrarAlerta("Área de alta seguridad restringida.");

            apagarTodasLasVistas();
            if (vistaUsuarios) vistaUsuarios.style.display = 'block';
            clonUsuariosBtn.classList.add('activo');
            cargarUsuariosSistema();
        });
    }

    async function cargarUsuariosSistema() {
        const tbody = document.getElementById('tablaUsuariosBody');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Consultando personal en Atlas...</td></tr>';

        try {
            const respuesta = await fetch(`${API_BASE_URL}/api/usuarios/todos`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (respuesta.ok) {
                listaUsuariosGlobal = await respuesta.json();
                renderizarTablaUsuarios(listaUsuariosGlobal);
            } else {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">No se pudo sincronizar la lista de personal.</td></tr>';
            }
        } catch (error) {
            console.error("Error cargando usuarios:", error);
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Error de comunicación con el servidor.</td></tr>';
        }
    }

    function renderizarTablaUsuarios(usuarios) {
        const tbody = document.getElementById('tablaUsuariosBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #8C8A85;">No hay usuarios registrados en el sistema.</td></tr>';
            return;
        }

        usuarios.forEach(user => {
            const tr = document.createElement('tr');
            
            const rolActual = user.rol || 'cliente';
            let badgeRolHTML = '';

            if (rolActual === 'admin') {
                badgeRolHTML = `<span class="badge" style="background-color:#1A3626; color:#FAF6EE; padding:4px 10px; font-weight:600; font-size:0.8rem; text-transform: uppercase; border-radius:4px;">👑 Admin</span>`;
            } else if (rolActual === 'empleado') {
                badgeRolHTML = `<span class="badge" style="background-color:#D8F3DC; color:#1B4332; padding:4px 10px; font-weight:600; font-size:0.8rem; text-transform: uppercase; border-radius:4px;">💼 Empleado</span>`;
            } else {
                badgeRolHTML = `<span class="badge" style="background-color:#E2ECE9; color:#233329; padding:4px 10px; font-weight:600; font-size:0.8rem; text-transform: uppercase; border-radius:4px;">👤 Cliente</span>`;
            }

            const stringBotonEliminar = usuarioTienePermiso('modificar_matriz_permisos') ? 
                `<button class="btn-accion" onclick="ejecutarBajaUsuario('${user._id}', '${user.nombre}')">🗑️ Eliminar</button>` : '';

            const stringBotonPermisos = usuarioTienePermiso('modificar_matriz_permisos') ?
                `<button class="btn-operativo-user permisos" onclick="abrirMatrizPermisos('${user._id}')">⚙️ Permisos</button>` : '';

            tr.innerHTML = `
                <td><strong>👤 ${user.nombre || 'Usuario sin nombre'}</strong></td>
                <td>${user.correo || 'Sin correo'}</td>
                <td>
                    ${badgeRolHTML}
                </td>
                <td style="text-align: center;">
                    <button class="btn-operativo-user info" onclick="abrirExpedientePersonal('${user._id}')">📋 Info</button>
                    ${stringBotonPermisos}
                    ${stringBotonEliminar}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.ejecutarBajaUsuario = async function(id, nombre) {
        if (!usuarioTienePermiso('modificar_matriz_permisos')) return mostrarAlerta("Privilegios de baja denegados.");

        const primerPaso = await mostrarConfirmacion(`¿Estás completamente seguro de que deseas eliminar al usuario "${nombre}" del sistema?`);
        if (!primerPaso) return;

        const segundoPaso = await mostrarConfirmacion(`⚠️ ATENCIÓN: Esta acción es completamente irreversible, revocará los accesos inmediatamente y borrará su expediente. ¿Proceder con la eliminación definitiva?`);
        if (!segundoPaso) return;

        try {
            const respuesta = await fetch(`${API_BASE_URL}/api/usuarios/eliminar/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token || localStorage.getItem('bamboo_token')}` 
                }
            });

            if (respuesta.ok) {
                mostrarAlerta(`El usuario "${nombre}" ha sido eliminado permanentemente del sistema.`);
                if (typeof cargarUsuariosSistema === 'function') {
                    cargarUsuariosSistema();
                } else {
                    window.location.reload();
                }
            } else {
                mostrarAlerta("Error al intentar eliminar al usuario.");
            }
        } catch (error) {
            mostrarAlerta("Error de comunicación con el servidor.");
        }
    };

    window.cerrarModalBajaEstetico = function() {
        const modal = document.getElementById('modalConfirmarBajaUsuario');
        if (modal) modal.style.display = 'none';
    };

    window.abrirExpedientePersonal = function(idUser) {
        const user = listaUsuariosGlobal.find(u => u._id === idUser);
        const contenedor = document.getElementById('contenedorInfoPersonal');
        if (!user || !contenedor) return;

        contenedor.innerHTML = `
            <div style="background:#FAF8F5; padding:12px; border-radius:8px; border:1px solid #EAE6DF;">
                <span style="font-size:0.75rem; color:#8C8A85; display:block; font-weight:700; text-transform:uppercase;">Nombre Completo</span>
                <strong style="color:#233329; font-size:1.05rem;">${user.nombre}</strong>
            </div>
            <div style="background:#FAF8F5; padding:12px; border-radius:8px; border:1px solid #EAE6DF;">
                <span style="font-size:0.75rem; color:#8C8A85; display:block; font-weight:700; text-transform:uppercase;">Correo Registrado</span>
                <strong style="color:#233329;">${user.correo}</strong>
            </div>
            <div style="background:#FAF8F5; padding:12px; border-radius:8px; border:1px solid #EAE6DF;">
                <span style="font-size:0.75rem; color:#8C8A85; display:block; font-weight:700; text-transform:uppercase;">Número de Teléfono</span>
                <strong style="color:#233329;">${user.telefono || 'No proporcionado'}</strong>
            </div>
            <div style="background:#FAF8F5; padding:12px; border-radius:8px; border:1px solid #EAE6DF;">
                <span style="font-size:0.75rem; color:#8C8A85; display:block; font-weight:700; text-transform:uppercase;">Identificador Interno Base</span>
                <span style="font-family:monospace; color:#52796F; font-size:0.85rem;">${user._id}</span>
            </div>
        `;
        document.getElementById('modalInfoUsuario').style.display = 'flex';
    };

    // ========================================================
    // 🔍 MOTOR DE FILTRADO AVANZADO DE USUARIOS Y CLIENTES
    // ========================================================
    const filtroUsuarioBusqueda = document.getElementById('filtroUsuarioBusqueda');
    const filtroUsuarioTipo = document.getElementById('filtroUsuarioTipo');
    const btnLimpiarFiltrosUsuarios = document.getElementById('btnLimpiarFiltrosUsuarios');

    function ejecutarFiltradoDeUsuarios() {
        if (!filtroUsuarioBusqueda || !filtroUsuarioTipo) return;
        
        const busqueda = filtroUsuarioBusqueda.value.toLowerCase().trim();
        const seleccionTipo = filtroUsuarioTipo.value;

        // Filtramos sobre la lista global descargada en caliente de Atlas
        const usuariosFiltrados = listaUsuariosGlobal.filter(user => {
            const nombre = (user.nombre || '').toLowerCase();
            const telefono = String(user.telefono || '');
            
            // Comprobación A: Filtro de buscador (hace match con Nombre o con Teléfono)
            const cumpleBusqueda = !busqueda || nombre.includes(busqueda) || telefono.includes(busqueda);

            // Comprobación B: Filtro por tipo de perfil de usuario
            const rolActual = user.rol || user.role || 'cliente';
            let cumpleTipo = true;

            if (seleccionTipo === 'staff') {
                cumpleTipo = (rolActual === 'admin' || rolActual === 'empleado');
            } else if (seleccionTipo === 'clientes') {
                cumpleTipo = (rolActual === 'cliente');
            }

            return cumpleBusqueda && cumpleTipo;
        });

        // Re-pintamos la tabla únicamente con los perfiles filtrados
        renderizarTablaUsuarios(usuariosFiltrados);
    }

    // Vinculamos los eventos para que filtren dinámicamente en tiempo real mientras escribes
    if (filtroUsuarioBusqueda) filtroUsuarioBusqueda.addEventListener('input', ejecutarFiltradoDeUsuarios);
    if (filtroUsuarioTipo) filtroUsuarioTipo.addEventListener('change', ejecutarFiltradoDeUsuarios);

    // Funcionalidad completa para restablecer la vista de un solo clic
    if (btnLimpiarFiltrosUsuarios) {
        btnLimpiarFiltrosUsuarios.addEventListener('click', () => {
            filtroUsuarioBusqueda.value = '';
            filtroUsuarioTipo.value = 'todos';
            renderizarTablaUsuarios(listaUsuariosGlobal);
        });
    }
   
    // ========================================================
    // MOTOR OPERATIVO: CARGAR Y RENDERIZAR AGENDA SEMANAL
    // ========================================================
    async function cargarAgendaSemanal() {
        const contenedor = document.getElementById('contenedorAgendaSemanal');
        if (!contenedor) return;

        contenedor.innerHTML = '<p style="color: #8C8A85; font-style: italic;">Consultando compromisos semanales...</p>';

        try {
            const respuesta = await fetch(`${API_BASE_URL}/api/reservas/agenda-semanal`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (respuesta.ok) {
                const eventos = await respuesta.json();
                contenedor.innerHTML = '';

                if (eventos.length === 0) {
                    contenedor.innerHTML = `
                        <div style="background: #FAF8F5; padding: 30px; border-radius: 12px; border: 1px dashed #EAE6DF; text-align: center;">
                            <p style="color: #52796F; font-size: 1.1rem; font-weight: 600; margin: 0;">🎉 Semana libre de eventos agendados.</p>
                            <p style="color: #8C8A85; font-size: 0.85rem; margin: 5px 0 0 0;">Buen momento para realizar labores de mantenimiento o descanso del personal.</p>
                        </div>`;
                    return;
                }

                eventos.forEach(ev => {
                    // Formateamos la fecha en estilo compacto (Ej: VIE 26)
                    const fechaObj = new Date(ev.fecha_evento);
                    const diasSemana = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
                    const mesesAnio = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                    
                    const labelDia = diasSemana[fechaObj.getUTCDay()];
                    const numDia = fechaObj.getUTCDate();
                    const labelMes = mesesAnio[fechaObj.getUTCMonth()];

                    // Colores del indicador lateral según el estado comercial de Atlas
                    const coloresEstado = {
                        'confirmada': '#2D6A4F',
                        'pendiente_pago': '#FFB703',
                        'visita_agendada': '#64DFDF',
                        'en_carrito': '#4CC9F0',
                        'concluido': '#B0C4DE'
                    };
                    const colorBorde = coloresEstado[ev.estado] || '#8C8A85';

                    // Cálculos de saldo financiero
                    const restante = (ev.total_calculado || 0) - (ev.anticipo_pagado || 0);
                    const esLiquidado = restante <= 0;

                    // Construimos la tarjeta con estilos inyectados para blindar el diseño
                    const card = document.createElement('div');
                    card.style.cssText = `
                        background: #FAF8F5;
                        border-radius: 12px;
                        border: 1px solid #EAE6DF;
                        border-left: 6px solid ${colorBorde};
                        display: flex;
                        flex-direction: column;
                        padding: 15px;
                        transition: all 0.2s ease;
                    `;

                    card.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                            <!-- Bloque de Tiempo -->
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div style="background: #1A3626; color: #FAF6EE; padding: 8px 12px; border-radius: 8px; text-align: center; min-width: 65px;">
                                    <span style="font-size: 0.7rem; font-weight: 700; display: block; text-transform: uppercase; opacity: 0.8;">${labelDia}</span>
                                    <span style="font-size: 1.4rem; font-weight: 700; display: block; line-height: 1.1;">${numDia}</span>
                                    <span style="font-size: 0.65rem; display: block; font-weight: 600; opacity: 0.9;">${labelMes}</span>
                                </div>
                                <div>
                                    <h4 style="margin: 0; color: #233329; font-size: 1.1rem; font-weight: 600;">${ev.nombre_cliente}</h4>
                                    <span style="font-size: 0.8rem; color: #52796F; font-weight: 600;">📦 ${ev.paquete}</span>
                                    <span style="font-size: 0.75rem; color: #8C8A85; display: block; margin-top: 2px;">⏰ ${ev.hora_inicio || '--:--'} a ${ev.hora_fin || '--:--'}</span>
                                </div>
                            </div>
                            
                            <!-- Bloque Administrativo Financiero -->
                            <div style="text-align: right; min-width: 150px;">
                                ${esLiquidado 
                                    ? '<span style="background: #D8F3DC; color: #1B4332; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">✅ LIQUIDADO</span>' 
                                    : `<span style="background: #F8D7DA; color: #721C24; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">⚠️ COBRAR: $${restantelocal = restante.toLocaleString('es-MX')}</span>`
                                }
                                <div style="margin-top: 10px; display: flex; gap: 8px; justify-content: flex-end;">
                                    <button onclick="window.abrirDesdeInicio('${ev._id}')" class="btn-ver-detalle" style="padding: 5px 12px; font-size: 0.75rem; margin: 0;">🔍 Ver Folio</button>
                                    ${ev.solicitudes_adicionales 
                                        ? `<button onclick="window.toggleNotasAgenda('${ev._id}')" style="padding: 5px 12px; font-size: 0.75rem; background: #EAE6DF; color: #233329; border: 1px solid #C8C4BE; border-radius: 6px; font-weight: 600; cursor: pointer;">👁️ Notas</button>` 
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                        
                        <!-- Contenedor Desplegable Oculto de Notas Extras -->
                        ${ev.solicitudes_adicionales ? `
                            <div id="notas-agenda-${ev._id}" style="display: none; margin-top: 12px; padding-top: 10px; border-top: 1px dashed #C8C4BE; background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #EAE6DF;">
                                <strong style="font-size: 0.75rem; color: #1A3626; display: block; margin-bottom: 4px; text-transform: uppercase;">⭐ Especificaciones Especiales del Evento:</strong>
                                <p style="margin: 0; font-size: 0.82rem; color: #5C5A56; font-style: italic; white-space: pre-line;">"${ev.solicitudes_adicionales}"</p>
                            </div>
                        ` : ''}
                    `;
                    contenedor.appendChild(card);
                });
            }
        } catch (error) {
            console.error("Error cargando agenda de inicio:", error);
            contenedor.innerHTML = '<p style="color: red;">Error al sincronizar la agenda semanal desde Atlas.</p>';
        }
    }

    // Función Global Maestra para deslizar/ocultar las especificaciones extras
    window.toggleNotasAgenda = function(id) {
        const cajaNotas = document.getElementById(`notas-agenda-${id}`);
        if (cajaNotas) {
            cajaNotas.style.display = cajaNotas.style.display === 'none' ? 'block' : 'none';
        }
    };

    window.abrirMatrizPermisos = function(idUser) {
        if (!usuarioTienePermiso('modificar_matriz_permisos')) return mostrarAlerta("Privilegio restringido.");

        const user = listaUsuariosGlobal.find(u => u._id === idUser);
        if (!user) return;

        idUsuarioSeleccionadoPermisos = idUser;
        document.getElementById('subtituloPermisosNombre').textContent = `Usuario: ${user.nombre} (${user.role || user.rol || 'Cliente'})`;

        const contenedorSegmentos = document.getElementById('segmentosPermisosContenedor');
        contenedorSegmentos.innerHTML = '';

        const permisosUsuario = user.permisos || {};

        CONFIG_MATRIZ_PERMISOS.forEach(bloque => {
            const divBloque = document.createElement('div');
            divBloque.className = 'segmento-permisos-bloque';
            
            let htmlHeader = `<h4 class="segmento-titulo-header">${bloque.segmento}</h4>`;
            let htmlFilas = '';

            bloque.capacidades.forEach(cap => {
                const estaActivo = permisosUsuario[cap.id] === true;

                htmlFilas += `
                    <div class="permiso-fila-switch">
                        <span class="permiso-texto-lbl">${cap.texto}</span>
                        <label class="bamboo-switch-toggle">
                            <input type="checkbox" name="${cap.id}" ${estaActivo ? 'checked' : ''}>
                            <span class="slider-deslizable-track"></span>
                        </label>
                    </div>
                `;
            });

            divBloque.innerHTML = htmlHeader + htmlFilas;
            contenedorSegmentos.appendChild(divBloque);
        });

        document.getElementById('modalPermisosUsuario').style.display = 'flex';
    };

    window.cerrarModalUsuarios = function(idModal) {
        const modal = document.getElementById(idModal);
        if (modal) modal.style.display = 'none';
    };

    const formMatrizPermisos = document.getElementById('formMatrizPermisos');
    if (formMatrizPermisos) {
        formMatrizPermisos.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!usuarioTienePermiso('modificar_matriz_permisos')) return mostrarAlerta("No tienes autorización para alterar privilegios.");

            const nuevosPermisosMapa = {};
            
            CONFIG_MATRIZ_PERMISOS.forEach(bloque => {
                bloque.capacidades.forEach(cap => {
                    const inputSwitch = formMatrizPermisos.querySelector(`input[name="${cap.id}"]`);
                    nuevosPermisosMapa[cap.id] = inputSwitch ? inputSwitch.checked : false;
                });
            });
            console.log("PAQUETE REAL QUE SE ENVIARÁ A ATLAS:", nuevosPermisosMapa);

            let esMismoUsuario = false;
            const usuarioSesionStr = localStorage.getItem('bamboo_usuario');
            if (usuarioSesionStr) {
                const usuarioSesion = JSON.parse(usuarioSesionStr);
                if (usuarioSesion._id === idUsuarioSeleccionadoPermisos) {
                    esMismoUsuario = true;
                }
            }

            try {
                const respuesta = await fetch(`${API_BASE_URL}/api/usuarios/permisos/${idUsuarioSeleccionadoPermisos}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ permisos: nuevosPermisosMapa })
                });

                if (respuesta.ok) {
                    if (esMismoUsuario) {
                        mostrarAlerta("Has modificado tus propias capacidades. Por seguridad, el sistema reiniciará tu sesión para aplicar los nuevos cambios.");
                        cerrarModalUsuarios('modalPermisosUsuario');
                        
                        localStorage.removeItem('bamboo_token');
                        localStorage.removeItem('bamboo_usuario');
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    } else {
                        mostrarAlerta("Matriz de privilegios sincronizada y aplicada con éxito en la base de datos.");
                        cerrarModalUsuarios('modalPermisosUsuario');
                        
                        if (typeof cargarUsuariosSistema === 'function') {
                            cargarUsuariosSistema(); 
                        } else {
                            window.location.reload();
                        }
                    }
                } else {
                    mostrarAlerta("Error al intentar procesar el guardado de capacidades.");
                }
            } catch (error) {
                console.error("Error guardando permisos:", error);
                mostrarAlerta("Error de comunicación con el servidor.");
            }
        });
    }

});