// Script para rastrear clics en botones de compra y enviar notificaciones por correo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS
    (function() {
        emailjs.init('J2A-LlpJKrIAzXaOR');
    })();

    // Función para enviar correo electrónico de notificación sin registrar eventos duplicados en Facebook
    function enviarNotificacionClic(evento) {
        // Ya no prevenimos la navegación inmediata para permitir que el enlace funcione normalmente
        // evento.preventDefault();
        
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
        
        // NO registramos eventos de compra o checkout aquí porque Hotmart ya los envía
        // Solo registramos un evento de Lead para seguimiento interno
        const leadEventId = generateEventId();
        window.fbEventIds = window.fbEventIds || {};
        window.fbEventIds['Lead'] = leadEventId;
        
        // Datos para el evento de lead
        const leadData = {
            content_name: 'Haz que te ame siempre - Interés',
            content_category: 'Interés en producto'
        };
        
        // Enviar evento de Lead a Facebook con ID (no Purchase ni InitiateCheckout)
        if (typeof fbq === 'function') {
            fbq('track', 'Lead', leadData, {eventID: leadEventId});
        }
        
        // Preparar los parámetros para el correo
        const parametros = {
            to_email: 'oscarcastrocantos@gmail.com',
            from_name: 'Notificación de Landing Page',
            subject: 'Nuevo clic en botón de compra',
            message: `Se ha registrado un clic en un botón de compra:\n\nFecha: ${fechaHora}\nURL: ${urlPagina}\nBotón: ${botonTexto}\nDestino: ${botonHref}\nNavegador: ${userAgent}\nEvent ID: ${leadEventId}`
        };
        
        // Enviar el correo usando EmailJS sin prevenir la navegación
        emailjs.send('service_ee3hidr', 'template_pdhp4ye', parametros)
            .then(function(response) {
                console.log('✅ Notificación enviada', response.status);
                // Ya no necesitamos redirigir manualmente, el navegador lo hará automáticamente
            }, function(error) {
                console.error('❌ Error al enviar', error);
                // Ya no necesitamos redirigir manualmente, el navegador lo hará automáticamente
            });
            
        // Permitir que el enlace siga su comportamiento normal
        return true;
    }
    
    // Función para generar ID de evento si no está disponible globalmente
    function generateEventId() {
        if (typeof window.generateEventId === 'function') {
            return window.generateEventId();
        }
        return 'event_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '_' + new Date().getTime();
    }
    
    // Ya no necesitamos enviar eventos a la API porque Hotmart se encarga de eso
    
    // Función para obtener cookies de Facebook
    function getFbp(cookieName) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName + '=') === 0) {
                return cookie.substring(cookieName.length + 1);
            }
        }
        return null;
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
        boton.addEventListener('click', enviarNotificacionClic);
    });
    
    console.log('✅ Sistema de notificaciones inicializado - ' + new Date().toLocaleString());
    console.log('✅ Monitoreando ' + botonesCompra.length + ' botones de compra');
});