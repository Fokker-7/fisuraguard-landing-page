document.addEventListener('DOMContentLoaded', () => {
    // Usuarios registrados (simulación de base de datos) 
    const usuariosRegistrados = [
        { nombres: 'Angelo', correo: 'angelo@fisuraguard.pe', clave: 'Admin123', rol: 'supervisor', cip: '210455', verificado: true },
        { nombres: 'Manuel', correo: 'manuel@fisuraguard.pe', clave: 'Campo123', rol: 'inspector', cip: '248910', verificado: true },
        { nombres: 'Jorge', correo: 'jorge@fisuraguard.pe', clave: 'Rescate123', rol: 'brigadista', cip: '198342', verificado: true }
    ];

    // Referencias del formulario 
    const formularioAcceso = document.getElementById('formulario-acceso');
    const campoCorreo = document.getElementById('correo');
    const campoContrasena = document.getElementById('contrasena');
    const botonIngresar = document.getElementById('boton-ingresar');
    const alertaAcceso = document.getElementById('alerta-acceso');

    // Control de intentos fallidos
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
            `Cuenta bloqueada temporalmente por 5 intentos fallidos. Intenta de nuevo en ${segundosRestantes}s.`
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

    //Inicio de sesion
    formularioAcceso.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (cuentaBloqueada) return;

    const correo = campoCorreo.value.trim().toLowerCase();
    const clave = campoContrasena.value;

    const usuarioEncontrado = usuariosRegistrados.find(
    u => u.correo === correo && u.clave === clave
    );

    //Credenciales incorrectas
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

        // Acceso válido -> Guardar sesión
        intentosFallidos = 0;
        alertaAcceso.classList.add('oculto');
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));
    });

    //Registro y validacion de correo 
    const modalRegistro = document.getElementById('modal-registro');
    const formularioRegistro = document.getElementById('formulario-registro');
    const alertaRegistro = document.getElementById('alerta-registro');
    const pasoValidacionCorreo = document.getElementById('paso-validacion-correo');
    let ultimoCorreoRegistrado = '';

    document.getElementById('enlace-registro').addEventListener('click', (e) => {
        e.preventDefault();
        alertaRegistro.classList.add('oculto');
        formularioRegistro.classList.remove('oculto');
        pasoValidacionCorreo.classList.add('oculto');
        modalRegistro.classList.remove('oculto');
    });

    document.getElementById('cerrar-modal-registro').addEventListener('click', () => {
        modalRegistro.classList.add('oculto');
    });

    formularioRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nombres = document.getElementById('reg-nombres').value.trim();
        const correo = document.getElementById('reg-correo').value.trim().toLowerCase();
        const rol = document.getElementById('reg-rol').value;
        const cip = document.getElementById('reg-cip').value.trim();
        const clave = document.getElementById('reg-contrasena').value;

        //  Campos obligatorios incluyendo CIP
        if (!nombres || !correo || !cip || !clave) {
            mostrarAlerta(alertaRegistro, 'Completa todos los campos obligatorios, incluyendo tu número de CIP.');
        return;
        }

        // HU-01 CA03: Validar que el correo no esté registrado previamente
        if (usuariosRegistrados.some(u => u.correo === correo)) {
            mostrarAlerta(alertaRegistro, 'Este correo institucional ya se encuentra registrado en el sistema.');
        return;
        }

        // HU-01 CA02: Mínimo 8 caracteres, al menos un número y una letra mayúscula
        const politicaClave = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!politicaClave.test(clave)) {
            mostrarAlerta(
            alertaRegistro,
            'La contraseña debe tener mínimo 8 caracteres, al menos una letra mayúscula y un número.'
        );
        return;
        }

        // Guardar nuevo usuario y activar vista de validación de correo (HU-04)
        usuariosRegistrados.push({ nombres, correo, clave, rol, cip, verificado: true });
        ultimoCorreoRegistrado = correo;
        alertaRegistro.classList.add('oculto');
        formularioRegistro.classList.add('oculto');
        document.getElementById('texto-validacion-enviada').textContent =
        `Hemos enviado un enlace de validación a ${correo}. Revisa tu bandeja para activar tu cuenta.`;
        pasoValidacionCorreo.classList.remove('oculto');
    });

    //Reeviar validacion
    document.getElementById('boton-reenviar-validacion').addEventListener('click', () => {
        mostrarAlerta(
            alertaRegistro,
            `Correo de validación reenviado a ${ultimoCorreoRegistrado}.`,
            true
        );
    });

    //Reperacion de correo
    const modalRecuperar = document.getElementById('modal-recuperar');
    const formularioRecuperar = document.getElementById('formulario-recuperar');
    const alertaRecuperar = document.getElementById('alerta-recuperar');

    document.getElementById('enlace-recuperar').addEventListener('click', (e) => {
    e.preventDefault();
    alertaRecuperar.classList.add('oculto');
    formularioRecuperar.reset();
    modalRecuperar.classList.remove('oculto');
    });

    document.getElementById('cerrar-modal-recuperar').addEventListener('click', () => {
    modalRecuperar.classList.add('oculto');
    });

    formularioRecuperar.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const correo = document.getElementById('rec-correo').value.trim();

        if (!correo) return;

        //Mensaje de confirmacion de envio de correo de recuperacion 
        mostrarAlerta(
            alertaRecuperar,
            'Recibirá un enlace de recuperación válido por 24 horas.',
            true
        );
    });
});