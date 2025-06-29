// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    for (const link of links) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Add animation to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.benefit-item, .chapter, .testimonial, .bonus-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    const elementsToAnimate = document.querySelectorAll('.benefit-item, .chapter, .testimonial, .bonus-item');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    animateOnScroll();
    
    // El contador ahora está integrado en el HTML, no necesitamos crearlo dinámicamente
    
    // Countdown functionality
    function updateCountdown() {
        let hours = parseInt(document.getElementById('hours').textContent);
        let minutes = parseInt(document.getElementById('minutes').textContent);
        let seconds = parseInt(document.getElementById('seconds').textContent);
        
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            
            if (minutes < 0) {
                minutes = 59;
                hours--;
                
                if (hours < 0) {
                    // Reset countdown when it reaches zero
                    hours = 24;
                    minutes = 0;
                    seconds = 0;
                }
            }
        }
        
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    
    // Add CSS for countdown
    const style = document.createElement('style');
    style.textContent = `
        .countdown {
            margin-bottom: 30px;
            color: white;
        }
        
        .countdown-title {
            font-size: 1.2rem;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .countdown-timer {
            display: flex;
            justify-content: center;
            gap: 15px;
        }
        
        .countdown-item {
            background-color: rgba(255, 255, 255, 0.2);
            padding: 10px 15px;
            border-radius: 8px;
            min-width: 80px;
            text-align: center;
        }
        
        .countdown-item span {
            display: block;
        }
        
        #hours, #minutes, #seconds {
            font-size: 1.8rem;
            font-weight: 700;
        }
        
        .countdown-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        @media (max-width: 576px) {
            .countdown-timer {
                gap: 10px;
            }
            
            .countdown-item {
                min-width: 60px;
                padding: 8px 10px;
            }
            
            #hours, #minutes, #seconds {
                font-size: 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
});
