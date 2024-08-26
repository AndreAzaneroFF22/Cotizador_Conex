document.addEventListener('DOMContentLoaded', function() {
    fetch('https://www.pruebaconex.somee.com/api/usuario/listar')
        .then(response => response.json())
        .then(data => {
            const tbodyUsuarios = document.getElementById('tbodyUsuarios');
            tbodyUsuarios.innerHTML = ''; // Limpiar la tabla antes de agregar filas

            data.forEach((usuario, index) => {
                const row = document.createElement('tr');



                // Columna del número
                const tdNumero = document.createElement('td');
                tdNumero.className = 'py-3 px-6 border text-center border-gray-300';
                tdNumero.textContent = index + 1;
                row.appendChild(tdNumero);

                // Columna del nombre de usuario
                const tdUsuario = document.createElement('td');
                tdUsuario.className = 'py-3 px-6 border text-center border-gray-300';
                tdUsuario.textContent = usuario.Usuario;
                row.appendChild(tdUsuario);

                // Columna de estado
                const tdEstado = document.createElement('td');
                tdEstado.className = 'py-3 px-6 border text-center border-gray-300';
                tdEstado.textContent = usuario.Activo ? 'Activo' : 'Inactivo';
                row.appendChild(tdEstado);

                // Columna de editar/eliminar
                const accionesCell = document.createElement('td');
                accionesCell.classList.add('py-3', 'px-6','border','border-gray-300','text-center');

                const editarButton = document.createElement('button');
                editarButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded');
                editarButton.textContent = 'Editar';
                // editarButton.onclick = () => mostrarModalEditarProducto(producto.Codigo);
                accionesCell.appendChild(editarButton);

                const eliminarButton = document.createElement('button');
                eliminarButton.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded');
                eliminarButton.textContent = 'Eliminar';
                // eliminarButton.onclick = () => eliminarProducto(producto.Codigo);
                accionesCell.appendChild(eliminarButton);
        

                row.appendChild(accionesCell);
                // Añadir la fila a la tabla
                tbodyUsuarios.appendChild(row);
            });
        })
        .catch(error => console.error('Error al listar usuarios:', error));
});