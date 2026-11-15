document.addEventListener('DOMContentLoaded', () => {
    // Usuarios precargados para pruebas
    const usuariosRegistrados = [
        { nombres: 'Angelo', correo: 'angelo@fisuraguard.pe', clave: 'Admin123', rol: 'supervisor', cip: '210455' },
        { nombres: 'Manuel', correo: 'manuel@fisuraguard.pe', clave: 'Campo123', rol: 'inspector', cip: '248910' },
        { nombres: 'Jorge', correo: 'jorge@fisuraguard.pe', clave: 'Rescate123', rol: 'brigadista', cip: '198342' }
    ];

    // Referencias del Login
    const formularioAcceso = document.getElementById('formulario-acceso');
    const campoCorreo = document.getElementById('correo');
    const campoContrasena = document.getElementById('contrasena');
    const checkRecordar = document.getElementById('recordar-dispositivo');
    const botonIngresar = document.getElementById('boton-ingresar');
    const alertaAcceso = document.getElementById('alerta-acceso');

    // Cargar correo recordado si el usuario marcó la casilla anteriormente
    const correoGuardado = localStorage.getItem('correoRecordado');
    if (correoGuardado) {
        campoCorreo.value = correoGuardado;
        checkRecordar.checked = true;
    }

    // Control de bloqueo tras 5 intentos fallidos
    let intentosFallidos = 0;
    let cuentaBloqueada = false;

    function mostrarAlerta(elemento, mensaje, esExito = false) {
        elemento.textContent = mensaje;
        elemento.classList.remove('oculto');
        elemento.classList.toggle('alerta-exito', esExito);
    }

    function bloquearTemporalmente() {
        cuentaBloqueada = true;
        let segundosRestantes = 30;
        campoCorreo.disabled = true;
        campoContrasena.disabled = true;
        botonIngresar.disabled = true;

        const intervalo = setInterval(() => {
            mostrarAlerta(
            alertaAcceso,
            `Cuenta bloqueada temporalmente por 5 intentos fallidos. Intenta nuevamente en ${segundosRestantes}s.`
            );
            segundosRestantes--;

            if (segundosRestantes < 0) {
                clearInterval(intervalo);
                cuentaBloqueada = false;
                intentosFallidos = 0;
                campoCorreo.disabled = false;
                campoContrasena.disabled = false;
                botonIngresar.disabled = false;
                alertaAcceso.classList.add('oculto');
            }
        }, 1000);
    }

    //Inicio de sesión
    formularioAcceso.addEventListener('submit', (evento) => {
     evento.preventDefault();
        if (cuentaBloqueada) return;

        const correo = campoCorreo.value.trim().toLowerCase();
        const clave = campoContrasena.value;

        if (!correo || !clave) {
            mostrarAlerta(alertaAcceso, 'Por favor, ingresa tu correo electrónico y contraseña.');
            return;
        }

        const usuarioEncontrado = usuariosRegistrados.find(
        (u) => u.correo === correo && u.clave === clave
        );

        if (!usuarioEncontrado) {
            intentosFallidos++;
        if (intentosFallidos >= 5) {
            bloquearTemporalmente();
        } else {
            mostrarAlerta(
            alertaAcceso,
            `Correo o contraseña incorrectos (Intento ${intentosFallidos} de 5).`
            );
        }
        return;
        }

        // Guardar o limpiar correo recordado
        if (checkRecordar.checked) {
        localStorage.setItem('correoRecordado', correo);
        } else {
        localStorage.removeItem('correoRecordado');
        }

        intentosFallidos = 0;
        alertaAcceso.classList.add('oculto');
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));

        // Redirección a la Página 2 
        window.location.href = '../index2.html';
    });
 
    // Registro de usuarios
    const modalRegistro = document.getElementById('registro');
    const formularioRegistro = document.getElementById('formulario-registro');
    const alertaRegistro = document.getElementById('alerta-registro');
    const pasoValidacionCorreo = document.getElementById('paso-validacion-correo');
    let ultimoCorreoRegistrado = '';

    document.getElementById('enlace-registro').addEventListener('click', (evento) => {
        evento.preventDefault();
        alertaRegistro.classList.add('oculto');
        formularioRegistro.reset();
        formularioRegistro.classList.remove('oculto');
        pasoValidacionCorreo.classList.add('oculto');
        modalRegistro.classList.remove('oculto');
    });

    document.getElementById('cerrar-registro').addEventListener('click', () => {
        modalRegistro.classList.add('oculto');
    });

    modalRegistro.addEventListener('click', (evento) => {
        if (evento.target === modalRegistro) {
            modalRegistro.classList.add('oculto');
        }
    });

    formularioRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nombres = document.getElementById('reg-nombres').value.trim();
        const correo = document.getElementById('reg-correo').value.trim().toLowerCase();
        const rol = document.getElementById('reg-rol').value;
        const cip = document.getElementById('reg-cip').value.trim();
        const clave = document.getElementById('reg-contrasena').value;

        if (!nombres || !correo || !cip || !clave) {
            mostrarAlerta(alertaRegistro, 'Completa todos los campos obligatorios, incluyendo tu colegiatura CIP.');
        return;
        }

        if (usuariosRegistrados.some((u) => u.correo === correo)) {
            mostrarAlerta(alertaRegistro, 'Este correo institucional ya está registrado en la plataforma.');
        return;
        }

        // Mínimo 8 caracteres, 1 mayúscula y 1 número
        const politicaClave = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!politicaClave.test(clave)) {
            mostrarAlerta(
            alertaRegistro,
            'La contraseña debe tener mínimo 8 caracteres, al menos una letra mayúscula y un número.'
        );
        return;
        }

        usuariosRegistrados.push({ nombres, correo, clave, rol, cip });
        ultimoCorreoRegistrado = correo;
        alertaRegistro.classList.add('oculto');
        formularioRegistro.classList.add('oculto');

        document.getElementById('texto-validacion-enviada').textContent =
        `Hemos enviado un enlace de activación con vigencia limitada a ${correo}.`;
        pasoValidacionCorreo.classList.remove('oculto');
    });

    document.getElementById('boton-reenviar-validacion').addEventListener('click', () => {
        mostrarAlerta(
        alertaRegistro,
        `Correo de validación reenviado a ${ultimoCorreoRegistrado}.`,
        true
        );
    });

    //Recuperar cuenta
    const modalRecuperar = document.getElementById('recuperar');
    const formularioRecuperar = document.getElementById('formulario-recuperar');
    const alertaRecuperar = document.getElementById('alerta-recuperar');

    document.getElementById('enlace-recuperar').addEventListener('click', (evento) => {
        evento.preventDefault();
        alertaRecuperar.classList.add('oculto');
        formularioRecuperar.reset();
        modalRecuperar.classList.remove('oculto');
    });

    document.getElementById('cerrar-recuperar').addEventListener('click', () => {
        modalRecuperar.classList.add('oculto');
    });

    modalRecuperar.addEventListener('click', (evento) => {
        if (evento.target === modalRecuperar) {
            modalRecuperar.classList.add('oculto');
        }
    });

formularioRecuperar.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const correo = document.getElementById('rec-correo').value.trim().toLowerCase();

        // validar que el campo no esté vacío
        if (!correo) {
            mostrarAlerta(alertaRecuperar, 'Por favor, ingresa tu correo electrónico.', false);
            return;
        }

        //validar formato correcto de correo
        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatoCorreo.test(correo)) {
            mostrarAlerta(alertaRecuperar, 'Ingresa un correo electrónico válido (ej. angelo@fisuraguard.pe).', false);
            return;
        }

        // validar que el correo exista
        const usuarioExiste = usuariosRegistrados.some((u) => u.correo === correo);
        if (!usuarioExiste) {
            mostrarAlerta(alertaRecuperar, 'El correo ingresado no está registrado en FisuraGuard.', false);
            return;
        }

        mostrarAlerta(
            alertaRecuperar,
            'Recibirá un enlace de recuperación válido por 24 horas.',
            true
        );
        formularioRecuperar.reset();
    });
});