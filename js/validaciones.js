const permisosAPI = "https://www.pruebaconex.somee.com/api/usuario?usuario="


let usuarioLogeado = localStorage.getItem("usuario");

async function validarAccesosModulos(usuario){
       const respuesta = await fetch(`${permisosAPI}${usuario}`) 
       const data = await respuesta.json();

       const {CrearCotizacion,CrearProducto} = data;
         
       if(!CrearCotizacion){
        document.getElementById("crearCotizacionPanel").classList.add("hidden");
       }
        
       if(!CrearProducto){
           document.getElementById("crearProductoPanel").classList.add("hidden");
       }

}

validarAccesosModulos(usuarioLogeado);

if (usuarioLogeado == null) {
	window.location.href = '../index.html';
    	localStorage.removeItem("usuario");
}

if (usuarioLogeado!="ADMIN"){
	document.getElementById("panelAdminOption").classList.add("hidden");
}
