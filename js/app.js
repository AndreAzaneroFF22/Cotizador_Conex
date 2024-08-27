import './seleccionarOpcion.js';
import './productos.js';
import './clientes.js';
import './contactos.js';
import './cotizaciones.js';
import './listaCotizaciones.js';
import './cerrarSesion.js';
import './administración.js';

let usuarioLogeado = localStorage.getItem("usuario");

if (usuarioLogeado == null) {
	window.location.href = '../index.html';
    	localStorage.removeItem("usuario");
}

if (usuarioLogeado!="ADMIN"){
	document.getElementById("panelAdminOption").classList.add("hidden");
}
