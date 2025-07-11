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
    
    // Countdown functionality with localStorage persistence
    function initializeCountdown() {
        // Check if we have an end time stored
        let countdownEndTime = localStorage.getItem('countdownEndTime');
        
        // If no end time exists or it's in the past, create a new one (10 minutes from now)
        if (!countdownEndTime || new Date(parseInt(countdownEndTime)) <= new Date()) {
            countdownEndTime = new Date().getTime() + (10 * 60 * 1000); // 10 minutes from now
            localStorage.setItem('countdownEndTime', countdownEndTime);
        }
        
        // Initial update of the countdown display
        updateCountdownDisplay(countdownEndTime);
        
        // Return the end time for the interval function
        return countdownEndTime;
    }
    
    function updateCountdownDisplay(endTime) {
        // Get current time
        const now = new Date().getTime();
        
        // Calculate remaining time
        let timeRemaining = endTime - now;
        
        // If countdown is finished, reset it
        if (timeRemaining < 0) {
            endTime = new Date().getTime() + (10 * 60 * 1000); // 10 minutes from now
            localStorage.setItem('countdownEndTime', endTime);
            timeRemaining = endTime - now;
        }
        
        // Calculate hours, minutes, seconds
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Update the display
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        return endTime;
    }
    
    // Initialize countdown and get end time
    const countdownEndTime = initializeCountdown();
    
    // Update countdown every second
    setInterval(function() {
        updateCountdownDisplay(countdownEndTime);
    }, 1000);
    
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
