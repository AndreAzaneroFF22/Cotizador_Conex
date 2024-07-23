let usuarioLogeado  = localStorage.getItem("usuario");

const API_URL = "http://www.pruebaconex.somee.com/api/cotizaciones/usuario/";
const COTIZACIONES_PER_PAGE = 12;
let currentPage = 1;
let allCotizaciones = [];

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
        monedaCell.textContent = cotizacion.moneda == "S" ? "Soles":"Dolares";
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
        // editarButton.onclick = () => mostrarModalEditarCotizacion(cotizacion.Codigo);
        accionesCell.appendChild(editarButton);

        const imprimirButton = document.createElement('button');
        imprimirButton.classList.add('bg-yellow-500', 'text-white', 'px-4', 'py-2', 'rounded');
        imprimirButton.textContent = '🖨️';
        imprimirButton.onclick = () => {
             localStorage.setItem("IdCotizacion",cotizacion.Id_Cotizacion);
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
        const response = await fetch(`http://www.pruebaconex.somee.com/api/cotizaciones/${codigo}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar la cotizacion');
        console.log(`Cotizacion con código ${codigo} eliminado`);
        listarTodasLasCotizaciones();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function eliminarDetalleCotizacion(codigo) {
    try {
        const response = await fetch(`http://www.pruebaconex.somee.com/api/cotizacionesdet/${codigo}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar detalle cotizacion');
        console.log(`Detalle Cotizacion con código ${codigo} eliminado`);
        listarTodasLasCotizaciones();
    } catch (error) {
        console.error('Error:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    listarTodasLasCotizaciones();
});