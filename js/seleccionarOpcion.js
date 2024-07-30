document.addEventListener('DOMContentLoaded', () => {
    const menuButtons = document.querySelectorAll('.menu-button');
    const contentDivs = document.querySelectorAll('#content > div');

    menuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const option = button.getAttribute('data-option');

            contentDivs.forEach(div => {
                if (div.id === option) {
                    div.classList.remove('hidden');
                } else {
                    div.classList.add('hidden');
                }
            });
        });
    });
});
