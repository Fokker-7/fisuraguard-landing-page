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

        //pasa de frente al index 2 
        localStorage.setItem('usuarioActivo', correo);  
        window.location.href = "../pages/index2.html";

    });
});