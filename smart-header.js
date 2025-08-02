/**
 * Smart Header Controller
 * Controls header visibility based on scroll direction
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Smart Header Controller initialized');

    // Variables to track scroll position
    let lastScrollY = window.scrollY;
    let ticking = false;
    let headerHidden = false;

    // Get header element
    const header = document.querySelector('.header-section');
    const mainLayout = document.querySelector('.main-layout');

    if (!header || !mainLayout) {
        console.error('Header or main layout elements not found!');
        return;
    }

    console.log('Header elements found, setting up scroll handler');

    // Function to handle header visibility
    function updateHeaderVisibility() {
        const currentScrollY = window.scrollY;
        
        // At top of page - always show header
        if (currentScrollY <= 10) {
            showHeader();
        } 
        // Scrolling up - show header (if we've scrolled up enough)
        else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 10) {
            showHeader();
        } 
        // Scrolling down - hide header (if we've scrolled down enough)
        else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 5) {
            hideHeader();
        }
        
        lastScrollY = currentScrollY;
    }

    function showHeader() {
        if (!header) return;
        
        // Remove hidden class
        header.classList.remove('header-hidden');
        
        // Adjust main layout padding to make space for header
        if (mainLayout) {
            const headerHeight = header.offsetHeight || 180;
            mainLayout.style.paddingTop = headerHeight + 'px';
        }
        
        headerHidden = false;
        console.log('Header shown');
    }

    function hideHeader() {
        if (!header) return;
        
        // Add hidden class
        header.classList.add('header-hidden');
        
        // Remove padding from main layout when header is hidden
        if (mainLayout) {
            mainLayout.style.paddingTop = '0';
        }
        
        headerHidden = true;
        console.log('Header hidden');
    }

    // Add scroll event listener with throttling
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateHeaderVisibility();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Handle touch events for mobile
    let touchStartY = 0;
    
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    window.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        
        // Going up (negative diff)
        if (diff < -10) {
            showHeader();
        } 
        // Going down (positive diff)
        else if (diff > 10) {
            hideHeader();
        }
        
        touchStartY = touchY;
    }, { passive: true });

    // Initial check
    updateHeaderVisibility();
    
    // Create a visual indicator for debugging
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.right = '10px';
    indicator.style.padding = '8px';
    indicator.style.background = 'rgba(0,0,0,0.7)';
    indicator.style.color = 'white';
    indicator.style.fontSize = '12px';
    indicator.style.borderRadius = '4px';
    indicator.style.zIndex = '9999';
    document.body.appendChild(indicator);
    
    // Update indicator regularly
    setInterval(function() {
        indicator.textContent = headerHidden ? 'Header: Hidden' : 'Header: Visible';
        indicator.style.backgroundColor = headerHidden ? 'green' : 'red';
    }, 100);
});
