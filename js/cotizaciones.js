document.addEventListener('DOMContentLoaded', function() {
 
    const clientesApiUrl = 'https://www.pruebaconex.somee.com/api/clientes';
    const contactosApiUrl = 'https://www.pruebaconex.somee.com/api/contactos/cliente/';
    const clienteSelect = document.getElementById('clienteCotizacionSelect');
    const clienteContactoSelect = document.getElementById("clienteContactoSelect");
    const tipoMonedaSelect = document.getElementById("tipoMonedaSelect");
    const tipoCambioInput = document.getElementById("Tipo_Cambio");
    const usuario = localStorage.getItem("usuario");  
  

//    ACTUALIZA EL NUMERO CORRELATIVO DE LA COTIZACION
    function actualizarCorrelativo() {
        // Fetch and populate clients in the combobox
        fetch("https://www.pruebaconex.somee.com/api/cotizaciones/siguiente")
        .then(response => response.json())
        .then(data => {
            document.getElementById("Id_Cotizacion").value = data
        })

    }

//  MANTIENE ACTUALIZADO EL CORRELATIVO CADA 3 SEGUNDOS
    setInterval(actualizarCorrelativo, 3000);

//  LLENA EL COMBOBOX CLIENTES 
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

//  LLENA EL COMBOBOX CONTACTOS DE ACUERDO AL CLIENTE SELECCIONADO
    clienteSelect.addEventListener('change', function () {
        const clientId = clienteSelect.value;
        if (clientId) {
            fetchContactos(clientId);
        }
    });

//  OBTIENE EL LISTADO DE CONTACTOS DEPENDIENDO DEL ID DEL CLIENTE
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

 
    // Handle currency change
    tipoMonedaSelect.addEventListener('change', function () {

        const moneda = tipoMonedaSelect.value;
        const tipoCambio = parseFloat(tipoCambioInput.value);


        const itemsTableBody = document.getElementById('itemsTableBody');


        for (let i = 0; i < itemsTableBody.rows.length; i++) {
            const row = itemsTableBody.rows[i];
            const unitPriceInput = row.querySelector('input[name="P_Unit[]"]');
            const quantityInput = row.querySelector('input[name="Cantidad[]"]');
            const totalInput = row.querySelector('input[name="P_Total[]"]');
            const unitPrice = parseFloat(unitPriceInput.dataset.originalPrice);

    
 

            if (!isNaN(unitPrice)) {
                if (moneda === "D") {
                    unitPriceInput.value = (unitPrice).toFixed(2);    
                    totalInput.value = (unitPrice*quantityInput.value);    
                    calculateTotal(quantityInput); 
                } else {
                    unitPriceInput.value = (unitPrice * tipoCambio).toFixed(2);
                    totalInput.value = (unitPriceInput.value * parseInt(quantityInput.value)).toFixed(2) 
                    calculateTotal(quantityInput);
                }
                // calculateTotal(quantityInput);
            }
        }
        
        recalculateAllTotals();


    });


    document.getElementById("addItem").addEventListener("click", () => {
        const tableBody = document.getElementById('itemsTableBody');
        const rowCount = tableBody.rows.length + 1;
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td class="py-2 px-4 border border-gray-300">${rowCount}</td>
            <td class="py-2 px-4 border border-gray-300 relative">
                <input type="text" class="w-full px-3 py-2 border rounded" name="Descripcion[]" oninput="showSuggestions(this)">
                <div class="absolute bg-white border border-gray-300 w-full max-h-40 overflow-auto z-10 hidden"></div>
            </td>
            <td class="py-2 px-4 border border-gray-300">
                <input type="number" class="w-full px-3 py-2 border rounded cantidadItemCot"  min="1" step="1" name="Cantidad[]" oninput="calculateTotal(this)">
            </td>
            <td class="py-2 px-4 border border-gray-300">
                <input type="number" step="0.01" class="w-full px-3 py-2 border rounded" name="P_Unit[]" disabled>
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
    });

    window.removeRow = function(button) {
        const row = button.closest('tr');
        row.remove();
        recalculateAllTotals();
    }

    document.getElementById('createCotizacionForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const cotizacionData = {
            Id_Cotizacion: document.getElementById("Id_Cotizacion").value, // Placeholder
            Id_Cliente: clienteSelect.value,
            Id_Contacto: clienteContactoSelect.value,
            Moneda: tipoMonedaSelect.value,
            Id_FormaPago: document.getElementById("tipoFormaPagoSelect").value,
            Dias_validez: parseInt(formData.get("Dias_validez")),
            Usuario: usuario, // Placeholder
            Tipo_Cambio: parseFloat(tipoCambioInput.value),
            Base_Imponible: calculateBaseImponible(),
            IGV: calculateIGV(),
            Total: calculateTotal()
        };

        
        try {
            console.log(cotizacionData);
            const response = await fetch("https://www.pruebaconex.somee.com/api/cotizaciones/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cotizacionData),
            });
            
            if (response.ok) {
                const data = await response.json();
                Swal.fire("¡Éxito!", "Cotización creada correctamente", "success");
                await createDetalles(document.getElementById("Id_Cotizacion").value);
                document.getElementById('createCotizacionForm').reset();
                
                setInterval(function() {
                    location.reload();
                  }, 2000);

            } else {
                const errorData = await response.json();
                Swal.fire("Error", `Hubo un problema al crear la cotización: ${errorData.message}`, "error");
            }
        } catch (error) {
            Swal.fire("Error", `Hubo un problema al crear la cotización: ${error.message}`, "error");
        }
    });

    async function createDetalles(idCotizacion) {
        const itemsTableBody = document.getElementById('itemsTableBody');
        for (let i = 0; i < itemsTableBody.rows.length; i++) {
            const row = itemsTableBody.rows[i];
            const descripcionProducto = row.querySelector('input[name="Descripcion[]"]').value;
            const product = products.find(p => p.Descripcion == descripcionProducto);
            const idProducto = product ? product.Id_Producto : 0; // Asigna 0 si no se encuentra el producto

    
            const detalleData = {
                Id_Cotizacion: idCotizacion,
                Item: i + 1,
                Id_Producto: idProducto, // Placeholder
                Cantidad: row.querySelector('input[name="Cantidad[]"]').value,
                Precio: row.querySelector('input[name="P_Unit[]"]').value,
                Descripcion_Producto: row.querySelector('input[name="Descripcion[]"]').value
            };


            try {
                
                console.log(detalleData);
                const response = await fetch("https://www.pruebaconex.somee.com/api/cotizacionesdet", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(detalleData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    Swal.fire("Error", `Hubo un problema al crear el detalle: ${errorData.message}`, "error");
                }
            } catch (error) {
                Swal.fire("Error", `Hubo un problema al crear el detalle: ${error.message}`, "error");
            }
        }
    }

    let products = [];

    async function fetchProducts() {
        try {
            const response = await fetch('https://www.pruebaconex.somee.com/api/productos/activos');
            const data = await response.json();
            products = data; // Store the whole product objects
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    fetchProducts();

    window.showSuggestions = function(input) {
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
                unitPriceInput.dataset.originalPrice = product.Precio; // Store the original price dolares
                if (tipoMonedaSelect.value === "D") {
                    unitPriceInput.value = (product.Precio).toFixed(2);
                } else {
                    unitPriceInput.value = (product.Precio*parseFloat(tipoCambioInput.value)).toFixed(2);
                }     
                calculateTotal(row.querySelector('input[name="Cantidad[]"]')); // Calculate the total
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

    window.calculateTotal = function(quantityInput) {
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
        const itemsTableBody = document.getElementById('itemsTableBody');
        let baseImponible = 0;
        for (let i = 0; i < itemsTableBody.rows.length; i++) {
            const row = itemsTableBody.rows[i];
            const totalPriceInput = row.querySelector('input[name="P_Total[]"]');
            const totalPrice = parseFloat(totalPriceInput.value);
            if (!isNaN(totalPrice)) {
                baseImponible += totalPrice;
            }
        }
        //console.log(baseImponible);
        document.getElementById('Base_Imponible').value = baseImponible.toFixed(2);
        const igv = baseImponible * 0.18;
        document.getElementById('IGV').value = igv.toFixed(2);
        const total = baseImponible + igv;
        document.getElementById('Total').value = total.toFixed(2);
    }

    function calculateBaseImponible() {
        return parseFloat(document.getElementById('Base_Imponible').value) || 0;
    }

    function calculateIGV() {
        return parseFloat(document.getElementById('IGV').value) || 0;
    }

    function calculateTotal() {
        return parseFloat(document.getElementById('Total').value) || 0;
    }
});
