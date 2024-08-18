document.addEventListener('DOMContentLoaded', function () {
    const clientesApiUrl = 'https://www.pruebaconex.somee.com/api/clientes';
    const contactosxclientAPI = 'https://www.pruebaconex.somee.com/api/contactos/cliente/';
    const contactoAPI = 'https://www.pruebaconex.somee.com/api/contactos/';

    const clienteSelect = document.getElementById('clienteSelect');
    const contactosTbody = document.getElementById('contactosTbody');
    
    let contactoclienteSelect = document.getElementById('contactoclienteSelect');
 


    // Fetch and populate clients in the combobox
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
        } else {
            contactosTbody.innerHTML = '';
        }
    });


    //  LLENA EL COMBOBOX CLIENTES 
    fetch(clientesApiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.Id_Cliente;
                option.textContent = cliente.RSocial;
                contactoclienteSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching clients:', error));



    // Function to fetch and display contacts
    function fetchContactos(clientId) {
        fetch(contactosxclientAPI + clientId)
            .then(response => response.json())
            .then(data => {
                contactosTbody.innerHTML = '';
                data.forEach(contacto => {
                    const row = document.createElement('tr');

                    const nombreCell = document.createElement('td');
                    nombreCell.classList.add('py-3', 'px-6', 'border', 'border-gray-300', 'text-center');
                    nombreCell.textContent = contacto.Nombre;
                    row.appendChild(nombreCell);

                    const telefonoCell = document.createElement('td');
                    telefonoCell.classList.add('py-3', 'px-6', 'border', 'border-gray-300', 'text-center');
                    telefonoCell.textContent = contacto.Telefono;
                    row.appendChild(telefonoCell);

                    const correoCell = document.createElement('td');
                    correoCell.classList.add('py-3', 'px-6', 'border', 'border-gray-300', 'text-center');
                    correoCell.textContent = contacto.Correo;
                    row.appendChild(correoCell);

                    const accionesCell = document.createElement('td');
                    accionesCell.classList.add('py-3', 'px-6', 'border', 'border-gray-300', 'text-center');
                    
                    const editarButton = document.createElement('button');
                    editarButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded');
                    editarButton.textContent = 'Editar';
                    editarButton.onclick = () => mostrarModalEditarContacto(contacto.Id_Contacto);
                    accionesCell.appendChild(editarButton);

                    row.appendChild(accionesCell);

                    contactosTbody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching contacts:', error));
    }

    // Function to fetch a contact by client ID
    async function mostrarContactoPorCliente(codigo) {
        try {
            const response = await fetch(`https://www.pruebaconex.somee.com/api/contactos/${codigo}`);
            if (!response.ok) throw new Error('Error al obtener el contacto');
            const contacto = await response.json();
            return contacto;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to show the edit contact modal
    async function mostrarModalEditarContacto(codigo) {
        try {
            const contacto = await mostrarContactoPorCliente(codigo);
            if (!contacto) return;

            console.log(contacto);

            document.getElementById("editIdContactoCliente").value = contacto[0].Id_Contacto
            document.getElementById('editNombreContacto').value = contacto[0].Nombre;
            document.getElementById('editTelefonoContacto').value = contacto[0].Telefono;
            document.getElementById('editCorreoContacto').value = contacto[0].Correo;
            document.getElementById('editActivoContacto').checked = contacto[0].Activo;
            document.getElementById("editar_forma_pago_contacto").selectedIndex = contacto[0].Id_FormaPago;

            document.getElementById('editContactModal').classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const editContactoForm = document.getElementById('editContactoForm');
    editContactoForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('editIdContactoCliente').value;
        const nombre = document.getElementById('editNombreContacto').value;
        const telefono = document.getElementById('editTelefonoContacto').value;
        const correo = document.getElementById('editCorreoContacto').value;
        const activo = document.getElementById('editActivoContacto').checked;
        const Id_FormaPago = parseInt(document.getElementById("editar_forma_pago_contacto").value);

        const contactoActualizado = {
            nombre,
            telefono,
            correo,
            activo,
            Id_FormaPago
        };

       
        actualizarContacto(id, contactoActualizado).then(() => {
            const clientId = clienteSelect.value;
            if (clientId) {
                fetchContactos(clientId);
            }
            document.getElementById('editContactModal').classList.add('hidden');
        });
    });

    document.getElementById('closeEditContactoModal').addEventListener('click', () => {
        document.getElementById('editContactModal').classList.add('hidden');
    });

    // Function to update a contact
    async function actualizarContacto(id, contacto) {
        try {
            console.log(contacto);
            
            const response = await fetch(`${contactoAPI}${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contacto)
            });
            if (!response.ok) throw new Error('Error al actualizar el contacto');
        } catch (error) {
            console.error('Error:', error);
        }
    }


    const createContactoForm = document.getElementById('createContactoForm');
    createContactoForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nombre = document.getElementById('nombreContactoInp').value;
        const telefono = document.getElementById('telefonoContactoInp').value;
        const correo = document.getElementById('correoContactoInp').value;
        const id_formapago = parseInt(document.getElementById('forma_pago_contacto').value);   
        const id_cliente = parseInt(contactoclienteSelect.value);     
        const nuevoContacto = {
            nombre,
            telefono,
            correo,
            id_cliente,
            id_formapago
        };

        console.log(nuevoContacto);
        

        crearContacto(nuevoContacto).then(() => {
            createContactoForm.reset();
        });
    });


    // Función para crear un nuevo cliente
async function crearContacto(contacto) {
    try {
        const response = await fetch(contactoAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contacto)
        });
        if (!response.ok) throw new Error('Error al crear el contacto');
        const nuevoContacto = await response.json();
        console.log(nuevoContacto);
    } catch (error) {
        console.error('Error:', error);
    }
}

});
