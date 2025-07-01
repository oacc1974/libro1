// Script para rastrear clics en botones de compra y enviar notificaciones por correo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS con tu ID de usuario (deberás registrarte en emailjs.com)
    // Reemplaza 'tu_user_id' con tu ID de usuario real después de registrarte
    (function() {
        emailjs.init('tu_user_id');
    })();

    // Función para enviar correo electrónico
    function enviarNotificacionCompra(evento) {
        // Prevenir la navegación inmediata para dar tiempo a enviar el correo
        evento.preventDefault();
        
        // Obtener información del usuario y la página
        const fechaHora = new Date().toLocaleString();
        const urlPagina = window.location.href;
        const userAgent = navigator.userAgent;
        const botonTexto = evento.target.innerText || 'Botón de compra';
        
        // Preparar los parámetros para el correo
        const parametros = {
            to_email: 'oscarcastrocantos@gmail.com',
            from_name: 'Notificación de Landing Page',
            subject: 'Nuevo clic en botón de compra',
            message: `Se ha registrado un clic en un botón de compra:\n\nFecha y hora: ${fechaHora}\nURL: ${urlPagina}\nBotón: ${botonTexto}\nNavegador: ${userAgent}`
        };
        
        // Enviar el correo usando EmailJS
        // Reemplaza 'service_ee3hidr' y 'tu_template_id' con tus IDs reales después de configurar EmailJS
        emailjs.send('service_ee3hidr', 'template_dqmejki', parametros)
            .then(function(response) {
                console.log('Notificación enviada', response.status, response.text);
                // Redirigir al usuario a la URL original después de enviar el correo
                window.location.href = evento.target.href;
            }, function(error) {
                console.error('Error al enviar notificación', error);
                // Redirigir al usuario incluso si hay error
                window.location.href = evento.target.href;
            });
    }
    
    // Obtener todos los botones de compra
    const botonesCompra = document.querySelectorAll('.cta-button');
    
    // Añadir el evento a cada botón
    botonesCompra.forEach(boton => {
        boton.addEventListener('click', enviarNotificacionCompra);
    });
});
