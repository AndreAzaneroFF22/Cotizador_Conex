document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = document.getElementById('user').value;
        const password = document.getElementById('password').value;

         
        try {
            const response = await fetch(`https://apiconexcot.somee.com/api/usuario?usuario=${user}&contrasena=${password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result === true) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Inicio de sesión exitoso.',
                    icon: 'success',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    window.location.href = 'pages/menu.html';
                    localStorage.setItem("usuario",user);
                });
            } else {
                // Show error message for incorrect login
                Swal.fire({
                    title: 'Error',
                    text: 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            // Show error message for fetch error
            Swal.fire({
                title: 'Error',
                text: 'Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});
