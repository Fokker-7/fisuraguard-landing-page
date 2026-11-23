document.addEventListener('DOMContentLoaded', () => {
  const barraLateral = document.getElementById('barra-lateral');
  const botonMenuMovil = document.getElementById('boton-menu-movil');
  const alertaCritica = document.getElementById('alerta-critica');
  const botonCampana = document.getElementById('boton-campana');
  const botonNuevaInspeccion = document.getElementById('boton-nueva-inspeccion');
  const botonCerrarSesion = document.getElementById('boton-cerrar-sesion');

  // menu lateral en versión movil
  if (botonMenuMovil && barraLateral) {
    botonMenuMovil.addEventListener('click', (evento) => {
      evento.stopPropagation();
      barraLateral.classList.toggle('abierto');
    });

    document.addEventListener('click', (evento) => {
      if (!barraLateral.contains(evento.target) && barraLateral.classList.contains('abierto')) {
        barraLateral.classList.remove('abierto');
      }
    });
  }

  //click en una alerta critica para ir de frente a la  a ver que es
  if (alertaCritica) {
    alertaCritica.addEventListener('click', () => {
      window.location.href = 'inspeccion.html';
    });
  }

  //click en el boton de la campana 
  if (botonCampana) {
    botonCampana.addEventListener('click', () => {
      alert('Tienes 1 hallazgo crítico pendiente de revisión: Inspección #104 (Torre Norte).');
      window.location.href = 'inspeccion.html';
    });
  }

  // click boton de nueva inspeccion 
  if (botonNuevaInspeccion) {
    botonNuevaInspeccion.addEventListener('click', () => {
      window.location.href = 'inspeccion.html';
    });
  }

  //click en el boton usuario se cierra sesion
  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener('click', () => {
      localStorage.removeItem('usuarioActivo');
      window.location.href = 'inicioSesion.html';
    });
  }
});