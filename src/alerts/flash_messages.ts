// Esperar 3 segundos para cerrar el mensaje flash
window.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(function () {
        let flashMessages = document.querySelectorAll('.flash-messages .alert');
        flashMessages.forEach(function (message) {
            message.classList.remove('show');
            message.classList.add('fade');
        });
    }, 3000); // 3000ms = 3 segundos
});
