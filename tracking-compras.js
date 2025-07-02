// Script para rastrear clics en botones de compra y enviar notificaciones por correo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS
    (function() {
        emailjs.init('J2A-LlpJKrIAzXaOR');
    })();

    // Función para enviar correo electrónico
    function enviarNotificacionCompra(evento) {
        // Prevenir la navegación inmediata
        evento.preventDefault();
        
        // Obtener información del usuario y la página
        const fechaHora = new Date().toLocaleString();
        const urlPagina = window.location.href;
        const userAgent = navigator.userAgent;
        
        // Obtener el botón real
        let boton = evento.target;
        // Buscar el botón padre si se hizo clic en un elemento hijo
        if (!boton.tagName || boton.tagName.toLowerCase() !== 'a') {
            boton = boton.closest('a');
        }
        
        const botonTexto = boton ? boton.innerText.trim() : 'Botón de compra';
        const botonHref = boton ? boton.getAttribute('href') : '';
        
        // Preparar los parámetros para el correo
        const parametros = {
            to_email: 'oscarcastrocantos@gmail.com',
            from_name: 'Notificación de Landing Page',
            subject: 'Nuevo clic en botón de compra',
            message: `Se ha registrado un clic en un botón de compra:\n\nFecha: ${fechaHora}\nURL: ${urlPagina}\nBotón: ${botonTexto}\nDestino: ${botonHref}\nNavegador: ${userAgent}`
        };
        
        // Enviar el correo usando EmailJS
        emailjs.send('service_ee3hidr', 'template_pdhp4ye', parametros)
            .then(function(response) {
                console.log('✅ Notificación enviada', response.status);
                if (botonHref) {
                    window.location.href = botonHref;
                }
            }, function(error) {
                console.error('❌ Error al enviar', error);
                if (botonHref) {
                    window.location.href = botonHref;
                }
            });
    }
    
    // Obtener TODOS los enlaces de la página
    const todosLosEnlaces = document.querySelectorAll('a');
    
    // Filtrar solo los enlaces que parecen ser de compra
    const botonesCompra = Array.from(todosLosEnlaces).filter(enlace => {
        const href = enlace.getAttribute('href') || '';
        const texto = enlace.innerText.toLowerCase();
        
        // Verificar si es un botón de compra basado en su clase, href o texto
        return enlace.classList.contains('cta-button') || 
               href.includes('#comprar') || 
               href.includes('hotmart') || 
               texto.includes('comprar') || 
               texto.includes('adquirir') || 
               texto.includes('obtener') ||
               texto.includes('pagar');
    });
    
    // Añadir el evento a cada botón de compra
    botonesCompra.forEach(boton => {
        boton.addEventListener('click', enviarNotificacionCompra);
    });
    
    console.log('✅ Sistema de notificaciones inicializado - ' + new Date().toLocaleString());
    console.log('✅ Monitoreando ' + botonesCompra.length + ' botones de compra');
});