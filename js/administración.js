

const crearUsuarioApi = "https://www.pruebaconex.somee.com/api/usuario"
const btnAbrirlModalCrearUsuario = document.getElementById("btnCrearUsuario");
const btnCerrarModalUsuario = document.getElementById("btnCerrarModalCrearUsuario");




btnCerrarModalUsuario.onclick = () => document.getElementById("crearUsuarioModal").classList.add("hidden");
btnAbrirlModalCrearUsuario.onclick = () => document.getElementById("crearUsuarioModal").classList.remove("hidden");



document.getElementById("crearUsuarioFormulario").addEventListener("submit",(e)=>{
          e.preventDefault();
          
          const usuario = document.getElementById("crearUsuarioFormulario")["nombreUsuario"].value;
          const contra = document.getElementById("crearUsuarioFormulario")["contraUsuario"].value;
          const crearCotizacion = document.querySelector('input[name="crearCotizacion"]').checked;
          const editarCotizacion = document.querySelector('input[name="editarCotizacion"]').checked;
          const crearProducto = document.querySelector('input[name="crearProducto"]').checked;
          const editarProducto = document.querySelector('input[name="editarProducto"]').checked;
          const estadoUsuario = document.getElementById("estadoUsuario").checked;

          const nuevoUsuario = {
            Usuario:usuario,
            Psswd:contra,
            Auto_Crear_Cot: crearCotizacion,
            Auto_Editar_Cot:editarCotizacion,
            Auto_Crear_Prod: crearProducto,
            Auto_Editar_Prod: editarProducto,
            Activo: estadoUsuario
        };

 
          
        crearUsuario(nuevoUsuario).then(() => {
            Swal.fire({
                title: 'Usuario Creado',
                text: 'El usuario ha sido creado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                location.reload();
            });
        });

          
});

 // Función para crear un nuevo usuario
async function crearUsuario(usuario) {
    try {
        const response = await fetch(crearUsuarioApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) throw new Error('Error al crear el usuario');

    } catch (error) {
        console.error('Error:', error);
    }
}


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