let usuarioLogeado = localStorage.getItem("usuario");

const API_URL = "https://www.pruebaconex.somee.com/api/cotizaciones/usuario/";
const COTIZACIONES_PER_PAGE = 12;
let currentPage = 1;
let allCotizaciones = [];

const clientesApiUrl = 'https://www.pruebaconex.somee.com/api/clientes';
const contactosApiUrl = 'https://www.pruebaconex.somee.com/api/contactos/cliente/';

async function listarTodasLasCotizaciones() {
    try {
        const response = await fetch(`${API_URL}/${usuarioLogeado}`);
        if (!response.ok) throw new Error('Error al listar cotizaciones');
        allCotizaciones = await response.json();
        renderCotizaciones(currentPage, allCotizaciones);
        renderPaginacion(allCotizaciones.length, currentPage);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderCotizaciones(page, productos) {
    const tbody = document.getElementById("tbodyCotizacion");
    tbody.innerHTML = '';
    const startIndex = (page - 1) * COTIZACIONES_PER_PAGE;
    const endIndex = page * COTIZACIONES_PER_PAGE;
    const CotizacionesToShow = productos.slice(startIndex, endIndex);

    CotizacionesToShow.forEach(cotizacion => {
        const row = document.createElement('tr');
        row.classList.add('border', 'border-gray-300');

        const codigoCell = document.createElement('td');
        codigoCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        codigoCell.textContent = cotizacion.Id_Cotizacion;
        row.appendChild(codigoCell);

        const clienteCell = document.createElement('td');
        clienteCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        clienteCell.textContent = cotizacion.Cliente;
        row.appendChild(clienteCell);

        const contactoCell = document.createElement('td');
        contactoCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        contactoCell.textContent = cotizacion.Contacto;
        row.appendChild(contactoCell);

        const monedaCell = document.createElement('td');
        monedaCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        monedaCell.textContent = cotizacion.Moneda === "S" ? "Soles" : "Dólares";
        row.appendChild(monedaCell);

        const totalCell = document.createElement('td');
        totalCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        totalCell.textContent = cotizacion.Total;
        row.appendChild(totalCell);

        const accionesCell = document.createElement('td');
        accionesCell.classList.add('py-3', 'px-6','border', 'border-gray-300','flex','justify-center','gap-x-4');

        const editarButton = document.createElement('button');
        editarButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded');
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
        eliminarButton.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded');
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

async function mostrarModalEditarCotizacion(id) {
    try {
        const cabeceraCotizacion = await mostrarCabeceraCotizacionPorId(id);
        if (!cabeceraCotizacion) return;

        const detalleCotizacion = await mostrarDetalleCotizacionPorId(id);
        if (!detalleCotizacion) return;

        // Rellenar los selectores antes de asignar el valor
        llenarFormasPagoSelect(cabeceraCotizacion[0].FormaPago);
        llenarMonedasSelect(cabeceraCotizacion[0].Moneda);
        await llenarClientesSelect(cabeceraCotizacion[0].Id_Cliente);
        await llenarContactosSelect(cabeceraCotizacion[0].Id_Cliente, cabeceraCotizacion[0].Id_Contacto);

        document.getElementById('editar_Id_Cotizacion').value = cabeceraCotizacion[0].Id_Cotizacion;
        document.getElementById('editar_Dias_validez').value = cabeceraCotizacion[0].Dias_validez;
        document.getElementById('editar_Tipo_Cambio').value = cabeceraCotizacion[0].Tipo_Cambio;
        document.getElementById('editar_Base_Imponible').value = cabeceraCotizacion[0].Base_Imponible;
        document.getElementById('editar_IGV').value = cabeceraCotizacion[0].IGV;
        document.getElementById('editar_Total').value = cabeceraCotizacion[0].Total;

        const tableBody = document.getElementById('editar_itemsTableBody');
        tableBody.innerHTML = ''; // Clear existing rows

        detalleCotizacion.forEach((detalle, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td class="py-2 px-4 border border-gray-300">${index + 1}</td>
                <td class="py-2 px-4 border border-gray-300 relative">
                    <input type="text" class="w-full px-3 py-2 border rounded" name="Descripcion[]" value="${detalle.Descripcion_Producto}" oninput="showSuggestions(this)">
                    <div class="absolute bg-white border border-gray-300 w-full max-h-40 overflow-auto z-10 hidden"></div>
                </td>
                <td class="py-2 px-4 border border-gray-300">
                    <input type="number" class="w-full px-3 py-2 border rounded" name="Cantidad[]" value="${detalle.Cantidad}" oninput="calculateTotal(this)">
                </td>
                <td class="py-2 px-4 border border-gray-300">
                    <input type="number" step="0.01" class="w-full px-3 py-2 border rounded" name="P_Unit[]" value="${detalle.Precio}" oninput="calculateTotal(this)">
                </td>
                <td class="py-2 px-4 border border-gray-300">
                    <input type="number" step="0.01" class="w-full px-3 py-2 border rounded" name="P_Total[]" value="${detalle.Cantidad * detalle.Precio}" disabled>
                </td>
                <td class="py-2 px-4 border border-gray-300 flex justify-center content-center leading-8">
                    <button type="button" class="bg-red-500 text-white px-2 py-1 rounded" onclick="removeRow(this)">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });

        document.getElementById('editCotizacionModal').classList.remove('hidden');
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

async function llenarContactosSelect(clienteId, contactoSeleccionado) {
    const contactoSelect = document.getElementById('editarClienteContactoSelect');
    contactoSelect.innerHTML = '<option value="">--Seleccione un contacto--</option>';
    try {
        const response = await fetch(contactosApiUrl + clienteId);
        const contactos = await response.json();
        contactos.forEach(contacto => {
            const option = document.createElement('option');
            option.value = contacto.Id_Contacto;
            option.textContent = contacto.Nombre;
            contactoSelect.appendChild(option);
        });
        contactoSelect.value = contactoSeleccionado;
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

function llenarFormasPagoSelect(formaPagoSeleccionada) {
    const formaPagoSelect = document.getElementById('editarTipoFormaPagoSelect');
    formaPagoSelect.innerHTML = `
        <option value="1">Crédito 30 días</option>
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
        clienteSelect.value = clienteSeleccionado;
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
}

async function actualizarCotizacion(event) {
    event.preventDefault();
    const idCotizacion = document.getElementById('editar_Id_Cotizacion').value;

    try {
        // Eliminar cabecera y detalle existentes
        await eliminarCabeceraCotizacion(idCotizacion);
        await delay(2000);
        await eliminarDetalleCotizacion(idCotizacion);

        // Crear nueva cabecera
        const nuevaCabecera = {
            Id_Cotizacion: idCotizacion,
            Id_Cliente: document.getElementById('editar_clienteCotizacionSelect').value,
            Id_Contacto: document.getElementById('editarClienteContactoSelect').value,
            Moneda: document.getElementById('editarTipoMonedaSelect').value,
            Id_FormaPago: document.getElementById('editarTipoFormaPagoSelect').value,
            Dias_validez: document.getElementById('editar_Dias_validez').value,
            Usuario: usuarioLogeado,
            Tipo_Cambio: parseFloat(document.getElementById('editar_Tipo_Cambio').value),
            Base_Imponible: parseFloat(document.getElementById('editar_Base_Imponible').value),
            IGV: parseFloat(document.getElementById('editar_IGV').value),
            Total: parseFloat(document.getElementById('editar_Total').value)
        };
        //console.log(nuevaCabecera);
        const cabeceraResponse = await fetch(`https://www.pruebaconex.somee.com/api/cotizaciones/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaCabecera)
        });

        if (!cabeceraResponse.ok) throw new Error('Error al crear la cabecera de la cotización');

        // Crear nuevo detalle
        const items = document.querySelectorAll('#editar_itemsTableBody tr');
        for (const item of items) {
            const detalle = {
                Id_Cotizacion: idCotizacion,
                Item: item.querySelector('td:nth-child(1)').textContent,
                Descripcion_Producto: item.querySelector('input[name="Descripcion[]"]').value,
                Cantidad: item.querySelector('input[name="Cantidad[]"]').value,
                Precio: item.querySelector('input[name="P_Unit[]"]').value
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

        alert('Cotización actualizada exitosamente');
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
            <input type="number" class="w-full px-3 py-2 border rounded" name="Cantidad[]" oninput="calculateTotal(this)">
        </td>
        <td class="py-2 px-4 border border-gray-300">
            <input type="number" step="0.01" class="w-full px-3 py-2 border rounded" name="P_Unit[]" oninput="calculateTotal(this)">
        </td>
        <td class="py-2 px-4 border border-gray-300">
            <input type="number" step="0.01" class="w-full px-3 py-2 border rounded" name="P_Total[]" disabled>
        </td>
        <td class="py-2 px-4 border border-gray-300 flex justify-center content-center leading-8">
            <button type="button" class="bg-red-500 text-white px-2 py-1 rounded" onclick="removeRow(this)">Eliminar</button>
        </td>
    `;

    tableBody.appendChild(newRow);

    const newDescriptionInput = newRow.querySelector('input[name="Descripcion[]"]');
    newDescriptionInput.addEventListener('input', function() {
        showSuggestions(this);
    });

    const newQuantityInput = newRow.querySelector('input[name="Cantidad[]"]');
    newQuantityInput.addEventListener('input', function() {
        calculateTotal(this);
    });

    const newPriceInput = newRow.querySelector('input[name="P_Unit[]"]');
    newPriceInput.addEventListener('input', function() {
        calculateTotal(this);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    listarTodasLasCotizaciones();

    document.getElementById('closeEditCotizacionModal').addEventListener('click', () => {
        document.getElementById('editCotizacionModal').classList.add('hidden');
    });

    // Fetch and populate clients in the combobox
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

    // Fetch and display contacts based on selected client
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
});

function removeRow(button) {
    const row = button.closest('tr');
    row.parentNode.removeChild(row);
    updateTotalCotizacion(); // Ensure totals are updated after removing a row
}

function calculateTotal(input) {
    const row = input.closest('tr');
    const cantidad = parseFloat(row.querySelector('input[name="Cantidad[]"]').value) || 0;
    const precioUnit = parseFloat(row.querySelector('input[name="P_Unit[]"]').value) || 0;
    const total = cantidad * precioUnit;
    row.querySelector('input[name="P_Total[]"]').value = total.toFixed(2);
    updateTotalCotizacion(); // Ensure totals are updated after changing quantity or price
}

function updateTotalCotizacion() {
    const tableBody = document.getElementById('editar_itemsTableBody');
    let totalCotizacion = 0;
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const total = parseFloat(row.querySelector('input[name="P_Total[]"]').value) || 0;
        totalCotizacion += total;
    });

    const baseImponible = totalCotizacion / 1.18; // Assuming IGV is 18%
    const igv = totalCotizacion - baseImponible;

    document.getElementById('editar_Base_Imponible').value = baseImponible.toFixed(2);
    document.getElementById('editar_IGV').value = igv.toFixed(2);
    document.getElementById('editar_Total').value = totalCotizacion.toFixed(2);
}
