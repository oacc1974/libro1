// Script para crear urgencia y mejorar conversiones con nuevo diseño
document.addEventListener('DOMContentLoaded', function() {
    // 1. Implementar contador de 10 minutos
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const minutesInlineElement = document.getElementById('minutes-inline');
    const secondsInlineElement = document.getElementById('seconds-inline');
    const minutesFinalElement = document.getElementById('minutes-final');
    const secondsFinalElement = document.getElementById('seconds-final');
    const minutesTestimonialElement = document.getElementById('minutes-testimonial');
    const secondsTestimonialElement = document.getElementById('seconds-testimonial');
    const minutesBenefitElement = document.getElementById('minutes-benefit');
    const secondsBenefitElement = document.getElementById('seconds-benefit');
    
    let totalSeconds = 10 * 60; // 10 minutos en segundos
    
    function updateCountdown() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        
        // Actualizar el contador principal
        if (minutesElement) {
            minutesElement.textContent = minutesStr;
        }
        if (secondsElement) {
            secondsElement.textContent = secondsStr;
        }
        
        // Actualizar el contador inline en la sección de precios
        if (minutesInlineElement) {
            minutesInlineElement.textContent = minutesStr;
        }
        if (secondsInlineElement) {
            secondsInlineElement.textContent = secondsStr;
        }
        
        // Actualizar el contador final
        if (minutesFinalElement) {
            minutesFinalElement.textContent = minutesStr;
        }
        if (secondsFinalElement) {
            secondsFinalElement.textContent = secondsStr;
        }
        
        // Actualizar el contador en la sección de testimonios
        if (minutesTestimonialElement) {
            minutesTestimonialElement.textContent = minutesStr;
        }
        if (secondsTestimonialElement) {
            secondsTestimonialElement.textContent = secondsStr;
        }
        
        // Actualizar el contador en la sección de beneficios
        if (minutesBenefitElement) {
            minutesBenefitElement.textContent = minutesStr;
        }
        if (secondsBenefitElement) {
            secondsBenefitElement.textContent = secondsStr;
        }
        
        // Efecto de urgencia cuando queden menos de 5 minutos
        if (totalSeconds <= 300) {
            document.querySelectorAll('.countdown-number, .countdown-inline').forEach(el => {
                el.style.color = '#e74c3c';
            });
        }
        
        // Efecto de urgencia extrema cuando queden menos de 2 minutos
        if (totalSeconds <= 120) {
            document.querySelectorAll('.countdown-box, .countdown-inline, .final-countdown').forEach(el => {
                el.classList.add('urgent-pulse');
            });
            
            // Añadir efecto de pulso al contador de testimonios
            if (minutesTestimonialElement && secondsTestimonialElement) {
                const testimonialCountdownContainer = minutesTestimonialElement.closest('.countdown-inline');
                if (testimonialCountdownContainer) {
                    testimonialCountdownContainer.classList.add('urgent-pulse');
                }
            }
            
            // Añadir efecto de pulso al contador de beneficios
            if (minutesBenefitElement && secondsBenefitElement) {
                const benefitCountdownContainer = minutesBenefitElement.closest('.countdown-inline');
                if (benefitCountdownContainer) {
                    benefitCountdownContainer.classList.add('urgent-pulse');
                }
                
                // Añadir efecto visual a todo el contenedor de countdown horizontal
                const countdownReminderHorizontal = benefitCountdownContainer?.closest('.countdown-reminder-horizontal');
                if (countdownReminderHorizontal) {
                    countdownReminderHorizontal.style.backgroundColor = '#f8d7da';
                    countdownReminderHorizontal.style.borderColor = '#f5c6cb';
                    countdownReminderHorizontal.style.boxShadow = '0 0 10px rgba(220, 53, 69, 0.5)';
                }
            }
        }
        
        if (totalSeconds > 0) {
            totalSeconds--;
            setTimeout(updateCountdown, 1000);
        } else {
            // Cuando el contador llega a cero
            document.querySelectorAll('.countdown-container, .countdown-reminder, .urgency-timer').forEach(el => {
                el.innerHTML = '<div class="expired-message">OFERTA EXPIRADA</div>';
            });
        }
    }
    
    // Iniciar el contador
    updateCountdown();
    
    // 2. Añadir notificaciones de compras recientes
    const notificaciones = [
        { nombre: "María L.", ciudad: "Madrid", tiempo: "hace 7 minutos" },
        { nombre: "Carlos R.", ciudad: "Barcelona", tiempo: "hace 12 minutos" },
        { nombre: "Laura S.", ciudad: "Valencia", tiempo: "hace 18 minutos" },
        { nombre: "Juan P.", ciudad: "Sevilla", tiempo: "hace 24 minutos" },
        { nombre: "Ana M.", ciudad: "Bilbao", tiempo: "hace 35 minutos" }
    ];
    
    // Crear contenedor de notificaciones
    const notificacionesContainer = document.createElement('div');
    notificacionesContainer.className = 'notificaciones-container';
    document.body.appendChild(notificacionesContainer);
    
    // Mostrar notificaciones aleatorias cada cierto tiempo
    let indiceNotificacion = 0;
    
    function mostrarNotificacion() {
        const notificacion = notificaciones[indiceNotificacion];
        
        const notificacionElement = document.createElement('div');
        notificacionElement.className = 'notificacion-compra';
        notificacionElement.innerHTML = `
            <i class="fas fa-shopping-bag"></i>
            <p><strong>${notificacion.nombre}</strong> de ${notificacion.ciudad} ha comprado este libro ${notificacion.tiempo}</p>
            <span class="cerrar-notificacion">×</span>
        `;
        
        notificacionesContainer.appendChild(notificacionElement);
        
        // Mostrar la notificación con animación
        setTimeout(() => {
            notificacionElement.classList.add('mostrar');
            
            // Configurar el botón de cerrar
            const cerrarBtn = notificacionElement.querySelector('.cerrar-notificacion');
            if (cerrarBtn) {
                cerrarBtn.addEventListener('click', () => {
                    notificacionElement.classList.remove('mostrar');
                    setTimeout(() => {
                        notificacionElement.remove();
                    }, 300);
                });
            }
            
            // Ocultar automáticamente después de 5 segundos
            setTimeout(() => {
                notificacionElement.classList.remove('mostrar');
                setTimeout(() => {
                    notificacionElement.remove();
                }, 300);
            }, 5000);
        }, 300);
        
        // Avanzar al siguiente índice
        indiceNotificacion = (indiceNotificacion + 1) % notificaciones.length;
    }
    
    // Mostrar primera notificación después de 5 segundos
    setTimeout(() => {
        mostrarNotificacion();
        
        // Mostrar notificaciones periódicamente (cada 30-60 segundos)
        setInterval(mostrarNotificacion, Math.random() * 30000 + 30000);
    }, 5000);
    
    // 3. Añadir contador de visitantes actuales
    const visitantesContainer = document.createElement('div');
    visitantesContainer.className = 'visitantes-actuales';
    
    // Generar un número aleatorio entre 27 y 43
    const numeroVisitantes = Math.floor(Math.random() * 17) + 27;
    
    visitantesContainer.innerHTML = `
        <i class="fas fa-users"></i>
        <p><strong>${numeroVisitantes} personas</strong> están viendo esta página ahora mismo</p>
    `;
    
    // Añadir al principio de la sección CTA final
    const ctaFinalSection = document.querySelector('.cta-final .container');
    if (ctaFinalSection) {
        ctaFinalSection.insertBefore(visitantesContainer, ctaFinalSection.firstChild);
    }
    
    // 4. Registrar eventos de Facebook Pixel
    if (typeof fbq !== 'undefined') {
        // Evento para cuando el usuario hace scroll hasta cierto punto
        let hasScrolled50 = false;
        let hasScrolled75 = false;
        
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollPosition / totalHeight) * 100;
            
            if (scrollPercentage > 50 && !hasScrolled50) {
                fbq('track', 'ViewContent', {
                    content_name: 'Haz que te ame siempre - 50% scroll',
                    content_category: 'Engagement'
                });
                hasScrolled50 = true;
            }
            
            if (scrollPercentage > 75 && !hasScrolled75) {
                fbq('track', 'ViewContent', {
                    content_name: 'Haz que te ame siempre - 75% scroll',
                    content_category: 'High Engagement'
                });
                hasScrolled75 = true;
            }
        });
    }
});

// Añadir estilos para los nuevos elementos
const estilos = document.createElement('style');
estilos.textContent = `
    .notificaciones-container {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
    }
    
    .notificacion-compra {
        background-color: white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        max-width: 300px;
        transform: translateX(-120%);
        transition: transform 0.3s ease;
    }
    
    .notificacion-compra.mostrar {
        transform: translateX(0);
    }
    
    .notificacion-compra i {
        color: #28a745;
        font-size: 1.5rem;
        margin-right: 10px;
    }
    
    .notificacion-compra p {
        margin: 0;
        font-size: 0.9rem;
    }
    
    .cerrar-notificacion {
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        font-size: 1.2rem;
    }
    
    .visitantes-actuales {
        background-color: rgba(255,255,255,0.15);
        border-radius: 8px;
        padding: 10px 15px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }
    
    .visitantes-actuales i {
        margin-right: 10px;
        font-size: 1.2rem;
    }
    
    .visitantes-actuales p {
        margin: 0;
    }
`;

document.head.appendChild(estilos);
