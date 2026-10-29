document.addEventListener('DOMContentLoaded', () => {

    const formulariojava = document.getElementById('formulario-acceso');
    const obtencioncorreo = document.getElementById('correo');
    const obtencioncontraseña = document.getElementById('contrasena');
    const Botoniniciosesion = formulariojava.querySelector('button[type="submit"]');

    formulariojava.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const correo = obtencioncorreo.value.trim();
        const contrasena = obtencioncontraseña.value.trim();

        // valicion del si es que han puesto correo o la contraseña 
        if (!correo || !contrasena) {
            alert('Por favor completar todos los campos');
            return;
        }

        // valicacion si el correo que han puesto es valido
        const correovalido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correovalido.test(correo)) {
            alert('Ingresa un correo electrónico válido (ejemplo: usuario@correo.com).');
            obtencioncorreo.focus();
            return;
        }

        /*esta parte es la primera fase del inicio de sesion, no se cambia a una segunda pantalla sin embargo
        muestra que el inicio de sesion ha sido exitoso*/
        Botoniniciosesion.textContent = 'Iniciando sesión...';
        Botoniniciosesion.disabled = true;

        setTimeout(() => {
            alert(`Acceso correcto\nUsuario: ${correo}\n`);
            Botoniniciosesion.textContent = 'Iniciar sesion';
            Botoniniciosesion.disabled = false;
        }, 800); //cambiar el numero en caso sea muy lento

    });
});