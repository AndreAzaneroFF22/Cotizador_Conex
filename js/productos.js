const API_URL = "https://www.pruebaconex.somee.com/api/productos";
const API_PERMISOS_USER = "http://www.pruebaconex.somee.com/api/usuario?usuario="
const PRODUCTS_PER_PAGE = 9;
let currentPage = 1;
let allProductos = [];


let userLogueado = localStorage.getItem("usuario");
let permisos = "";


// Fetch permisos
fetch(`${API_PERMISOS_USER}${userLogueado}`)
.then(response => response.json())
.then(data => {
     permisos = data;
})
.catch(error => console.error('Error fetching clients:', error));



// Función para listar todos los productos
async function listarTodosLosProductos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al listar productos');
        allProductos = await response.json();
        renderProductos(currentPage, allProductos);
        renderPaginacion(allProductos.length, currentPage);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para renderizar productos con paginación
function renderProductos(page, productos) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = page * PRODUCTS_PER_PAGE;
    const productosToShow = productos.slice(startIndex, endIndex);
    const {EditarProducto} = permisos;

    
    productosToShow.forEach(producto => {
        const row = document.createElement('tr');
        row.classList.add('border', 'border-gray-300');

        const codigoCell = document.createElement('td');
        codigoCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        codigoCell.textContent = producto.Codigo;
        row.appendChild(codigoCell);

        const descripcionCell = document.createElement('td');
        descripcionCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        descripcionCell.textContent = producto.Descripcion;
        row.appendChild(descripcionCell);

        const pesoCell = document.createElement('td');
        pesoCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        pesoCell.textContent = producto.Peso;
        row.appendChild(pesoCell);

        const precioCell = document.createElement('td');
        precioCell.classList.add('py-3', 'px-6','border', 'border-gray-300');
        precioCell.textContent = producto.Precio;
        row.appendChild(precioCell);

        const accionesCell = document.createElement('td');
        accionesCell.classList.add('py-3', 'px-6','border', 'border-gray-300','flex','justify-center','gap-x-4');

        const editarButton = document.createElement('button');
        if (EditarProducto) {
            editarButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded');
        } else {
            editarButton.classList.add('bg-blue-200', 'text-white', 'px-4', 'py-2', 'rounded','pointer-events-none');
        }
        editarButton.textContent = 'Editar';
        editarButton.onclick = () => mostrarModalEditarProducto(producto.Codigo);
        accionesCell.appendChild(editarButton);

        const eliminarButton = document.createElement('button');
        if (EditarProducto) {
            eliminarButton.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded');
        } else {
            eliminarButton.classList.add('bg-red-200', 'text-white', 'px-4', 'py-2', 'rounded','pointer-events-none');
        } 
        eliminarButton.textContent = 'Eliminar';
        eliminarButton.onclick = () => eliminarProducto(producto.Codigo);
        accionesCell.appendChild(eliminarButton);

        row.appendChild(accionesCell);
        tbody.appendChild(row);
    });
}

// Función para renderizar la paginación
function renderPaginacion(totalProductos, page) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalProductos / PRODUCTS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('px-3', 'py-1', 'border', 'mx-1', 'rounded');
        if (i === page) {
            button.classList.add('bg-gray-700', 'text-white');
        } else {
            button.classList.add('bg-gray-200');
            button.addEventListener('click', () => {
                currentPage = i;
                renderProductos(currentPage, allProductos);
                renderPaginacion(totalProductos, currentPage);
            });
        }
        button.textContent = i;
        pagination.appendChild(button);
    }
}

