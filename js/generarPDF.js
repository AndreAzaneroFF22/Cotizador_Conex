

const panelCliente = document.getElementById("nombre-cliente");
const panelContacto = document.getElementById("nombre-contacto");
const panelFechaCreacion = document.getElementById("fecha-creacion");

const panelNumeroCotizacion = document.getElementById("numero-cotizacion");
const panelVendedorCotizacion= document.getElementById("vendedor-cotizacion");
const panelMonedaCotizacion = document.getElementById("moneda-cotizacion");



const cajaDetalleProductos = document.getElementById("tbodyDetalle");
const panelValidezOferta = document.getElementById("validezOferta");


const panelFormaPago = document.getElementById("formaPago");
const panelSubTotal = document.getElementById("subTotal");
const panelIGV = document.getElementById("igv");
const panelTotal = document.getElementById("total");


idCotizacion = localStorage.getItem("IdCotizacion")


function formatearFecha(fechaHora) {
    const fecha = new Date(fechaHora);
    const año = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const día = ('0' + fecha.getDate()).slice(-2);

    return `${año}-${mes}-${día}`;
}


async function pintarModeloPDF(){
 
        const responseCabecera = await fetch(`https://www.pruebaconex.somee.com/api/cotizaciones/${idCotizacion}`);
        if (!responseCabecera.ok) throw new Error('Error al obtener cabecera de cotización');
        const cabecera = await responseCabecera.json();
 
        const responseDetalle = await fetch(`https://www.pruebaconex.somee.com/api/cotizacionesdet/${idCotizacion}`);
        if (!responseDetalle.ok) throw new Error('Error al obtener detalles de cotización');
        const detalles = await responseDetalle.json();
    
       const {
        Id_Cotizacion,
        Cliente,
        Contacto,
        Fecha_Creacion,
        Moneda,
        FormaPago,
        Dias_validez,
        Usu_Crea,
        Base_Imponible,
        Tipo_Cambio,
        IGV,
        Total
        } = cabecera[0]

       
        const fechaFormateada = formatearFecha(Fecha_Creacion);

        detalles.forEach(detalle => {
               
            const {Item,Codigo_Producto,Descripcion_Producto,Cantidad,Precio} = detalle;

            let trProducto = document.createElement("tr");
    
            let tdItem = document.createElement("td");
            tdItem.classList.add("border","border-gray-700");
            tdItem.textContent = Item;

            let tdCodigo = document.createElement("td");
            tdCodigo.classList.add("border","border-gray-700");
            tdCodigo.textContent = Codigo_Producto;

            let tdDescripcion = document.createElement("td");
            tdDescripcion.classList.add("border","border-gray-700");
            tdDescripcion.textContent = Descripcion_Producto;

            let tdCantidad = document.createElement("td");
            tdCantidad.classList.add("border","border-gray-700");
            tdCantidad.textContent = Number(Cantidad);

            let tdPrecioUnitario = document.createElement("td");
            tdPrecioUnitario.classList.add("border","border-gray-700");
            tdPrecioUnitario.textContent = Number(Precio).toFixed(2);

            let tdPrecioSubTotal = document.createElement("td");
            tdPrecioSubTotal.classList.add("border","border-gray-700");
            tdPrecioSubTotal.textContent = (Number(Precio).toFixed(2)*Number(Cantidad)).toFixed(2);

            trProducto.appendChild(tdItem);
            trProducto.appendChild(tdCodigo);
            trProducto.appendChild(tdDescripcion);
            trProducto.appendChild(tdCantidad);
            trProducto.appendChild(tdPrecioUnitario);
            trProducto.appendChild(tdPrecioSubTotal);

            cajaDetalleProductos.appendChild(trProducto);
        })

        if(Moneda=="S"){
            simboloMoneda="S/. "
        }else{
            simboloMoneda="$ "
        }


        panelCliente.textContent = Cliente;
        panelContacto.textContent = Contacto;
        panelFechaCreacion.textContent = fechaFormateada;


        panelNumeroCotizacion.textContent = Id_Cotizacion;
        panelVendedorCotizacion.textContent = Usu_Crea;
        panelMonedaCotizacion.textContent = Moneda=="S" ? "Soles":"Dolares";

        panelValidezOferta.textContent = Dias_validez + " Días";
        panelFormaPago.textContent =  FormaPago;

        panelSubTotal.textContent = simboloMoneda + Number(Base_Imponible).toFixed(2)
        panelIGV.textContent = simboloMoneda + Number(IGV).toFixed(2)
        panelTotal.textContent = simboloMoneda + Number(Total).toFixed(2)

        document.dispatchEvent(new CustomEvent('datosCargados'));
}

pintarModeloPDF();

