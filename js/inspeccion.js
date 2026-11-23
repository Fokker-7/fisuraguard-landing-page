document.addEventListener('DOMContentLoaded', () => {
  const barraLateral = document.getElementById('barra-lateral');
  const botonMenuMovil = document.getElementById('boton-menu-movil');
  const VistaPrevia = document.getElementById('modal-vista-previa');
  const objetivoDesenfoque = document.getElementById('objetivo-desenfoque');
  const botonvistaprevia = document.getElementById('boton-abrir-modal');
  const botonConfirmarPdf = document.getElementById('boton-confirmar-pdf');
  const botonCancelarPdf = document.getElementById('boton-cancelar-pdf');
  const botonCampana = document.getElementById('boton-campana');
  const botonNuevaInspeccion = document.getElementById('boton-nueva-inspeccion');
  const botonCerrarSesion = document.getElementById('boton-cerrar-sesion');

  // barra hamburguesa 
  if (botonMenuMovil && barraLateral) {
    botonMenuMovil.addEventListener('click', (e) => {
      e.stopPropagation();
      barraLateral.classList.toggle('abierto');
    });

    document.addEventListener('click', (e) => {
      if (!barraLateral.contains(e.target) && barraLateral.classList.contains('abierto')) {
        barraLateral.classList.remove('abierto');
      }
    });
  }

  //vista previa
  botonvistaprevia.addEventListener('click', () => {
    VistaPrevia.classList.remove('oculto');
    objetivoDesenfoque.classList.add('desenfocado');
  });

  function cerrarModal() {
    VistaPrevia.classList.add('oculto');
    objetivoDesenfoque.classList.remove('desenfocado');
  }

  // Botón Cancelar y clic fuera de la ventana modal
  botonCancelarPdf.addEventListener('click', cerrarModal);

  VistaPrevia.addEventListener('click', (e) => {
    if (e.target === VistaPrevia) {
      cerrarModal();
    }
  });

  //confirmar para descargar
  botonConfirmarPdf.addEventListener('click', () => {
    cerrarModal();
    alert('Informe técnico #104 descargado correctamente en formato PDF.');
  });

  // Botones de la barra superior
  if (botonCampana) {
    botonCampana.addEventListener('click', () => {
      alert('Estás revisando la alerta crítica de la Inspección #104.');
    });
  }

  if (botonNuevaInspeccion) {
    botonNuevaInspeccion.addEventListener('click', () => {
      alert('Ya te encuentras en el detalle de la Inspección #104.');
    });
  }

  // cerrar sesion
  botonCerrarSesion.addEventListener('click', () => {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'inicioSesion.html';
  });
});