// Función para mostrar un producto por código
async function mostrarProductoPorCodigo(codigo) {
    try {
        const response = await fetch(`${API_URL}/${codigo}`);
        if (!response.ok) throw new Error('Error al obtener el producto');
        const producto = await response.json();
        return producto;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para validar si el código de un producto ya existe
async function validarCodigoProducto(codigo) {
    try {
        const response = await fetch(`${API_URL}/validar/${codigo}`);
        if (!response.ok) throw new Error('Error al validar el código del producto');
        const existe = await response.json();
        return existe;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para crear un nuevo producto
async function crearProducto(producto) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });
        if (!response.ok) throw new Error('Error al crear el producto');
        const nuevoProducto = await response.json();
        console.log('Producto creado:', nuevoProducto);
        listarTodosLosProductos();  // Actualizar la lista después de crear el producto

        setInterval(function() {
            location.reload();
          }, 2000);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para mostrar el modal de edición de producto
async function mostrarModalEditarProducto(codigo) {
    try {
        const producto = await mostrarProductoPorCodigo(codigo);
        if (!producto) return;

        document.getElementById('editCodigo').value = producto[0].Codigo;
        document.getElementById('editDescripcion').value = producto[0].Descripcion;
        document.getElementById('editPeso').value = producto[0].Peso;
        document.getElementById('editPrecio').value = producto[0].Precio;
        document.getElementById('editActivo').checked = producto[0].Activo;

        document.getElementById('editProductModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
    }
     
}

// Función para actualizar un producto
async function actualizarProducto(codigo, producto) {
    try {
        const response = await fetch(`${API_URL}/${codigo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });
        if (!response.ok) throw new Error('Error al actualizar el producto');
        const productoActualizado = await response.json();
        console.log('Producto actualizado:', productoActualizado);
        listarTodosLosProductos();  // Actualizar la lista después de actualizar el producto
        location.reload();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para eliminar un producto
async function eliminarProducto(codigo) {
    try {
        const response = await fetch(`${API_URL}/${codigo}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar el producto');
        console.log(`Producto con código ${codigo} eliminado`);
        listarTodosLosProductos();  // Actualizar la lista después de eliminar el producto
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para filtrar productos por descripción
function filtrarProductosPorDescripcion(descripcion) {
    const productosFiltrados = allProductos.filter(producto =>
        producto.Descripcion.toLowerCase().includes(descripcion.toLowerCase())
    );
    renderProductos(1, productosFiltrados);
    renderPaginacion(productosFiltrados.length, 1);
}

// Ejemplo de uso
document.addEventListener('DOMContentLoaded', () => {
    listarTodosLosProductos();

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (event) => {
        const descripcion = event.target.value;
        filtrarProductosPorDescripcion(descripcion);
    });

    const createProductForm = document.getElementById('createProductForm');
    createProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const codigo = document.getElementById('codigo').value;
        const descripcion = document.getElementById('descripcion').value;
        const peso = document.getElementById('peso').value;
        const precio = document.getElementById('precio').value;

        const productoExiste = await validarCodigoProducto(codigo);
        if (productoExiste) {
            alert('El código del producto ya existe.');
            return;
        }

        const nuevoProducto = {
            Codigo: codigo,
            Descripcion: descripcion,
            Peso: parseFloat(peso),
            Precio: parseFloat(precio)
        };

        crearProducto(nuevoProducto).then(() => {
            listarTodosLosProductos();
            createProductForm.reset();
        });
    });

    const editProductForm = document.getElementById('editProductForm');
    editProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const codigo = document.getElementById('editCodigo').value;
        const descripcion = document.getElementById('editDescripcion').value;
        const peso = document.getElementById('editPeso').value;
        const precio = document.getElementById('editPrecio').value;
        const activo = document.getElementById('editActivo').checked;

        const productoActualizado = {
            Descripcion: descripcion,
            Peso: parseFloat(peso),
            Precio: parseFloat(precio),
            Activo: activo
        };

        actualizarProducto(codigo, productoActualizado).then(() => {
            listarTodosLosProductos();
            document.getElementById('editProductModal').classList.add('hidden');
        });
    });

    document.getElementById('closeEditModal').addEventListener('click', () => {
        document.getElementById('editProductModal').classList.add('hidden');
    });
});
