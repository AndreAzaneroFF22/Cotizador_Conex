

const crearUsuarioApi = "https://apiconexcot.somee.com/api/usuario"
const actualizarUsuarioApi = "https://apiconexcot.somee.com/api/usuario/"
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

async function actualizarEstado(id, usuario) {
    let estadoInicial = usuario.Activo;
    let { Psswd, Auto_Crear, Auto_Crear_Prod, Auto_Editar, Auto_Editar_Prod } = usuario;

    
    let nuevoEstadoUsuario = {
        Psswd,
        Auto_Crear_Cot: Auto_Crear,
        Auto_Editar_Cot: Auto_Editar,
        Auto_Crear_Prod,
        Auto_Editar_Prod,
        Activo: !estadoInicial
    };

    try {
        const response = await fetch(`${actualizarUsuarioApi}${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoEstadoUsuario)
        });

        if (!response.ok) throw new Error('Error al cambiar estado');

        Swal.fire({
            title: 'Estado cambiado',
            text: 'El estado del usuario se cambió exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            location.reload(); // Se recarga la página cuando el usuario hace clic en 'OK'
        });

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al cambiar el estado del usuario.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}


document.getElementById('closeEditUsuarioModal').onclick = () => document.getElementById('editUsuarioModal').classList.add('hidden');


async function mostrarModalEditarUsuario(usuario) {

    document.getElementById("edicionNombreUsuario").value = usuario.Usuario;
    document.getElementById('edicionContraUsuario').value = usuario.Psswd;

    // Selecciona el radio button correspondiente para 'edicionCrearCotizacion'
    document.querySelector(`input[name="edicionCrearCotizacion"][value="${usuario.Auto_Crear}"]`).checked = true;
    // Selecciona el radio button correspondiente para 'edicionEditarCotizacion'
    document.querySelector(`input[name="edicionEditarCotizacion"][value="${usuario.Auto_Editar}"]`).checked = true;
    // Selecciona el radio button correspondiente para 'edicionCrearProducto'
    document.querySelector(`input[name="edicionCrearProducto"][value="${usuario.Auto_Crear_Prod}"]`).checked = true;
    // Selecciona el radio button correspondiente para 'edicionEditarProducto'
    document.querySelector(`input[name="edicionEditarProducto"][value="${usuario.Auto_Editar_Prod}"]`).checked = true;
    // Marca el checkbox del estado del usuario
    document.getElementById("edicionEstadoUsuario").checked = usuario.Activo;
    // Muestra el modal
    document.getElementById('editUsuarioModal').classList.remove('hidden');
}


const editUsuarioForm = document.getElementById('editUsuarioForm');
editUsuarioForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    let id = document.getElementById("edicionNombreUsuario").value;

    const contra = document.getElementById('edicionContraUsuario').value;
    const crearCotizacion = document.querySelector('input[name="edicionCrearCotizacion"]').checked;
    const editarCotizacion = document.querySelector('input[name="edicionEditarCotizacion"]').checked;
    const crearProducto = document.querySelector('input[name="edicionCrearProducto"]').checked;
    const editarProducto = document.querySelector('input[name="edicionEditarProducto"]').checked;
    const estadoUsuario = document.getElementById("edicionEstadoUsuario").checked;

    let usuarioActualizado = {
        Psswd:contra,
        Auto_Crear_Cot: crearCotizacion,
        Auto_Editar_Cot: editarCotizacion,
        Auto_Crear_Prod:crearProducto,
        Auto_Editar_Prod:editarProducto,
        Activo: estadoUsuario
    };



    try {
        const response = await fetch(`${actualizarUsuarioApi}${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioActualizado)
        });

        if (!response.ok) throw new Error('Error al actualizar usuario');

        Swal.fire({
            title: 'Usuario actualizado',
            text: 'El usuario se actualizo exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            location.reload(); // Se recarga la página cuando el usuario hace clic en 'OK'
        });

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar actualizar el usuario.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

});


document.addEventListener('DOMContentLoaded', function() {
    fetch('https://apiconexcot.somee.com/api/usuario/listar')
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
                editarButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded','mr-3');
                editarButton.textContent = 'Editar';
                editarButton.onclick = () =>   mostrarModalEditarUsuario(usuario);
                accionesCell.appendChild(editarButton);

                const estadoButton = document.createElement('button');
                estadoButton.classList.add('bg-yellow-500', 'text-white', 'px-4', 'py-2', 'rounded','ml-3');
                estadoButton.textContent = 'Cambiar Estado';
                estadoButton.onclick = () => actualizarEstado(usuario.Usuario,usuario);
                accionesCell.appendChild(estadoButton);
        

                row.appendChild(accionesCell);
                // Añadir la fila a la tabla
                tbodyUsuarios.appendChild(row);
            });
        })
        .catch(error => console.error('Error al listar usuarios:', error));
});