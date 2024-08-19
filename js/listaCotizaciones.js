let usuarioLogeado = localStorage.getItem("usuario");
const COTIZACIONES_PER_PAGE = 8;
let currentPage = 1;
let allCotizaciones = [];
let comodinContacto = "";


// const API_URL = "https://www.pruebaconex.somee.com/api/cotizaciones/usuario/";
const API_URL = "https://www.pruebaconex.somee.com/api/cotizaciones";
const clientesApiUrl = 'https://www.pruebaconex.somee.com/api/clientes';
const contactosApiUrl = 'https://www.pruebaconex.somee.com/api/contactos/cliente/';
const API_PERMISOS_USER = "http://www.pruebaconex.somee.com/api/usuario?usuario="


let permisos = "";

// Fetch permisos
fetch(`${API_PERMISOS_USER}${usuarioLogeado}`)
.then(response => response.json())
.then(data => {
     permisos = data;
})
.catch(error => console.error('Error fetching clients:', error));



async function listarTodasLasCotizaciones() {
    try {
        const response = await fetch(`${API_URL}`);
        if (!response.ok) throw new Error('Error al listar cotizaciones');
        allCotizaciones = await response.json();
        renderCotizaciones(currentPage, allCotizaciones);
        renderPaginacion(allCotizaciones.length, currentPage);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderCotizaciones(page, cotizaciones) {
    const tbody = document.getElementById("tbodyCotizacion");
    tbody.innerHTML = '';
    const startIndex = (page - 1) * COTIZACIONES_PER_PAGE;
    const endIndex = page * COTIZACIONES_PER_PAGE;
    const CotizacionesToShow = cotizaciones.slice(startIndex, endIndex);
    const {EditarCotizacion} = permisos;


    CotizacionesToShow.forEach(cotizacion => {
        const row = document.createElement('tr');
        row.classList.add('border', 'border-gray-300');

        const codigoCell = document.createElement('td');
        codigoCell.classList.add('py-3', 'px-6', 'border', 'border-gray-300');
        codigoCell.textContent = cotizacion.Id_Cotizacion;
        row.appendChild(codigoCell);

        const clienteCell = document.createElement('td');
        clienteCell.classList.add('py-3', 'px-6', 'border', 'border-gray-300');
        clienteCell.textContent = cotizacion.Cliente;
        row.appendChild(clienteCell);

        const contactoCell = document.createElement('td');
        contactoCell.classList.add('py-3', 'px-6', 'border', 'border-gray-300');
        contactoCell.textContent = cotizacion.Contacto;
        row.appendChild(contactoCell);

        const monedaCell = document.createElement('td');
        monedaCell.classList.add('py-3', 'px-6', 'border', 'border-gray-300');
        monedaCell.textContent = cotizacion.Moneda === "S" ? "Soles" : "Dólares";
        row.appendChild(monedaCell);

        const totalCell = document.createElement('td');
        totalCell.classList.add('py-3', 'px-6', 'border', 'border-gray-300');
        totalCell.textContent = cotizacion.Total;
        row.appendChild(totalCell);

        const accionesCell = document.createElement('td');
        accionesCell.classList.add('py-3', 'px-6', 'border', 'border-gray-300', 'flex', 'justify-center', 'gap-x-4');

        const editarButton = document.createElement('button');
        if (EditarCotizacion) {
            editarButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded');
        } else {
            editarButton.classList.add('bg-blue-200', 'text-white', 'px-4', 'py-2', 'rounded','pointer-events-none');
        }
        editarButton.textContent = 'Editar';
        editarButton.onclick = () => {
            mostrarModalEditarCotizacion(cotizacion.Id_Cotizacion);
        }
        accionesCell.appendChild(editarButton);

        const imprimirButton = document.createElement('button');
        imprimirButton.classList.add('bg-yellow-500', 'text-white', 'px-4', 'py-2', 'rounded');
        imprimirButton.textContent = '🖨️';
        imprimirButton.onclick = () => {
             localStorage.setItem("IdCotizacion", cotizacion.Id_Cotizacion);
             location.href = "../pages/modeloCotizacion.html"
        }
        accionesCell.appendChild(imprimirButton);

        const eliminarButton = document.createElement('button');
        if (EditarCotizacion) {
            eliminarButton.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded');
        } else {
            eliminarButton.classList.add('bg-red-200', 'text-white', 'px-4', 'py-2', 'rounded','pointer-events-none');
        } 
        eliminarButton.textContent = 'Eliminar';
        eliminarButton.onclick = () => {
            eliminarDetalleCotizacion(cotizacion.Id_Cotizacion);
            eliminarCabeceraCotizacion(cotizacion.Id_Cotizacion);
        };
        accionesCell.appendChild(eliminarButton);

        row.appendChild(accionesCell);
        tbody.appendChild(row);
    });
}

function renderPaginacion(totalCotizaciones, page) {
    const pagination = document.getElementById('paginationCotizaciones');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalCotizaciones / COTIZACIONES_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('px-3', 'py-1', 'border', 'mx-1', 'rounded');
        if (i === page) {
            button.classList.add('bg-gray-700', 'text-white');
        } else {
            button.classList.add('bg-gray-200');
            button.addEventListener('click', () => {
                currentPage = i;
                renderCotizaciones(currentPage, allCotizaciones);
                renderPaginacion(totalCotizaciones, currentPage);
            });
        }
        button.textContent = i;
        pagination.appendChild(button);
    }
}

async function eliminarCabeceraCotizacion(codigo) {
    try {
        const response = await fetch(`https://www.pruebaconex.somee.com/api/cotizaciones/${codigo}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar la cotización');
        console.log(`Cotización con código ${codigo} eliminada`);
        listarTodasLasCotizaciones();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function eliminarDetalleCotizacion(codigo) {
    try {
        const response = await fetch(`https://www.pruebaconex.somee.com/api/cotizacionesdet/${codigo}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar detalle cotización');
        console.log(`Detalle de cotización con código ${codigo} eliminado`);
        listarTodasLasCotizaciones();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function mostrarCabeceraCotizacionPorId(id) {
    try {
        const response = await fetch(`https://www.pruebaconex.somee.com/api/cotizaciones/${id}`);
        if (!response.ok) throw new Error('Error al obtener la cotización');
        const cabeceraCotizacion = await response.json();
        return cabeceraCotizacion;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function mostrarDetalleCotizacionPorId(id) {
    try {
        const response = await fetch(`https://www.pruebaconex.somee.com/api/cotizacionesdet/${id}`);
        if (!response.ok) throw new Error('Error al obtener el detalle de la cotización');
        const detalleCotizacion = await response.json();
        return detalleCotizacion;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function llenarClientesSelect(clienteSeleccionado) {
    const clienteSelect = document.getElementById('editar_clienteCotizacionSelect');
    clienteSelect.innerHTML = '<option value="">--Seleccione un cliente--</option>';

    try {
        const response = await fetch(clientesApiUrl);
        const clientes = await response.json();
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.Id_Cliente;
            option.textContent = cliente.RSocial;
            clienteSelect.appendChild(option);
        });

        for (let i = 0; i < clienteSelect.options.length; i++) {
            if (clienteSelect.options[i].textContent === clienteSeleccionado) {
                clienteSelect.selectedIndex = i;
                break;
            }
        }
        
        comodinContacto =  clienteSelect.value;
         
    } catch (error) {
        console.error('Error fetching clients:', error);
    }

}

async function llenarContactosSelect(contactoSeleccionado) {
    const contactoSelect = document.getElementById('editarClienteContactoSelect');
    contactoSelect.innerHTML = '<option value="">--Seleccione un contacto--</option>';
    try {
        const response = await fetch(contactosApiUrl + comodinContacto);
        const contactos = await response.json();
        contactos.forEach(contacto => {
            const option = document.createElement('option');
            option.value = contacto.Id_Contacto;
            option.textContent = contacto.Nombre;
            contactoSelect.appendChild(option);
        });

        for (let i = 0; i < contactoSelect.options.length; i++) {
            if (contactoSelect.options[i].textContent === contactoSeleccionado) {
                contactoSelect.selectedIndex = i;
                break;
            }
        }

    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

function llenarFormasPagoSelect(formaPagoSeleccionada) {
    const formaPagoSelect = document.getElementById('editarTipoFormaPagoSelect');
    formaPagoSelect.innerHTML = `
        <option value="">--Seleccione forma de pago--</option>
        <option value="1">Crédito 15 días</option> 
        <option value="2">Crédito 30 días</option> 
        <option value="3">Crédito 60 días</option> 
        <option value="4">Contra Entrega</option> 
    `;
    for (let i = 0; i < formaPagoSelect.options.length; i++) {
        if (formaPagoSelect.options[i].textContent === formaPagoSeleccionada) {
            formaPagoSelect.selectedIndex = i;
            break;
        }
    }
}

function llenarMonedasSelect(monedaSeleccionada) {
    const monedaSelect = document.getElementById('editarTipoMonedaSelect');
    monedaSelect.innerHTML = `
        <option value="">--Seleccione tipo de moneda--</option>
        <option value="S">Soles</option>
        <option value="D">Dólares</option>
    `;
    monedaSelect.value = monedaSeleccionada;
}

async function mostrarModalEditarCotizacion(id) {
    try {
        const cabeceraCotizacion = await mostrarCabeceraCotizacionPorId(id);
        if (!cabeceraCotizacion) return;

        const detalleCotizacion = await mostrarDetalleCotizacionPorId(id);
        if (!detalleCotizacion) return;

        console.log(cabeceraCotizacion);
        console.log(detalleCotizacion);
        
        llenarFormasPagoSelect(cabeceraCotizacion[0].FormaPago);
        llenarMonedasSelect(cabeceraCotizacion[0].Moneda);
        await llenarClientesSelect(cabeceraCotizacion[0].Cliente);
        await llenarContactosSelect(cabeceraCotizacion[0].Contacto);

        document.getElementById('editar_Id_Cotizacion').value = cabeceraCotizacion[0].Id_Cotizacion;
        document.getElementById('editar_Dias_validez').value = cabeceraCotizacion[0].Dias_validez;
        document.getElementById('editar_Tipo_Cambio').value = cabeceraCotizacion[0].Tipo_Cambio;
        document.getElementById('editar_Base_Imponible').value = cabeceraCotizacion[0].Base_Imponible;
        document.getElementById('editar_IGV').value = cabeceraCotizacion[0].IGV;
        document.getElementById('editar_Total').value = cabeceraCotizacion[0].Total;

        const tableBody = document.getElementById('editar_itemsTableBody');
        tableBody.innerHTML = ''; 

        detalleCotizacion.forEach((detalle, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td class="py-2 px-4 border border-gray-300">${index + 1}</td>
                <td class="py-2 px-4 border border-gray-300 relative">
                    <input type="text" class="w-full px-3 py-2 border rounded" name="Descripcion[]" value="${detalle.Descripcion_Producto}" oninput="showSuggestions(this)">
                    <div class="absolute bg-white border border-gray-300 w-full max-h-40 overflow-auto z-10 hidden"></div>
                </td>
                <td class="py-2 px-4 border border-gray-300">
                    <input type="number" class="w-full px-3 py-2 border rounded" name="Cantidad[]" value="${detalle.Cantidad}" min=1 step="1">
                </td>
                <td class="py-2 px-4 border border-gray-300">
                    <input type="number" step="0.01" class="w-full px-3 py-2 border rounded" name="P_Unit[]" value="${detalle.Precio}" data-original-price="${detalle.Precio}">
                </td>
                <td class="py-2 px-4 border border-gray-300">
                    <input type="number" step="0.01" class="w-full px-3 py-2 border rounded" name="P_Total[]" value="${detalle.Cantidad * detalle.Precio}" disabled>
                </td>
                <td class="py-2 px-4 border border-gray-300 flex justify-center content-center leading-8">
                    <button type="button" class="bg-red-500 text-white px-2 py-1 rounded eliminarFila">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });

        document.getElementById('editCotizacionModal').classList.remove('hidden');

        // Add event listeners after rows are added
        const eliminarFilaButtons = document.querySelectorAll('.eliminarFila');
        eliminarFilaButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const row = event.target.closest('tr');
                row.remove();
                recalculateAllTotals();
            });
        });

        const cantidadInputs = document.querySelectorAll('input[name="Cantidad[]"]');
        cantidadInputs.forEach(input => {
            input.addEventListener('input', (event) => {
                calculateTotal(event.target);
            });
        });

        const precioInputs = document.querySelectorAll('input[name="P_Unit[]"]');
        precioInputs.forEach(input => {
            input.addEventListener('input', (event) => {
                calculateTotal(event.target.closest('tr').querySelector('input[name="Cantidad[]"]'));
            });
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

async function actualizarCotizacion(event) {
    event.preventDefault();
    const idCotizacion = document.getElementById('editar_Id_Cotizacion').value;

    try {
       await eliminarCabeceraCotizacion(idCotizacion);
       await eliminarDetalleCotizacion(idCotizacion);

     console.log(idCotizacion);
        

        const nuevaCabecera = {
            Id_Cotizacion: idCotizacion,
            Id_Cliente: document.getElementById('editar_clienteCotizacionSelect').value,
            Id_Contacto: document.getElementById('editarClienteContactoSelect').value,
            Moneda: document.getElementById('editarTipoMonedaSelect').value,
            Id_FormaPago: document.getElementById('editarTipoFormaPagoSelect').value,
            Dias_validez: parseInt(document.getElementById('editar_Dias_validez').value),
            Usuario: usuarioLogeado,
            Tipo_Cambio: parseFloat(document.getElementById('editar_Tipo_Cambio').value),
            Base_Imponible: parseFloat(document.getElementById('editar_Base_Imponible').value),
            IGV: parseFloat(document.getElementById('editar_IGV').value),
            Total: parseFloat(document.getElementById('editar_Total').value)
        };

        const cabeceraResponse = await fetch(`https://www.pruebaconex.somee.com/api/cotizaciones/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaCabecera)
        });

        if (!cabeceraResponse.ok) throw new Error('Error al crear la cabecera de la cotización');

        const items = document.querySelectorAll('#editar_itemsTableBody tr');
        
        for (const item of items) {

            const descripcionProducto = item.querySelector('input[name="Descripcion[]"]').value;
            const product = products.find(p => p.Descripcion == descripcionProducto);
            const idProducto = product ? product.Id_Producto : 0; // Asigna 0 si no se encuentra el producto

            const detalle = {
                Id_Cotizacion: idCotizacion,
                Item: parseInt(item.querySelector('td:nth-child(1)').textContent),
                Descripcion_Producto: item.querySelector('input[name="Descripcion[]"]').value,
                Id_Producto: idProducto, // Placeholder
                Cantidad: parseInt(item.querySelector('input[name="Cantidad[]"]').value),
                Precio: parseFloat(item.querySelector('input[name="P_Unit[]"]').value)
            };

        
            const detalleResponse = await fetch(`https://www.pruebaconex.somee.com/api/cotizacionesdet/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(detalle)
            });

            if (!detalleResponse.ok) throw new Error('Error al crear el detalle de la cotización');
        }

        Swal.fire("¡Éxito!", "Cotización actualizada correctamente", "success");
        document.getElementById('editCotizacionModal').classList.add('hidden');
        listarTodasLasCotizaciones();
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('editarCotizacionForm').addEventListener('submit', actualizarCotizacion);

document.getElementById('editar_addItem').addEventListener('click', () => {
    const tableBody = document.getElementById('editar_itemsTableBody');
    const rowCount = tableBody.rows.length + 1;
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td class="py-2 px-4 border border-gray-300">${rowCount}</td>
        <td class="py-2 px-4 border border-gray-300 relative">
            <input type="text" class="w-full px-3 py-2 border rounded" name="Descripcion[]" oninput="showSuggestions(this)">
            <div class="absolute bg-white border border-gray-300 w-full max-h-40 overflow-auto z-10 hidden"></div>
        </td>
        <td class="py-2 px-4 border border-gray-300">
            <input type="number" class="w-full px-3 py-2 border rounded" name="Cantidad[]" min=1 step="1">
        </td>
        <td class="py-2 px-4 border border-gray-300">
            <input type="number" step="0.01" class="w-full px-3 py-2 border rounded" name="P_Unit[]" disabled>
        </td>
        <td class="py-2 px-4 border border-gray-300">
            <input type="number" step="0.01" class="w-full px-3 py-2 border rounded" name="P_Total[]" disabled>
        </td>
        <td class="py-2 px-4 border border-gray-300 flex justify-center content-center leading-8">
            <button type="button" class="bg-red-500 text-white px-2 py-1 rounded eliminarFila">Eliminar</button>
        </td>
    `;

    tableBody.appendChild(newRow);

    const eliminarFilaButtons = document.querySelectorAll('.eliminarFila');
    eliminarFilaButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            row.remove();
            recalculateAllTotals();
        });
    });

    const cantidadInputs = document.querySelectorAll('input[name="Cantidad[]"]');
    cantidadInputs.forEach(input => {
        input.addEventListener('input', (event) => {
            calculateTotal(event.target);
        });
    });

    const precioInputs = document.querySelectorAll('input[name="P_Unit[]"]');
    precioInputs.forEach(input => {
        input.addEventListener('input', (event) => {
            calculateTotal(event.target.closest('tr').querySelector('input[name="Cantidad[]"]'));
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    listarTodasLasCotizaciones();

    document.getElementById('closeEditCotizacionModal').addEventListener('click', () => {
        document.getElementById('editCotizacionModal').classList.add('hidden');
    });

    const clienteSelect = document.getElementById('editar_clienteCotizacionSelect');
    const clienteContactoSelect = document.getElementById('editarClienteContactoSelect');

    fetch(clientesApiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.Id_Cliente;
                option.textContent = cliente.RSocial;
                clienteSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching clients:', error));

    clienteSelect.addEventListener('change', function () {
        const clientId = clienteSelect.value;
        if (clientId) {
            fetchContactos(clientId);
        }
    });

    function fetchContactos(clientId) {
        fetch(contactosApiUrl + clientId)
            .then(response => response.json())
            .then(data => {
                clienteContactoSelect.innerHTML = '';
                data.forEach(contacto => {
                    const option = document.createElement('option');
                    option.value = contacto.Id_Contacto;
                    option.textContent = contacto.Nombre;
                    clienteContactoSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching contacts:', error));
    }

    document.getElementById('editarTipoMonedaSelect').addEventListener('change', function () {
        const moneda = document.getElementById('editarTipoMonedaSelect').value;
        const tipoCambio = parseFloat(document.getElementById('editar_Tipo_Cambio').value);
        
        const itemsTableBody = document.getElementById('editar_itemsTableBody');

        for (let i = 0; i < itemsTableBody.rows.length; i++) {
            const row = itemsTableBody.rows[i];
            const unitPriceInput = row.querySelector('input[name="P_Unit[]"]');
            const quantityInput = row.querySelector('input[name="Cantidad[]"]');
            const totalInput = row.querySelector('input[name="P_Total[]"]');
            const unitPrice = parseFloat(unitPriceInput.dataset.originalPrice);

            if (!isNaN(unitPrice)) {
                if (moneda === "D") {
                    unitPriceInput.value = (unitPrice).toFixed(2);    
                    totalInput.value = (unitPrice * quantityInput.value);    
                    calculateTotal(quantityInput); 
                } else {
                    unitPriceInput.value = (unitPrice * tipoCambio).toFixed(2);
                    totalInput.value = (unitPriceInput.value * parseInt(quantityInput.value)).toFixed(2); 
                    calculateTotal(quantityInput);
                }
            }
        }
        
        recalculateAllTotals();
         
    });
});

function removeRow(button) {
    const row = button.closest('tr');
    row.remove();
    recalculateAllTotals();
}

function calculateTotal(quantityInput) {
    const row = quantityInput.closest('tr');
    const unitPriceInput = row.querySelector('input[name="P_Unit[]"]');
    const totalPriceInput = row.querySelector('input[name="P_Total[]"]');

    const quantity = parseFloat(quantityInput.value);
    const unitPrice = parseFloat(unitPriceInput.value);

    if (!isNaN(quantity) && !isNaN(unitPrice)) {
        totalPriceInput.value = (quantity * unitPrice).toFixed(2);
    } else {
        totalPriceInput.value = '';
    }

    recalculateAllTotals();
}

function recalculateAllTotals() {
    const itemsTableBody = document.getElementById('editar_itemsTableBody');
    let baseImponible = 0;
    for (let i = 0; i < itemsTableBody.rows.length; i++) {
        const row = itemsTableBody.rows[i];
        const totalPriceInput = row.querySelector('input[name="P_Total[]"]');
        const totalPrice = parseFloat(totalPriceInput.value);
        if (!isNaN(totalPrice)) {
            baseImponible += totalPrice;
        }
    }
    document.getElementById('editar_Base_Imponible').value = baseImponible.toFixed(2);
    const igv = baseImponible * 0.18;
    document.getElementById('editar_IGV').value = igv.toFixed(2);
    const total = baseImponible + igv;
    document.getElementById('editar_Total').value = total.toFixed(2);
}

function calculateBaseImponible() {
    return parseFloat(document.getElementById('editar_Base_Imponible').value) || 0;
}

function calculateIGV() {
    return parseFloat(document.getElementById('editar_IGV').value) || 0;
}

function calculateTotalCotizacion() {
    return parseFloat(document.getElementById('editar_Total').value) || 0;
}

let products = [];

async function fetchProducts() {
    try {
        const response = await fetch('https://www.pruebaconex.somee.com/api/productos/activos');
        const data = await response.json();
        products = data;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

fetchProducts();

function showSuggestions(input) {
    const value = input.value ? input.value.toLowerCase() : '';
    const suggestionsBox = input.nextElementSibling;

    if (value.length < 1) {
        suggestionsBox.classList.add('hidden');
        return;
    }

    const filteredProducts = products.filter(product => product.Descripcion.toLowerCase().includes(value));
    suggestionsBox.innerHTML = '';
    filteredProducts.forEach(product => {
        const div = document.createElement('div');
        div.textContent = product.Descripcion;
        div.classList.add('px-3', 'py-2', 'cursor-pointer', 'hover:bg-gray-200');
        div.addEventListener('click', () => {
            input.value = product.Descripcion;
            const row = input.closest('tr');
            const unitPriceInput = row.querySelector('input[name="P_Unit[]"]');
            unitPriceInput.dataset.originalPrice = product.Precio;
            if (document.getElementById('editarTipoMonedaSelect').value === "D") {
                unitPriceInput.value = (product.Precio / parseFloat(document.getElementById('editar_Tipo_Cambio').value)).toFixed(2);
            } else {
                unitPriceInput.value = product.Precio.toFixed(2);
            }
            calculateTotal(row.querySelector('input[name="Cantidad[]"]'));
            suggestionsBox.classList.add('hidden');
        });
        suggestionsBox.appendChild(div);
    });

    if (filteredProducts.length > 0) {
        suggestionsBox.classList.remove('hidden');
    } else {
        suggestionsBox.classList.add('hidden');
    }
}
