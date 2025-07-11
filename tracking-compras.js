// Script para rastrear clics en botones de compra y enviar notificaciones por correo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS
    (function() {
        emailjs.init('J2A-LlpJKrIAzXaOR');
    })();

    // Función para enviar correo electrónico y registrar evento de Facebook
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
        
        // Registrar evento de compra en Facebook con ID único
        const purchaseEventId = generateEventId();
        window.fbEventIds = window.fbEventIds || {};
        window.fbEventIds['Purchase'] = purchaseEventId;
        
        // Datos para el evento de compra
        const purchaseData = {
            content_name: 'Haz que te ame siempre',
            content_type: 'product',
            content_ids: ['N100494926W'],
            value: 9.00,
            currency: 'USD'
        };
        
        // Enviar evento de compra a Facebook con ID
        if (typeof fbq === 'function') {
            fbq('track', 'Purchase', purchaseData, {eventID: purchaseEventId});
            
            // Enviar el evento a la API de conversiones
            if (typeof sendToConversionAPI === 'function') {
                sendToConversionAPI('Purchase', purchaseEventId, purchaseData);
            } else {
                // Implementación alternativa si la función global no está disponible
                sendEventToAPI('Purchase', purchaseEventId, purchaseData);
            }
        }
        
        // Preparar los parámetros para el correo
        const parametros = {
            to_email: 'oscarcastrocantos@gmail.com',
            from_name: 'Notificación de Landing Page',
            subject: 'Nuevo clic en botón de compra',
            message: `Se ha registrado un clic en un botón de compra:\n\nFecha: ${fechaHora}\nURL: ${urlPagina}\nBotón: ${botonTexto}\nDestino: ${botonHref}\nNavegador: ${userAgent}\nEvent ID: ${purchaseEventId}`
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
    
    // Función para generar ID de evento si no está disponible globalmente
    function generateEventId() {
        if (typeof window.generateEventId === 'function') {
            return window.generateEventId();
        }
        return 'event_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '_' + new Date().getTime();
    }
    
    // Función para enviar eventos a la API si la función global no está disponible
    function sendEventToAPI(eventName, eventId, eventData) {
        // Recopilar datos del usuario de forma discreta
        const userData = {
            client_user_agent: navigator.userAgent,
            fbp: getFbp('_fbp'),
            fbc: getFbp('_fbc')
        };
        
        // Preparar los datos para la API
        const apiData = {
            event_name: eventName,
            event_id: eventId,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: window.location.href,
            user_data: userData,
            custom_data: eventData
        };
        
        // Enviar los datos a nuestro endpoint
        fetch('/api/facebook-conversions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(apiData),
            keepalive: true
        }).catch(error => {
            // Manejar errores silenciosamente
            console.error('Error sending to Conversion API:', error);
        });
    }
    
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
        boton.addEventListener('click', enviarNotificacionCompra);
    });
    
    console.log('✅ Sistema de notificaciones inicializado - ' + new Date().toLocaleString());
    console.log('✅ Monitoreando ' + botonesCompra.length + ' botones de compra');
});