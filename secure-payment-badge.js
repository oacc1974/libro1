/**
 * Script para añadir badges de pago seguro con Hotmart a todos los botones de compra
 */
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los botones de compra
    const buyButtons = document.querySelectorAll('.cta-button, .cta-button-large');
    
    // Para cada botón, añadir el badge de pago seguro
    buyButtons.forEach(button => {
        // Crear el contenedor para el badge si el botón no está ya dentro de un div
        if (button.parentElement.tagName !== 'DIV' || button.parentElement.classList.contains('cta-mid-section')) {
            // Crear un nuevo div que envolverá el botón
            const wrapper = document.createElement('div');
            wrapper.style.display = 'inline-block';
            wrapper.style.textAlign = 'center';
            
            // Colocar el wrapper en lugar del botón
            button.parentNode.insertBefore(wrapper, button);
            wrapper.appendChild(button);
            
            // Crear el badge de pago seguro
            const badge = document.createElement('div');
            badge.className = 'secure-payment-badge';
            badge.innerHTML = '<img src="Imagenes/images.png" alt="Logo Hotmart"> Pago 100% seguro con Hotmart';
            
            // Añadir el badge después del botón
            wrapper.appendChild(badge);
        }
    });
    
    console.log('✅ Badges de pago seguro añadidos a todos los botones de compra');
});
