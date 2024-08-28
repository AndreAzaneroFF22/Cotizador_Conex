const API_URL_CLIENTES = "https://apiconexcot.somee.com/api/clientes";
const CLIENTES_PER_PAGE = 12;
let currentPageClientes = 1;
let allClientes = [];

// Función para listar todos los clientes
async function listarTodosLosClientes() {
    try {
        const response = await fetch(API_URL_CLIENTES);
        if (!response.ok) throw new Error('Error al listar clientes');
        allClientes = await response.json();
        renderClientes(currentPageClientes, allClientes);
        // renderPaginacionClientes(allClientes.length, currentPageClientes);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para renderizar clientes con paginación
function renderClientes(page, clientes) {
  
    const tbody = document.querySelector('#clientes tbody');
    tbody.innerHTML = '';
    const startIndex = (page - 1) * CLIENTES_PER_PAGE;
    const endIndex = page * CLIENTES_PER_PAGE;
    const clientesToShow = clientes.slice(startIndex, endIndex);

    clientesToShow.forEach(cliente => {
      
        const row = document.createElement('tr');

        const tipdocCell = document.createElement('td');
        tipdocCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        tipdocCell.textContent = cliente.TipDoc=="02"?"RUC":"DNI";
        row.appendChild(tipdocCell);

        const ndocCell = document.createElement('td');
        ndocCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        ndocCell.textContent = cliente.NDoc;
        row.appendChild(ndocCell);

        const rsocialCell = document.createElement('td');
        rsocialCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        rsocialCell.textContent = cliente.RSocial;
        row.appendChild(rsocialCell);

        const direccionCell = document.createElement('td');
        direccionCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        direccionCell.textContent = cliente.Direccion;
        row.appendChild(direccionCell);

        const telefonoCell = document.createElement('td');
        telefonoCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        telefonoCell.textContent = cliente.Telefono;
        row.appendChild(telefonoCell);

        const correoCell = document.createElement('td');
        correoCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        correoCell.textContent = cliente.Correo;
        row.appendChild(correoCell);

        const accionesCell = document.createElement('td');
        accionesCell.classList.add('py-3', 'px-6','border', 'border-gray-300','text-center');

        const editarButton = document.createElement('button');
        editarButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded');
        editarButton.textContent = 'Editar';
        editarButton.onclick = () => mostrarModalEditarCliente(cliente.Id_Cliente);
        accionesCell.appendChild(editarButton);

        row.appendChild(accionesCell);
        tbody.appendChild(row);
    });
}

// Función para renderizar la paginación de clientes
function renderPaginacionClientes(totalClientes, page) {
    const pagination = document.getElementById('paginationClientes');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalClientes / CLIENTES_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('px-3', 'py-1', 'border', 'mx-1', 'rounded');
        if (i === page) {
            button.classList.add('bg-gray-700', 'text-white');
        } else {
            button.classList.add('bg-gray-200');
            button.addEventListener('click', () => {
                currentPageClientes = i;
                renderClientes(currentPageClientes, allClientes);
                renderPaginacionClientes(totalClientes, currentPageClientes);
            });
        }
        button.textContent = i;
        pagination.appendChild(button);
    }
}

// Función para mostrar un cliente por ID
async function mostrarClientePorId(id) {
    try {
        const response = await fetch(`${API_URL_CLIENTES}/${id}`);
        if (!response.ok) throw new Error('Error al obtener el cliente');
        const cliente = await response.json();
        return cliente;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para crear un nuevo cliente
async function crearCliente(cliente) {
    try {
        const response = await fetch(API_URL_CLIENTES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
        if (!response.ok) throw new Error('Error al crear el cliente');
        const nuevoCliente = await response.json();
        console.log('Cliente creado:', nuevoCliente);
        listarTodosLosClientes();  // Actualizar la lista después de crear el cliente
        setTimeout(() => {
            location.reload();
        }, 900);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para mostrar el modal de edición de cliente
async function mostrarModalEditarCliente(id) {
    try {
        const cliente = await mostrarClientePorId(id);
        if (!cliente) return;

        document.getElementById('editIdCliente').value = cliente[0].Id_Cliente;
        document.getElementById('editTipdoc').value = cliente[0].TipDoc;
        document.getElementById('editNdoc').value = cliente[0].NDoc;
        document.getElementById('editRsocial').value = cliente[0].RSocial;
        document.getElementById('editDireccion').value = cliente[0].Direccion;
        document.getElementById('editTelefono').value = cliente[0].Telefono;
        document.getElementById('editCorreo').value = cliente[0].Correo;
        document.getElementById('editActivoCliente').checked = cliente[0].Activo;

        document.getElementById('editClienteModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para actualizar un cliente
async function actualizarCliente(id, cliente) {
    try {
      
    console.log(cliente);   
        const response = await fetch(`${API_URL_CLIENTES}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
        if (!response.ok) throw new Error('Error al actualizar el cliente');
        const clienteActualizado = await response.json();
        console.log('Cliente actualizado:', clienteActualizado);
        listarTodosLosClientes();  // Actualizar la lista después de actualizar el cliente
    } catch (error) {
        console.error('Error:', error);
    }
}


// Función para filtrar clientes por razón social
function filtrarClientesPorRazonSocial(rsocial) {
    const clientesFiltrados = allClientes.filter(cliente =>
        cliente.RSocial.toLowerCase().includes(rsocial.toLowerCase())
    );
    renderClientes(1, clientesFiltrados);
    renderPaginacionClientes(clientesFiltrados.length, 1);
}

// Ejemplo de uso
document.addEventListener('DOMContentLoaded', () => {
    listarTodosLosClientes();

    const searchInputClientes = document.getElementById('searchInputClientes');
    searchInputClientes.addEventListener('input', (event) => {
        const rsocial = event.target.value;
        filtrarClientesPorRazonSocial(rsocial);
    });

    const createClienteForm = document.getElementById('createClienteForm');
    createClienteForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const tipdoc = document.getElementById('tipdoc').value;
        const ndoc = document.getElementById('ndoc').value;
        const rsocial = document.getElementById('rsocial').value;
        const direccion = document.getElementById('direccion').value;
        const telefono = document.getElementById('telefono').value;
        const correo = document.getElementById('correo').value;

        const nuevoCliente = {
            tipdoc,
            ndoc,
            rsocial,
            direccion,
            telefono,
            correo
        };

        crearCliente(nuevoCliente).then(() => {
            listarTodosLosClientes();
            createClienteForm.reset();
        });
    });

    const editClienteForm = document.getElementById('editClienteForm');
    editClienteForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('editIdCliente').value;
        const tipdoc = document.getElementById('editTipdoc').value;
        const ndoc = document.getElementById('editNdoc').value;
        const rsocial = document.getElementById('editRsocial').value;
        const direccion = document.getElementById('editDireccion').value;
        const telefono = document.getElementById('editTelefono').value;
        const correo = document.getElementById('editCorreo').value;
        const activo = document.getElementById('editActivoCliente').checked;

        const clienteActualizado = {
            tipdoc,
            ndoc,
            rsocial,
            direccion,
            telefono,
            correo,
            activo
        };

        actualizarCliente(id, clienteActualizado).then(() => {
            listarTodosLosClientes();
            document.getElementById('editClienteModal').classList.add('hidden');
        });
    });

    document.getElementById('closeEditClienteModal').addEventListener('click', () => {
        document.getElementById('editClienteModal').classList.add('hidden');
    });
});
